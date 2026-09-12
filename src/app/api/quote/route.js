import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Tool, RentalQuote, User } from '@/models';
import { getToolAvailability } from '@/lib/inventory';

function calculateCost(hourlyRate, dailyRate, weeklyRate, start, end) {
  const msPerHour = 1000 * 60 * 60;
  const totalHours = Math.ceil((end - start) / msPerHour);

  if (totalHours <= 0) {
    throw new Error('End time must be after start time');
  }

  if (totalHours <= 24) {
    return Math.min(hourlyRate * totalHours, dailyRate);
  }

  const totalDays = Math.ceil(totalHours / 24);

  if (totalDays < 7) {
    return dailyRate * totalDays;
  }

  const weeks = Math.floor(totalDays / 7);
  const remainderDays = totalDays % 7;
  return weeks * weeklyRate + Math.min(remainderDays * dailyRate, weeklyRate);
}

export async function POST(request) {
  const body = await request.json();
  const { toolId, startDatetime, endDatetime, quoteId } = body;

  if (!toolId || !startDatetime || !endDatetime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const tool = await Tool.findByPk(toolId);
  if (!tool) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
  }

  const start = new Date(startDatetime);
  const end = new Date(endDatetime);

  let cost;
  try {
    cost = calculateCost(
      Number(tool.hourlyRate),
      Number(tool.dailyRate),
      Number(tool.weeklyRate),
      start,
      end
    );
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
  const availability = await getToolAvailability(toolId, start, end);

  let quoteRecord;
  if (quoteId && userId) {
    const existing = await RentalQuote.findOne({ where: { id: quoteId, userId } });
    if (existing) {
      await existing.update({
        toolId,
        startDatetime: start,
        endDatetime: end,
        calculatedCost: cost.toFixed(2),
      });
      quoteRecord = existing.toJSON();
    }
  }

  if (!quoteRecord && userId) {
    const duplicate = await RentalQuote.findOne({
      where: { userId, toolId, startDatetime: start, endDatetime: end }
    });
    if (duplicate) {
      await duplicate.update({ calculatedCost: cost.toFixed(2) });
      quoteRecord = duplicate.toJSON();
    }
  }

  if (!quoteRecord) {
    const created = await RentalQuote.create({
      toolId,
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