import { NextResponse } from 'next/server';
import { Tool, Category, Review, User } from '@/models';
import { computeOverallRating } from '@/lib/rating';

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const tool = await Tool.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        {
          model: Review,
          as: 'reviews',
          where: { status: 'approved' },
          required: false,
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
        },
      ],
    });

    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    const plain = tool.toJSON();
    const { averageRating, reviewCount } = computeOverallRating(plain.reviews);

    return NextResponse.json({ ...plain, averageRating, reviewCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch tool' }, { status: 500 });
  }
}