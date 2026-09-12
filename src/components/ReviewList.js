'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';
import { MessageCircle, Send, Star } from 'lucide-react';
import '@/lib/i18n';

function average(reviews, key) {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r[key], 0) / reviews.length;
}

export default function ReviewList({ reviews }) {
  const { t } = useTranslation();

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        {t('toolDetail.noReviews', 'No reviews yet — be the first to share your experience.')}
      </p>
    );
  }

  const summary = [
    { key: 'performanceRating', label: t('review.performance', 'Performance') },
    { key: 'customerServiceRating', label: t('review.customerService', 'Service') },
    { key: 'supportRating', label: t('review.support', 'Support') },
    { key: 'afterSalesRating', label: t('review.afterSales', 'After-sales') },
  ];

  return (
    <div>
      {/* Rating Summary */}
      <div className="flex flex-wrap gap-4 mb-5">
        {summary.map((s) => (
          <div key={s.key} className="rounded-md bg-white border border-gray-200 px-4 py-2.5 text-center min-w-[90px]">
            <div className="text-xs text-gray-500 mb-0.5">{s.label}</div>
            <div className="flex items-center justify-center gap-1 text-base font-bold text-[#34495e]">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              {average(reviews, s.key).toFixed(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

function ReviewItem({ review }) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [comments] = useState(review.comments || []);
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentSent, setCommentSent] = useState(false);

  async function submitComment(e) {
    e.preventDefault();
    if (!commentBody.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${review.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentBody }),
      });
      if (res.ok) {
        setCommentBody('');
        setCommentSent(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border-t border-gray-200 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-[#34495e]">
          {review.user?.name || t('review.anonymous', 'Anonymous')}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Star rating */}
      <div className="mb-2">
        <StarRating value={Math.round(review.performanceRating)} readOnly size={14} />
      </div>

      {/* Title & Body */}
      <p className="text-sm font-bold text-[#34495e] mb-1">{review.title}</p>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.body}</p>

      {/* Company Response */}
      {review.response && (
        <div className="bg-[#ecf0f1] border-l-3 border-[#3498db] rounded-md px-4 py-3 mb-3">
          <p className="text-xs font-semibold text-[#3498db] mb-1">
            {t('review.companyReply', 'Lanka Tool Hire replied:')}
          </p>
          <p className="text-sm text-gray-700">{review.response.body}</p>
        </div>
      )}

      {/* Comments */}
      {comments.length > 0 && (
        <div className="ml-3 mb-3 space-y-1.5">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-1.5 text-xs text-gray-600">
              <MessageCircle size={12} className="text-gray-400 mt-0.5 shrink-0" />
              <span><strong>{c.user?.name || 'User'}:</strong> {c.body}</span>
            </div>
          ))}
        </div>
      )}

      {/* Comment Form */}
      {session?.user?.userType === 'customer' && !commentSent && (
        <form onSubmit={submitComment} className="flex gap-2">
          <input
            type="text"
            placeholder={t('review.addComment', 'Add a comment...')}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-1 rounded-md bg-[#34495e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2c3e50] disabled:opacity-50"
          >
            <Send size={12} /> {t('review.commentBtn', 'Reply')}
          </button>
        </form>
      )}
      {commentSent && (
        <p className="text-xs text-emerald-600 font-medium">
          {t('review.commentSubmitted', 'Comment submitted — awaiting moderation.')}
        </p>
      )}
    </div>
  );
}