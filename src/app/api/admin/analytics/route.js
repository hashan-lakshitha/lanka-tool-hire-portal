import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const { sequelize, Rental, Tool, Review, User, Category } = require('@/models');
const { Op, fn, col, literal } = require('sequelize');

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Revenue by month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const revenueByMonth = await sequelize.query(`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') AS month,
        SUM(totalCost) AS revenue,
        COUNT(*) AS count
      FROM rentals
      WHERE status NOT IN ('cancelled')
        AND createdAt >= :since
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month ASC
    `, {
      replacements: { since: twelveMonthsAgo },
      type: sequelize.QueryTypes.SELECT,
    });

    // 2. Rental status breakdown
    const statusBreakdown = await Rental.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // 3. Top 5 most rented tools
    const popularTools = await Rental.findAll({
      attributes: [
        'toolId',
        [fn('COUNT', col('Rental.id')), 'rentalCount'],
        [fn('SUM', col('totalCost')), 'totalRevenue'],
      ],
      include: [{
        model: Tool,
        as: 'tool',
        attributes: ['name'],
      }],
      where: { status: { [Op.ne]: 'cancelled' } },
      group: ['toolId', 'tool.id', 'tool.name'],
      order: [[literal('rentalCount'), 'DESC']],
      limit: 5,
      raw: true,
      nest: true,
    });

    // 4. Review stats
    const totalReviews = await Review.count();
    const reviewStatusBreakdown = await Review.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    const avgRatings = await Review.findAll({
      attributes: [
        [fn('AVG', col('performanceRating')), 'avgPerformance'],
        [fn('AVG', col('customerServiceRating')), 'avgCustomerService'],
        [fn('AVG', col('supportRating')), 'avgSupport'],
        [fn('AVG', col('afterSalesRating')), 'avgAfterSales'],
      ],
      where: { status: 'approved' },
      raw: true,
    });

    const overallAvg = avgRatings[0]
      ? (
          (Number(avgRatings[0].avgPerformance || 0) +
            Number(avgRatings[0].avgCustomerService || 0) +
            Number(avgRatings[0].avgSupport || 0) +
            Number(avgRatings[0].avgAfterSales || 0)) / 4
        ).toFixed(1)
      : '0.0';

    // 5. Recent rentals (last 10)
    const recentRentals = await Rental.findAll({
      include: [
        { model: Tool, as: 'tool', attributes: ['name'] },
        { model: User, as: 'user', attributes: ['name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
      raw: true,
      nest: true,
    });

    // 6. Summary stats
    const totalRentals = await Rental.count();
    const activeRentals = await Rental.count({ where: { status: 'active' } });
    const totalRevenue = await Rental.sum('totalCost', {
      where: { status: { [Op.ne]: 'cancelled' } },
    });
    const totalTools = await Tool.count();
    const totalUsers = await User.count();
    const totalCategories = await Category.count();

    return NextResponse.json({
      revenueByMonth,
      statusBreakdown,
      popularTools: popularTools.map((t) => ({
        name: t.tool?.name || 'Unknown',
        rentalCount: Number(t.rentalCount),
        totalRevenue: Number(t.totalRevenue || 0),
      })),
      reviewStats: {
        total: totalReviews,
        overallAvg: Number(overallAvg),
        breakdown: reviewStatusBreakdown,
        avgRatings: avgRatings[0] || {},
      },
      recentRentals: recentRentals.map((r) => ({
        id: r.id,
        tool: r.tool?.name || 'Unknown',
        customer: r.user?.name || r.user?.email || 'Unknown',
        status: r.status,
        totalCost: Number(r.totalCost),
        startDate: r.startDate,
        endDate: r.endDate,
        createdAt: r.createdAt,
      })),
      summary: {
        totalRentals,
        activeRentals,
        totalRevenue: Number(totalRevenue || 0),
        totalTools,
        totalUsers,
        totalCategories,
      },
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
