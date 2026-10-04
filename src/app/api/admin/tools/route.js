import { NextResponse } from 'next/server';
import { Tool, Category } from '@/models';
import { validateToolInput, validationErrorBody } from '@/lib/toolValidation';

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
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const { errors, data } = await validateToolInput(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(validationErrorBody(errors), { status: 400 });
    }

    const tool = await Tool.create(data);
    return NextResponse.json(tool, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create tool' }, { status: 500 });
  }
}