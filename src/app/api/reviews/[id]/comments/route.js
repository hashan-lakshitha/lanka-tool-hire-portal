import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Review, ReviewComment } from '@/models';

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== 'customer') {
    return NextResponse.json({ error: 'You must be logged in to comment' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { commentBody } = body;

  if (!commentBody) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const comment = await ReviewComment.create({
      reviewId: id,
      userId: session.user.id,
      body: commentBody,
      status: 'pending',
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
  }
}