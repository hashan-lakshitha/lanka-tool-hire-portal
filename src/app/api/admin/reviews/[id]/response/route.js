import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Review, CompanyResponse } from '@/models';

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { responseBody } = body;

  if (!responseBody) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const adminUserId = session.user.id;

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const existing = await CompanyResponse.findOne({ where: { reviewId: id } });
    if (existing) {
      return NextResponse.json({ error: 'This review already has a company response' }, { status: 409 });
    }

    const response = await CompanyResponse.create({
      reviewId: id,
      adminUserId,
      body: responseBody,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit response' }, { status: 500 });
  }
}