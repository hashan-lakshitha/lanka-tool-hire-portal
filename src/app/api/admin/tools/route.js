import { NextResponse } from 'next/server';
import { Tool, Category } from '@/models';

export async function GET() {
  try {
    const tools = await Tool.findAll({
      include: [{ model: Category, as: 'category' }],
      order: [['name', 'ASC']],
    });
    return NextResponse.json(tools);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const { categoryId, name, description, imageUrl, hourlyRate, dailyRate, weeklyRate, totalQuantity } = body;

  if (!categoryId || !name || !description || !hourlyRate || !dailyRate || !weeklyRate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const tool = await Tool.create({
      categoryId,
      name,
      description,
      imageUrl,
      hourlyRate,
      dailyRate,
      weeklyRate,
      totalQuantity: totalQuantity ? Number(totalQuantity) : 5,
    });
    return NextResponse.json(tool, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create tool' }, { status: 500 });
  }
}