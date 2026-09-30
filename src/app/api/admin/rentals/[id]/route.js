import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Rental } from '@/models';

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  const validStatuses = ['pending', 'confirmed', 'active', 'returned', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const rental = await Rental.findByPk(id);
    if (!rental) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 });
    }

    await rental.update({ status });

    return NextResponse.json({ message: 'Rental updated', rental });
  } catch (error) {
    console.error('Update rental error:', error);
    return NextResponse.json({ error: 'Failed to update rental' }, { status: 500 });
  }
}
