import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Rental, Tool } from '@/models';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== 'customer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rentals = await Rental.findAll({
      where: { userId: session.user.id },
      include: [{ model: Tool, as: 'tool', attributes: ['id', 'name', 'dailyRate', 'imageUrl'] }],
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(rentals);
  } catch (error) {
    console.error('Fetch customer rentals error:', error);
    return NextResponse.json({ error: 'Failed to fetch rentals' }, { status: 500 });
  }
}
