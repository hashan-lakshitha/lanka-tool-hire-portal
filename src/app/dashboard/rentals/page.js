'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart, Loader2, ArrowLeft, Package,
  CalendarDays, Clock, Banknote, ImageOff,
  CheckCircle, AlertCircle, RotateCcw, XCircle, Timer
} from 'lucide-react';

export default function MyRentalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/customer/rentals');
        if (res.ok) {
          const data = await res.json();
          setRentals(data);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    if (status === 'authenticated') load();
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#ecf0f1]">
        <Loader2 size={32} className="animate-spin text-[#3498db]" />
      </div>
    );
  }

  if (!session) return null;

  const statusConfig = {
    pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Timer size={12} /> },
    confirmed: { label: 'Confirmed', cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: <CheckCircle size={12} /> },
    active: { label: 'Active', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <ShoppingCart size={12} /> },
    returned: { label: 'Returned', cls: 'bg-gray-100 text-gray-600 border-gray-200', icon: <RotateCcw size={12} /> },
    cancelled: { label: 'Cancelled', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: <XCircle size={12} /> },
  };

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      <div className="bg-gradient-to-r from-[#34495e] to-[#2c3e50] border-b border-gray-300">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors mb-3">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <ShoppingCart size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Rentals</h1>
              <p className="text-sm text-gray-300">Your tool hire history</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span className="font-medium">Loading rentals...</span>
          </div>
        ) : rentals.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-200 p-10 text-center shadow-sm">
            <ShoppingCart size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-base font-semibold text-[#34495e] mb-1">No rentals yet</p>
            <p className="text-sm text-gray-500 mb-4">
              Browse tools and use the hire calculator to place your first order.
            </p>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3498db] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2980b9] transition-colors"
            >
              <Package size={16} /> Browse Catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rentals.map((rental) => {
              const sc = statusConfig[rental.status] || statusConfig.pending;

              return (
                <div
                  key={rental.id}
                  className="flex items-center gap-4 rounded-xl bg-white border border-gray-200 p-4 shadow-sm"
                >
                  {/* Tool Image */}
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                    {rental.tool?.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={rental.tool.imageUrl} alt={rental.tool.name} className="h-full w-full object-cover" />
                    ) : (
                      <ImageOff size={16} className="text-gray-400" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/tools/${rental.toolId}`}
                        className="text-sm font-semibold text-[#34495e] hover:text-[#3498db] transition-colors truncate"
                      >
                        {rental.tool?.name || `Tool #${rental.toolId}`}
                      </Link>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border shrink-0 ${sc.cls}`}>
                        {sc.icon} {sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(rental.startDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays size={11} />
                        {new Date(rental.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-lg font-extrabold text-emerald-600">
                      <Banknote size={16} />
                      LKR {Number(rental.totalCost).toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(rental.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
