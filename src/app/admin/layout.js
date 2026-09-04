'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, Wrench, FolderOpen, ShieldCheck, ShoppingCart, BarChart3, LogOut, ArrowLeft } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/equipment', label: 'Equipment', icon: Wrench },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/rentals', label: 'Rentals', icon: ShoppingCart },
  { href: '/admin/moderation', label: 'Moderation', icon: ShieldCheck },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Don't wrap the login page with the admin layout
  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="flex min-h-screen bg-[#ecf0f1] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2c3e50] text-white flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2.5 text-lg font-bold tracking-wide text-white hover:opacity-90">
            <Image src="/lanka-logo.png" alt="Lanka Tool Hire" width={28} height={28} className="rounded object-contain" priority />
            <span>Lanka Tool Hire</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1 pl-[38px]">Admin Portal</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#3498db] text-white shadow'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-[#3498db] flex items-center justify-center text-xs font-bold text-white">
              {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-400 truncate">{session?.user?.role || 'Administrator'}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/20 hover:text-white transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        {/* Back to Main Site */}
        <div className="px-4 pb-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={12} />
            Back to Main Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
