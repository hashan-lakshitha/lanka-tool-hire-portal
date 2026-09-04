'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { KeyRound, Mail, Send, ArrowLeft } from 'lucide-react';
import '@/lib/i18n';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send reset link.');
        return;
      }

      setMessage(data.message || 'If an account exists with this email, a reset link has been sent.');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#ecf0f1] py-12 px-6 font-sans">
      <div className="mx-auto w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <KeyRound size={28} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#34495e]">
            {t('auth.forgotPasswordTitle', 'Forgot Your Password?')}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Enter your registered email address below and we&apos;ll send you a password reset link.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-md bg-emerald-50 p-4 border border-emerald-200">
            <p className="text-sm text-emerald-800 font-medium">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-md bg-rose-50 p-4 border border-rose-200">
            <p className="text-sm text-rose-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email', 'Email Address')}
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-[#3498db] py-2.5 px-4 text-sm font-semibold text-white shadow hover:bg-[#2980b9] focus:outline-none disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
            {loading ? t('auth.sending', 'Sending Link...') : t('auth.sendResetLink', 'Send Reset Link')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/login" className="inline-flex items-center gap-1 font-semibold text-[#3498db] hover:underline">
            <ArrowLeft size={14} /> {t('auth.loginLink', 'Back to Sign In')}
          </Link>
        </div>
      </div>
    </div>
  );
}