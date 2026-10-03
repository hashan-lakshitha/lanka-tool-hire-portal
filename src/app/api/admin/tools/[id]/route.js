import { NextResponse } from 'next/server';
import { Tool } from '@/models';
import { validateToolInput, validationErrorBody } from '@/lib/toolValidation';

export async function PATCH(request, { params }) {
  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const tool = await Tool.findByPk(id);
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    const { errors, data } = await validateToolInput(body, { partial: true });
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(validationErrorBody(errors), { status: 400 });
    }

    await tool.update(data);
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
    if (error?.name === 'SequelizeForeignKeyConstraintError') {
      return NextResponse.json(
        { error: 'This tool has reviews, quotes or rentals linked to it and cannot be deleted. Deactivate it instead.' },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete tool' }, { status: 500 });
  }
}