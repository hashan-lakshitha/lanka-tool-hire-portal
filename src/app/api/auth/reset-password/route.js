import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { User } from '@/models';
import { Op } from 'sequelize';

export async function POST(request) {
  const body = await request.json();
  const { email, token, newPassword } = body;

  if (!email || !token || !newPassword) {
    return NextResponse.json(
      { error: 'Email, token, and new password are all required.' },
      { status: 400 }
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 }
    );
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    where: {
      email,
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid or expired reset link. Please request a new one.' },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await user.update({
    password: hashedPassword,
    resetTokenHash: null,
    resetTokenExpiresAt: null,
  });

  return NextResponse.json({ message: 'Password has been reset successfully.' });
}