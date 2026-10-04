import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Rental, Tool, RentalQuote, User } from '@/models';
import { getToolAvailability } from '@/lib/inventory';
import { calculateToolCost, parseDate } from '@/lib/pricing';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== 'customer') {
    return NextResponse.json({ error: 'Please log in to hire a tool' }, { status: 401 });
  }

  let userId = session.user.id;
  if (!userId && session.user.email) {
    const dbUser = await User.findOne({ where: { email: session.user.email } });
    if (dbUser) userId = dbUser.id;
  }

  const body = await request.json();
  const { toolId, startDate, endDate, quoteId } = body;

  if (!toolId || !startDate || !endDate) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start || !end) {
    return NextResponse.json({ error: 'Invalid start or end date' }, { status: 400 });
  }

  if (end <= start) {
    return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
  }

  try {
    const tool = await Tool.findByPk(toolId);
    if (!tool || tool.status !== 'active') {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    const availability = await getToolAvailability(tool.id, start, end);
    if (!availability.isAvailable) {
      return NextResponse.json({
        error: `Out of stock for selected dates (${availability.activeOverlaps} of ${availability.totalQuantity} units currently hired).`
      }, { status: 400 });
    }

    // Never trust a client-supplied price - always recompute from the tool's rates.
    const totalCost = calculateToolCost(tool, start, end).toFixed(2);

    const rental = await Rental.create({
      toolId: tool.id,
      userId,
      startDate: start,
      endDate: end,
      totalCost,
      status: 'pending',
    });

    // Remove converted quote from My Quotes once hired
    if (quoteId) {
      await RentalQuote.destroy({ where: { id: quoteId, userId } });
    } else {
      await RentalQuote.destroy({ where: { userId, toolId, startDatetime: start, endDatetime: end } });
    }

    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    console.error('Create rental error:', error);
    return NextResponse.json({ error: 'Failed to create rental' }, { status: 500 });
  }
}
