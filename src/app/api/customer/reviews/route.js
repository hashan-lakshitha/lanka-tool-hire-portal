import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Review, Tool, CompanyResponse } from '@/models';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== 'customer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reviews = await Review.findAll({
      where: { userId: session.user.id },
      include: [
        { model: Tool, as: 'tool', attributes: ['id', 'name', 'imageUrl'] },
        { model: CompanyResponse, as: 'response' },
      ],
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Fetch customer reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
