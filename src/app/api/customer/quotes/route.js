import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RentalQuote, Tool, User } from '@/models';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== 'customer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let userId = session.user.id;
  if (!userId && session.user.email) {
    const dbUser = await User.findOne({ where: { email: session.user.email } });
    if (dbUser) userId = dbUser.id;
  }

  try {
    const quotes = await RentalQuote.findAll({
      where: { userId },
      include: [{ model: Tool, as: 'tool', attributes: ['id', 'name', 'dailyRate', 'imageUrl'] }],
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Fetch customer quotes error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
