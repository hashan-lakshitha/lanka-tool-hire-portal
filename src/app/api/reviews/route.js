import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Review, User, ReviewComment } from '@/models';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const toolId = searchParams.get('toolId');

  if (!toolId) {
    return NextResponse.json({ error: 'toolId query param is required' }, { status: 400 });
  }

  try {
    const reviews = await Review.findAll({
      where: { toolId, status: 'approved' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        {
          model: ReviewComment,
          as: 'comments',
          where: { status: 'approved' },
          required: false,
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== 'customer') {
    return NextResponse.json({ error: 'You must be logged in to submit a review' }, { status: 401 });
  }

  const body = await request.json();
  const {
    toolId, title, reviewBody,
    performanceRating, customerServiceRating, supportRating, afterSalesRating, miscRating,
  } = body;

  if (!toolId || !title || !reviewBody
      || !performanceRating || !customerServiceRating || !supportRating || !afterSalesRating) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const review = await Review.create({
      toolId,
      userId: session.user.id,
      title,
      body: reviewBody,
      performanceRating,
      customerServiceRating,
      supportRating,
      afterSalesRating,
      miscRating: miscRating ?? null,
      status: 'pending',
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}