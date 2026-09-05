import { NextResponse } from 'next/server';
import { Category, Tool } from '@/models';

export async function GET() {
  try {
    const categories = await Category.findAll({
      include: [{ model: Tool, as: 'tools', attributes: ['id'] }],
      order: [['name', 'ASC']],
    });

    const withCounts = categories.map((cat) => {
      const plain = cat.toJSON();
      return { ...plain, toolCount: plain.tools?.length || 0, tools: undefined };
    });

    return NextResponse.json(withCounts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const { name, parentCategoryId } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }

  try {
    const category = await Category.create({
      name: name.trim(),
      parentCategoryId: parentCategoryId || null,
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}