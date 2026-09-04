'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wrench, FolderOpen, ShieldCheck, ArrowRight, Package, ShoppingCart, BarChart3 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ tools: 0, totalStock: 0, categories: 0, pending: 0, rentals: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [toolsRes, catsRes, pendingRes, rentalsRes] = await Promise.all([
          fetch('/api/admin/tools'),
          fetch('/api/admin/categories'),
          fetch('/api/admin/reviews?status=pending'),
          fetch('/api/admin/rentals'),
        ]);
        const tools = await toolsRes.json();
        const cats = await catsRes.json();
        const pending = await pendingRes.json();
        const rentals = rentalsRes.ok ? await rentalsRes.json() : [];

        const totalStockUnits = Array.isArray(tools)
          ? tools.reduce((sum, t) => sum + Number(t.totalQuantity ?? 5), 0)
          : 0;

        setStats({
          tools: Array.isArray(tools) ? tools.length : 0,
          totalStock: totalStockUnits,
          categories: Array.isArray(cats) ? cats.length : 0,
          pending: Array.isArray(pending) ? pending.length : 0,
          rentals: Array.isArray(rentals) ? rentals.length : 0,
        });
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Equipment Types',
      value: stats.tools,
      icon: Wrench,
      color: 'bg-[#3498db]',
      href: '/admin/equipment',
    },
    {
      label: 'Total Inventory Stock',
      value: `${stats.totalStock} Units`,
      icon: Package,
      color: 'bg-purple-600',
      href: '/admin/equipment',
    },
    {
      label: 'Total Rentals',
      value: stats.rentals,
      icon: ShoppingCart,
      color: 'bg-cyan-600',
      href: '/admin/rentals',
    },
    {
      label: 'Categories',
      value: stats.categories,
      icon: FolderOpen,
      color: 'bg-emerald-500',
      href: '/admin/categories',
    },
    {
      label: 'Pending Reviews',
      value: stats.pending,
      icon: ShieldCheck,
      color: stats.pending > 0 ? 'bg-amber-500' : 'bg-gray-400',
      href: '/admin/moderation',
    },
  ];

  return (
    <div className="p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#34495e] tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-gray-600 text-sm">
          Welcome back, <span className="font-semibold">{session?.user?.name || 'Admin'}</span>. Here&apos;s an overview of your tool hire portal.
        </p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="text-gray-500 text-sm">Loading dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-10">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="group rounded-lg bg-white p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${card.color} text-white`}>
                    <Icon size={20} />
                  </span>
                  <span className="text-xs font-medium text-gray-400 group-hover:text-[#3498db] transition-colors flex items-center gap-1">
                    View <ArrowRight size={12} />
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-[#34495e]">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.label}</p>
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
        <h2 className="text-lg font-bold text-[#34495e] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/admin/equipment"
            className="flex items-center gap-3 rounded-md bg-[#ecf0f1] px-4 py-3 text-sm font-medium text-[#34495e] hover:bg-[#3498db] hover:text-white transition-colors"
          >
            <Wrench size={16} /> Manage Equipment
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-md bg-[#ecf0f1] px-4 py-3 text-sm font-medium text-[#34495e] hover:bg-[#3498db] hover:text-white transition-colors"
          >
            <FolderOpen size={16} /> Manage Categories
          </Link>
          <Link
            href="/admin/moderation"
            className="flex items-center gap-3 rounded-md bg-[#ecf0f1] px-4 py-3 text-sm font-medium text-[#34495e] hover:bg-[#3498db] hover:text-white transition-colors"
          >
            <ShieldCheck size={16} /> Review Moderation
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 rounded-md bg-[#ecf0f1] px-4 py-3 text-sm font-medium text-[#34495e] hover:bg-[#3498db] hover:text-white transition-colors"
          >
            <BarChart3 size={16} /> Analytics & Reports
          </Link>
        </div>
      </div>
    </div>
  );
}