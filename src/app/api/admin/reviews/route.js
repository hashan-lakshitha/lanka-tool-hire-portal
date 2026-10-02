import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Review, User, Tool } from '@/models';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';

  try {
    const reviews = await Review.findAll({
      where: { status },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Tool, as: 'tool', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'ASC']],
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { reviewId, status } = body;
  const moderatedByAdminId = session.user.id;

  if (!reviewId || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json(
      { error: 'reviewId and a valid status (approved/rejected) are required' },
      { status: 400 }
    );
  }

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await review.update({
      status,
      moderatedByAdminId: moderatedByAdminId ?? null,
      moderatedAt: new Date(),
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to moderate review' }, { status: 500 });
  }
}