'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, MessageSquare, Send, Clock } from 'lucide-react';

export default function ModerationPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?status=${activeTab}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReviews();
  }, [fetchReviews]);

  async function moderate(reviewId, status) {
    await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, status }),
    });
    fetchReviews();
  }

  async function submitResponse(reviewId) {
    if (!responseText.trim()) return;
    await fetch(`/api/admin/reviews/${reviewId}/response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseBody: responseText }),
    });
    setResponseText('');
    setRespondingTo(null);
    fetchReviews();
  }

  const tabs = [
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#34495e] tracking-tight">Review Moderation</h1>
          <p className="mt-1 text-sm text-gray-500">Approve, reject, or respond to customer reviews.</p>
        </div>
        {activeTab === 'pending' && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            <Clock size={14} /> {reviews.length} awaiting
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 rounded-lg bg-gray-200 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-[#34495e] shadow-sm'
                : 'text-gray-600 hover:text-[#34495e]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-gray-500 text-sm">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-200">
          No {activeTab} reviews found.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg bg-white p-5 shadow-sm border border-gray-200"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-[#34495e]">{review.tool?.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    by {review.user?.name} ({review.user?.email}) · {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-3">
                <p className="text-sm font-semibold text-[#34495e] mb-1">{review.title}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{review.body}</p>
              </div>

              {/* Rating Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {review.performanceRating && (
                  <RatingBadge label="Performance" value={review.performanceRating} />
                )}
                {review.customerServiceRating && (
                  <RatingBadge label="Service" value={review.customerServiceRating} />
                )}
                {review.supportRating && (
                  <RatingBadge label="Support" value={review.supportRating} />
                )}
                {review.afterSalesRating && (
                  <RatingBadge label="After-Sales" value={review.afterSalesRating} />
                )}
              </div>

              {/* Actions (only for pending tab) */}
              {activeTab === 'pending' && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => moderate(review.id, 'approved')}
                    className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    onClick={() => moderate(review.id, 'rejected')}
                    className="flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    onClick={() => setRespondingTo(respondingTo === review.id ? null : review.id)}
                    className="flex items-center gap-1.5 rounded-md bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    <MessageSquare size={14} /> Reply
                  </button>
                </div>
              )}

              {/* Response Input */}
              {respondingTo === review.id && (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <input
                    type="text"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write an official reply as Lanka Tool Hire..."
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
                  />
                  <button
                    onClick={() => submitResponse(review.id)}
                    className="flex items-center gap-1.5 rounded-md bg-[#34495e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2c3e50] transition-colors"
                  >
                    <Send size={14} /> Send
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RatingBadge({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#ecf0f1] px-2.5 py-1 text-xs font-medium text-[#34495e]">
      <span className="text-amber-400">★</span> {value}/5 {label}
    </span>
  );
}