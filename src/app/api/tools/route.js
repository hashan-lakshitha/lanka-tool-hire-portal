import { NextResponse } from 'next/server';
import { Tool, Category, Review } from '@/models';
import { Op } from 'sequelize';
import { computeOverallRating } from '@/lib/rating';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy') || 'name';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));

  const where = { status: 'active' };
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  try {
    const { rows, count } = await Tool.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category' },
        {
          model: Review,
          as: 'reviews',
          where: { status: 'approved' },
          required: false,
          attributes: ['performanceRating', 'customerServiceRating', 'supportRating', 'afterSalesRating'],
        },
      ],
      order: [['name', 'ASC']],
      distinct: true,
    });

    let results = rows.map((tool) => {
      const plain = tool.toJSON();
      const { averageRating, reviewCount } = computeOverallRating(plain.reviews);
      delete plain.reviews;
      return { ...plain, averageRating, reviewCount };
    });

    if (sortBy === 'rating') {
      results.sort((a, b) => (b.averageRating ?? -1) - (a.averageRating ?? -1));
    } else if (sortBy === 'priceLow') {
      results.sort((a, b) => Number(a.dailyRate) - Number(b.dailyRate));
    } else if (sortBy === 'priceHigh') {
      results.sort((a, b) => Number(b.dailyRate) - Number(a.dailyRate));
    }

    const totalPages = Math.max(1, Math.ceil(count / limit));
    const paged = results.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      tools: paged,
      pagination: { page, limit, total: count, totalPages },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}