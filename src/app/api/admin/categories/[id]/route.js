import { NextResponse } from 'next/server';
import { Category, Tool } from '@/models';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const { name, parentCategoryId } = body;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
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