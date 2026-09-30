'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare, Loader2, ArrowLeft, Package,
  Star, Clock, CheckCircle, AlertCircle, ImageOff
} from 'lucide-react';

export default function MyReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/customer/reviews');
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
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
    approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle size={12} /> },
    pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={12} /> },
    rejected: { label: 'Rejected', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: <AlertCircle size={12} /> },
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
              <MessageSquare size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Reviews</h1>
              <p className="text-sm text-gray-300">Reviews you have submitted</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span className="font-medium">Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-200 p-10 text-center shadow-sm">
            <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-base font-semibold text-[#34495e] mb-1">No reviews yet</p>
            <p className="text-sm text-gray-500 mb-4">
              Browse tools and share your hiring experience with others.
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
            {reviews.map((review) => {
              const sc = statusConfig[review.status] || statusConfig.pending;
              const avgRating = (
                (review.performanceRating + review.customerServiceRating + review.supportRating + review.afterSalesRating) / 4
              ).toFixed(1);

              return (
                <div
                  key={review.id}
                  className="rounded-xl bg-white border border-gray-200 p-5 hover:shadow-md transition-all shadow-sm"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                      {review.tool?.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={review.tool.imageUrl} alt={review.tool.name} className="h-full w-full object-cover" />
                      ) : (
                        <ImageOff size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Link
                          href={`/tools/${review.toolId}`}
                          className="text-sm font-semibold text-[#34495e] hover:text-[#3498db] transition-colors truncate"
                        >
                          {review.tool?.name || `Tool #${review.toolId}`}
                        </Link>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border shrink-0 ${sc.cls}`}>
                          {sc.icon} {sc.label}
                        </span>
                      </div>
                      <p className="text-base font-bold text-[#34495e]">{review.title}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.body}</p>

                  {/* Rating + Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                      <Star size={14} className="fill-amber-500" />
                      {avgRating} avg
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Company Response */}
                  {review.response && (
                    <div className="mt-3 bg-blue-50 border-l-2 border-[#3498db] rounded-md px-4 py-3">
                      <p className="text-xs font-semibold text-[#3498db] mb-1">Lanka Tool Hire replied:</p>
                      <p className="text-sm text-gray-600">{review.response.body}</p>
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
