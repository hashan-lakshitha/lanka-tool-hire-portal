'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User, Mail, Shield, LayoutDashboard, ShoppingBag,
  Loader2, Lock, KeyRound, CheckCircle, AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#ecf0f1]">
        <Loader2 size={32} className="animate-spin text-[#3498db]" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const { name, email, role, userType } = session.user;

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#34495e] to-[#2c3e50] border-b border-gray-300">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <User size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
              <p className="text-sm text-gray-300">Manage your account details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ecf0f1] border-2 border-[#3498db]/30">
                  <User size={30} className="text-[#3498db]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#34495e]">{name || 'N/A'}</h2>
                  <p className="text-sm text-gray-500">{email}</p>
                </div>
              </div>

              {/* Details */}
              <div className="divide-y divide-gray-100">
                <ProfileRow
                  icon={<User size={16} className="text-[#3498db]" />}
                  label="Full Name"
                  value={name || 'N/A'}
                />
                <ProfileRow
                  icon={<Mail size={16} className="text-emerald-500" />}
                  label="Email Address"
                  value={email}
                />
                <div className="flex items-center gap-4 px-6 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Shield size={16} className="text-violet-500" />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Account Type
                    </span>
                    <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-[#3498db]/10 px-2.5 py-0.5 text-xs font-semibold text-[#3498db] border border-[#3498db]/20 capitalize">
                      {userType || role || 'Customer'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <ChangePasswordForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-base font-bold text-[#34495e]">Quick Links</h3>
              </div>
              <div className="p-3 space-y-1.5">
                <SidebarLink
                  href="/dashboard"
                  icon={<LayoutDashboard size={16} className="text-[#3498db]" />}
                  label="Dashboard"
                />
                <SidebarLink
                  href="/catalogue"
                  icon={<ShoppingBag size={16} className="text-emerald-500" />}
                  label="Browse Catalogue"
                />
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-[#3498db]/10 to-[#3498db]/5 border border-[#3498db]/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-[#3498db]" />
                <h3 className="text-sm font-bold text-[#34495e]">Account Security</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Use the Change Password form to update your password. Choose a strong password with at least 6 characters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to change password');
        return;
      }

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
        <KeyRound size={16} className="text-amber-500" />
        <h3 className="text-base font-bold text-[#34495e]">Change Password</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {success && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
            <p className="text-sm text-emerald-700 font-medium">Password updated successfully</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3">
            <AlertCircle size={16} className="text-rose-500 shrink-0" />
            <p className="text-sm text-rose-700 font-medium">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm text-gray-900 focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              placeholder="Enter current password"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm text-gray-900 focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              placeholder="Min. 6 characters"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm text-gray-900 focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              placeholder="Repeat new password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-[#3498db] py-2.5 text-sm font-semibold text-white shadow hover:bg-[#2980b9] disabled:opacity-50 transition-colors"
        >
          <KeyRound size={16} />
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        {icon}
      </div>
      <div>
        <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-base font-medium text-[#34495e]">{value}</span>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors group"
    >
      {icon}
      <span className="text-sm font-medium text-gray-600 group-hover:text-[#34495e] transition-colors">
        {label}
      </span>
    </Link>
  );
}
