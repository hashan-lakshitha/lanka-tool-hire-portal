import { NextResponse } from 'next/server';
import { Category, Tool } from '@/models';
import { findCategoryByName, CATEGORY_NAME_MAX } from '@/lib/categories';

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
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { name, parentCategoryId } = body || {};

  const trimmed = typeof name === 'string' ? name.trim() : '';
  if (!trimmed) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }
  if (trimmed.length > CATEGORY_NAME_MAX) {
    return NextResponse.json({ error: `Category name must be ${CATEGORY_NAME_MAX} characters or fewer` }, { status: 400 });
  }

  try {
    if (await findCategoryByName(trimmed)) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }

    const category = await Category.create({
      name: trimmed,
      parentCategoryId: parentCategoryId || null,
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}