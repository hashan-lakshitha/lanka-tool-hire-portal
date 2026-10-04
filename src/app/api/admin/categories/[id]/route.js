import { NextResponse } from 'next/server';
import { Category, Tool } from '@/models';
import { findCategoryByName, CATEGORY_NAME_MAX } from '@/lib/categories';

export async function PATCH(request, { params }) {
  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { name, parentCategoryId } = body || {};

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updates = {};
    if (name !== undefined) {
      const trimmed = typeof name === 'string' ? name.trim() : '';
      if (!trimmed) {
        return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
      }
      if (trimmed.length > CATEGORY_NAME_MAX) {
        return NextResponse.json({ error: `Category name must be ${CATEGORY_NAME_MAX} characters or fewer` }, { status: 400 });
      }
      if (await findCategoryByName(trimmed, category.id)) {
        return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
      }
      updates.name = trimmed;
    }
    if (parentCategoryId !== undefined) updates.parentCategoryId = parentCategoryId || null;

    await category.update(updates);
    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const toolCount = await Tool.count({ where: { categoryId: id } });
    if (toolCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${toolCount} tool(s) still belong to this category. Reassign or remove them first.` },
        { status: 409 }
      );
    }

    const childCount = await Category.count({ where: { parentCategoryId: id } });
    if (childCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${childCount} sub-categor${childCount === 1 ? 'y' : 'ies'} still reference this category.` },
        { status: 409 }
      );
    }

    await category.destroy();
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}