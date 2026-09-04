'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';
import '@/lib/i18n';

function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuccess(t('auth.registrationSuccess', 'Registration successful! Please sign in below.'));
    }
  }, [searchParams, t]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await signIn('customer-credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(t('auth.invalidCredentials', 'Invalid email or password'));
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email', 'Email Address')}</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 text-sm focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              placeholder="customer@example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password', 'Password')}</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 text-sm focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Link href="/forgot-password" className="text-sm font-medium text-[#3498db] hover:underline">
          {t('auth.forgotPassword', 'Forgot your password?')}
        </Link>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#3498db] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2980b9] focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2 disabled:bg-gray-400 transition-colors"
        >
          <LogIn size={16} />
          {loading ? t('auth.signingIn', 'Signing in...') : t('auth.signInBtn', 'Sign In')}
        </button>
      </div>
    </form>
  );
}

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ecf0f1] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md border border-gray-200">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ecf0f1]">
            <LogIn size={28} className="text-[#3498db]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#34495e]">
            {t('auth.signInTitle', 'Customer Sign In')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.noAccount', "Don't have an account?")}{' '}
            <Link href="/register" className="inline-flex items-center gap-1 font-medium text-[#3498db] hover:underline">
              <UserPlus size={14} /> {t('auth.registerLink', 'register a new account')}
            </Link>
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-gray-500">Loading form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
