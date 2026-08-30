'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingBag, LayoutDashboard, User, LogIn, UserPlus, LogOut } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Nav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Hide main Nav on admin pages — admin has its own sidebar
  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav className="bg-[#34495e] text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-wide hover:opacity-90">
          <Image src="/lanka-logo.png" alt="Lanka Tool Hire" width={32} height={32} className="rounded object-contain" priority />
          Lanka Tool Hire
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/catalogue" className="flex items-center gap-1.5 text-sm font-medium text-gray-200 hover:text-white transition-colors">
            <ShoppingBag size={16} />
            Catalogue
          </Link>
          {session?.user?.userType === 'admin' && (
            <Link href="/admin" className="flex items-center gap-1.5 text-sm font-medium text-gray-200 hover:text-white transition-colors">
              <LayoutDashboard size={16} />
              Admin
            </Link>
          )}
          {status === 'loading' ? null : session ? (
            <>
              {session.user.userType === 'customer' && (
                <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-gray-200 hover:text-white transition-colors">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              )}
              <Link href="/profile" className="flex items-center gap-1.5 text-sm font-medium text-gray-200 hover:text-white transition-colors">
                <User size={16} />
                {session.user.name}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1.5 rounded-md bg-[#3498db] px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-[#2980b9] transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-1.5 text-sm font-medium text-gray-200 hover:text-white transition-colors">
                <LogIn size={16} />
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-md bg-[#3498db] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#2980b9] transition-colors"
              >
                <UserPlus size={16} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}