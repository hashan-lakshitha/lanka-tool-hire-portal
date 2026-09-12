'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Receipt, Loader2, ArrowLeft, Package,
  CalendarDays, Clock, Banknote, ImageOff,
  ChevronDown, ChevronUp, ExternalLink, Trash2
} from 'lucide-react';

export default function MyQuotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  async function handleDeleteQuote(e, id) {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this quote?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/customer/quotes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuotes((prev) => prev.filter((q) => q.id !== id));
      }
    } catch { /* ignore */ }
    setDeletingId(null);
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/customer/quotes');
        if (res.ok) {
          const data = await res.json();
          setQuotes(data);
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

  function formatDateTime(d) {
    return new Date(d).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  function getDuration(start, end) {
    const ms = new Date(end) - new Date(start);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    if (days > 0) return `${days}d ${remHours}h`;
    return `${hours}h`;
  }

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      <div className="bg-gradient-to-r from-[#34495e] to-[#2c3e50] border-b border-gray-300">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors mb-3">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <Receipt size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Quotes</h1>
              <p className="text-sm text-gray-300">Your rental cost estimates</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span className="font-medium">Loading quotes...</span>
          </div>
        ) : quotes.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-200 p-10 text-center shadow-sm">
            <Receipt size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-base font-semibold text-[#34495e] mb-1">No quotes yet</p>
            <p className="text-sm text-gray-500 mb-4">
              Browse the catalogue and use the hire calculator to get cost estimates.
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
            {quotes.map((quote) => {
              const isOpen = expanded === quote.id;

              return (
                <div key={quote.id} className="rounded-xl bg-white border border-gray-200 overflow-hidden transition-all shadow-sm">
                  {/* Summary Row */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : quote.id)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    {/* Tool Image */}
                    <div className="h-14 w-14 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                      {quote.tool?.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={quote.tool.imageUrl} alt={quote.tool.name} className="h-full w-full object-cover" />
                      ) : (
                        <ImageOff size={16} className="text-gray-400" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#34495e] truncate">
                        {quote.tool?.name || `Tool #${quote.toolId}`}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {formatDateTime(quote.startDatetime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays size={11} />
                          {getDuration(quote.startDatetime, quote.endDatetime)}
                        </span>
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-lg font-extrabold text-emerald-600">
                        <Banknote size={16} />
                        LKR {Number(quote.calculatedCost).toFixed(2)}
                      </div>
                    </div>

                    {isOpen ? (
                      <ChevronUp size={16} className="text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400 shrink-0" />
                    )}
                  </button>

                  {/* Expanded Details */}
                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <DetailBox label="Start Date" value={formatDateTime(quote.startDatetime)} />
                        <DetailBox label="End Date" value={formatDateTime(quote.endDatetime)} />
                        <DetailBox label="Duration" value={getDuration(quote.startDatetime, quote.endDatetime)} />
                        <DetailBox label="Total Cost" value={`LKR ${Number(quote.calculatedCost).toFixed(2)}`} highlight />
                      </div>

                      {quote.tool?.dailyRate && (
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                          <span>Daily Rate: LKR {Number(quote.tool.dailyRate).toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/tools/${quote.toolId}?quoteId=${quote.id}&start=${encodeURIComponent(new Date(quote.startDatetime).toISOString().slice(0, 16))}&end=${encodeURIComponent(new Date(quote.endDatetime).toISOString().slice(0, 16))}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#3498db] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2980b9] transition-colors"
                          >
                            <ExternalLink size={12} /> View Tool & Update Hire
                          </Link>
                          <span className="text-xs text-gray-400">
                            Quoted on {new Date(quote.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteQuote(e, quote.id)}
                          disabled={deletingId === quote.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={12} />
                          {deletingId === quote.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailBox({ label, value, highlight }) {
  return (
    <div className="rounded-lg bg-white border border-gray-200 px-3 py-2.5">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-sm font-bold ${highlight ? 'text-emerald-600' : 'text-[#34495e]'}`}>{value}</p>
    </div>
  );
}
