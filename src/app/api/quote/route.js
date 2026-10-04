import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Tool, RentalQuote, User } from '@/models';
import { getToolAvailability } from '@/lib/inventory';
import { calculateToolCost, parseDate } from '@/lib/pricing';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { toolId, startDatetime, endDatetime, quoteId } = body || {};

  if (!toolId || !startDatetime || !endDatetime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const start = parseDate(startDatetime);
  const end = parseDate(endDatetime);
  if (!start || !end) {
    return NextResponse.json({ error: 'Invalid start or end date' }, { status: 400 });
  }

  try {
    const tool = await Tool.findByPk(toolId);
    if (!tool || tool.status !== 'active') {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    let cost;
    try {
      cost = calculateToolCost(tool, start, end);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Save or update quote if customer is logged in
    const session = await getServerSession(authOptions);
    let userId = null;

    if (session?.user?.userType === 'customer') {
      if (session.user.id) {
        userId = Number(session.user.id);
      } else if (session.user.email) {
        const dbUser = await User.findOne({ where: { email: session.user.email } });
        if (dbUser) userId = dbUser.id;
      }
    }
    const availability = await getToolAvailability(tool.id, start, end);

    let quoteRecord;
    if (quoteId && userId) {
      const existing = await RentalQuote.findOne({ where: { id: quoteId, userId } });
      if (existing) {
        await existing.update({
          toolId: tool.id,
          startDatetime: start,
          endDatetime: end,
          calculatedCost: cost.toFixed(2),
        });
        quoteRecord = existing.toJSON();
      }
    }

    if (!quoteRecord && userId) {
      const duplicate = await RentalQuote.findOne({
        where: { userId, toolId: tool.id, startDatetime: start, endDatetime: end }
      });
      if (duplicate) {
        await duplicate.update({ calculatedCost: cost.toFixed(2) });
        quoteRecord = duplicate.toJSON();
      }
    }

    if (!quoteRecord) {
      const created = await RentalQuote.create({
        toolId: tool.id,
        userId,
        startDatetime: start,
        endDatetime: end,
        calculatedCost: cost.toFixed(2),
      });
      quoteRecord = created.toJSON();
    }

    return NextResponse.json({
      ...quoteRecord,
      availability,
    });
  } catch (error) {
    console.error('Quote error:', error);
    return NextResponse.json({ error: 'Could not calculate cost. Please try again.' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const toolId = searchParams.get('toolId');

  if (!toolId) {
    return NextResponse.json({ error: 'Missing toolId parameter' }, { status: 400 });
  }

  const quotes = await RentalQuote.findAll({
    where: { toolId },
    order: [['createdAt', 'DESC']],
  });

  return NextResponse.json(quotes);
}