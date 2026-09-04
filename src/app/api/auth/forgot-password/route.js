import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { User } from '@/models';
import { sendPasswordResetEmail } from '@/lib/mailer';

const TOKEN_VALID_MINUTES = 30;

export async function POST(request) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Always return the same generic response whether or not the email
  // exists, so this endpoint can't be used to check which emails are
  // registered.
  const genericResponse = NextResponse.json({
    message: 'If an account exists for that email, a reset link has been sent.',
  });

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return genericResponse;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + TOKEN_VALID_MINUTES * 60 * 1000);

  await user.update({ resetTokenHash: tokenHash, resetTokenExpiresAt: expiresAt });

  const resetUrl = `/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

  console.log('[forgot-password] Attempting send. GMAIL_USER set:', !!process.env.GMAIL_USER, '| to:', email);

  try {
    await sendPasswordResetEmail(email, resetUrl);
    console.log('[forgot-password] sendMail resolved without error.');
  } catch (error) {
    console.error('[forgot-password] Failed to send reset email:', error);
    return NextResponse.json(
      { error: 'Could not send reset email. Please try again later.' },
      { status: 500 }
    );
  }

  return genericResponse;
}