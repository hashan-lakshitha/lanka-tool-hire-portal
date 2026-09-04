'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import '@/lib/i18n';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token || !email) {
    return (
      <div className="flex min-h-screen flex-col justify-center bg-[#ecf0f1] py-12 px-6 font-sans">
        <div className="mx-auto w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
            <AlertTriangle size={28} className="text-rose-500" />
          </div>
          <h1 className="text-xl font-bold text-rose-600 mb-2">Invalid Link</h1>
          <p className="text-sm text-gray-600 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 rounded-md bg-[#3498db] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#2980b9]"
          >
            <RefreshCw size={16} /> Request a New Link
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirm) {
      setError(t('auth.passwordsDoNotMatch', 'Passwords do not match'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password.');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col justify-center bg-[#ecf0f1] py-12 px-6 font-sans">
        <div className="mx-auto w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle size={28} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#34495e] mb-2">
            Password Updated!
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            {t('auth.passwordUpdated', 'Password updated successfully. Redirecting to login...')}
          </p>
          <Link
            href="/login"
            className="font-semibold text-[#3498db] hover:underline text-sm"
          >
            Click here if you are not redirected
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#ecf0f1] py-12 px-6 font-sans">
      <div className="mx-auto w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ecf0f1]">
            <ShieldCheck size={28} className="text-[#3498db]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#34495e]">
            {t('auth.resetPasswordTitle', 'Set New Password')}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Please enter your new password below.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-rose-50 p-4 border border-rose-200">
            <p className="text-sm text-rose-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.newPassword', 'New Password')} (min. 8 characters)
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="newPassword"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.confirmPassword', 'Confirm Password')}
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-[#3498db] py-2.5 px-4 text-sm font-semibold text-white shadow hover:bg-[#2980b9] focus:outline-none disabled:opacity-50 transition-colors"
          >
            <ShieldCheck size={16} />
            {loading ? t('auth.updating', 'Updating...') : t('auth.updatePasswordBtn', 'Update Password')}
          </button>
        </form>
      </div>
    </div>
  );
}