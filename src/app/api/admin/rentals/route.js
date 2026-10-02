import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Rental, Tool, User } from '@/models';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rentals = await Rental.findAll({
      include: [
        { model: Tool, as: 'tool', attributes: ['id', 'name', 'dailyRate', 'imageUrl'] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(rentals);
  } catch (error) {
    console.error('Admin fetch rentals error:', error);
    return NextResponse.json({ error: 'Failed to fetch rentals' }, { status: 500 });
  }
}
