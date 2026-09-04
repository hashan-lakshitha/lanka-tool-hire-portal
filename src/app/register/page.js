'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { UserPlus, User, Mail, Lock, LogIn } from 'lucide-react';
import '@/lib/i18n';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch', 'Passwords do not match'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        router.push('/login?registered=true');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ecf0f1] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md border border-gray-200">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ecf0f1]">
            <UserPlus size={28} className="text-[#3498db]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#34495e]">
            {t('auth.signUpTitle', 'Create Customer Account')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.haveAccount', 'Already have an account?')}{' '}
            <Link href="/login" className="inline-flex items-center gap-1 font-medium text-[#3498db] hover:underline">
              <LogIn size={14} /> {t('auth.loginLink', 'sign in to your existing account')}
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.name', 'Full Name')}</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 text-sm focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
                placeholder="John Doe"
              />
            </div>
          </div>
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
                placeholder="At least 6 characters"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.confirmPassword', 'Confirm Password')}</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 text-sm focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
                placeholder="Repeat password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#3498db] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2980b9] focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2 disabled:bg-gray-400 transition-colors"
          >
            <UserPlus size={16} />
            {loading ? t('auth.creatingAccount', 'Registering...') : t('auth.createAccountBtn', 'Register')}
          </button>
        </form>
      </div>
    </div>
  );
}
