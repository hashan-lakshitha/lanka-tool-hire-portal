import { NextResponse } from 'next/server';
import { Tool } from '@/models';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  try {
    const tool = await Tool.findByPk(id);
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    const allowedFields = [
      'categoryId', 'name', 'description', 'imageUrl',
      'hourlyRate', 'dailyRate', 'weeklyRate', 'status', 'totalQuantity',
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) updates[field] = body[field];
    }

    await tool.update(updates);
    return NextResponse.json(tool);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update tool' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    const tool = await Tool.findByPk(id);
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    await tool.destroy();
    return NextResponse.json({ message: 'Tool permanently deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete tool' }, { status: 500 });
  }
}