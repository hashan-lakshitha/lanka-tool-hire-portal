import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RentalQuote, User } from '@/models';

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== 'customer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let userId = session.user.id;
  if (!userId && session.user.email) {
    const dbUser = await User.findOne({ where: { email: session.user.email } });
    if (dbUser) userId = dbUser.id;
  }

  const { id } = await params;

  try {
    const quote = await RentalQuote.findOne({
      where: { id, userId }
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    await quote.destroy();

    return NextResponse.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Delete quote error:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}
