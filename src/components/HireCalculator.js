'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Calculator, Clock, CalendarDays, Banknote, ShoppingCart, CheckCircle, LogIn } from 'lucide-react';
import '@/lib/i18n';

export default function HireCalculator({ toolId }) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [cost, setCost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hiring, setHiring] = useState(false);
  const [hired, setHired] = useState(false);
  const [availability, setAvailability] = useState(null);
  const didAutoCalc = useRef(false);

  // Pre-fill from query params (from My Quotes page)
  useEffect(() => {
    const qStart = searchParams.get('start');
    const qEnd = searchParams.get('end');
    const qId = searchParams.get('quoteId');
    if (qStart && qEnd && !didAutoCalc.current) {
      setStart(qStart);
      setEnd(qEnd);
      didAutoCalc.current = true;
      // Auto-calculate after pre-fill
      (async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolId, startDatetime: qStart, endDatetime: qEnd, quoteId: qId ? Number(qId) : undefined }),
          });
          const data = await res.json();
          if (res.ok) {
            setCost(data.calculatedCost);
            if (data.availability) setAvailability(data.availability);
          }
        } catch { /* ignore */ }
        setLoading(false);
      })();
    }
  }, [searchParams, toolId]);

  async function calculate() {
    setError(null);
    setCost(null);
    setAvailability(null);
    setHired(false);

    if (!start || !end) {
      setError(t('hireCalculator.datesRequiredError', 'Please select both start and end dates/times.'));
      return;
    }

    const qId = searchParams.get('quoteId');

    setLoading(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, startDatetime: start, endDatetime: end, quoteId: qId ? Number(qId) : undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('hireCalculator.calcError', 'Could not calculate cost. Please try again.'));
        return;
      }

      setCost(data.calculatedCost);
      if (data.availability) setAvailability(data.availability);
    } catch {
      setError(t('hireCalculator.calcError', 'Could not calculate cost. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  async function hireNow() {
    if (!cost || !start || !end) return;

    const qId = searchParams.get('quoteId');

    setHiring(true);
    setError(null);
    try {
      const res = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId,
          startDate: start,
          endDate: end,
          totalCost: cost,
          quoteId: qId ? Number(qId) : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not place hire order');
        return;
      }

      setHired(true);
    } catch {
      setError('Could not place hire order. Please try again.');
    } finally {
      setHiring(false);
    }
  }

  return (
    <div className="rounded-lg bg-[#ecf0f1] border border-gray-200 p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={18} className="text-[#3498db]" />
        <h3 className="text-base font-bold text-[#34495e]">
          {t('hireCalculator.title', 'Hire Cost Calculator')}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1">
            <Clock size={12} /> {t('hireCalculator.startDate', 'Start Date & Time')}
          </label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => { setStart(e.target.value); setHired(false); }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
          />
        </div>
        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1">
            <CalendarDays size={12} /> {t('hireCalculator.endDate', 'End Date & Time')}
          </label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => { setEnd(e.target.value); setHired(false); }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-[#3498db] py-2.5 text-sm font-semibold text-white shadow hover:bg-[#2980b9] disabled:opacity-50 transition-colors"
      >
        <Calculator size={16} />
        {loading ? t('hireCalculator.calculating', 'Calculating...') : t('hireCalculator.calculateBtn', 'Calculate Cost')}
      </button>

      {error && (
        <p className="mt-3 text-sm text-rose-600 font-medium">{error}</p>
      )}

      {cost !== null && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-md bg-white p-4 border border-emerald-200">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider block font-semibold mb-0.5">
                {t('hireCalculator.estimatedCost', 'Estimated Total Cost')}
              </span>
              <span className="flex items-center gap-1 text-2xl font-extrabold text-[#34495e]">
                <Banknote size={20} className="text-emerald-500" />
                LKR {Number(cost).toFixed(2)}
              </span>
            </div>

            {availability && (
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                  availability.isAvailable
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {availability.isAvailable ? (
                    `Available: ${availability.availableQuantity} of ${availability.totalQuantity} units`
                  ) : (
                    `Out of Stock (${availability.activeOverlaps} of ${availability.totalQuantity} hired)`
                  )}
                </span>
              </div>
            )}
          </div>

          {hired ? (
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 p-4">
              <CheckCircle size={18} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">Hire request submitted!</p>
                <p className="text-xs text-emerald-600">Your booking is pending confirmation. Check your dashboard for updates.</p>
              </div>
            </div>
          ) : session?.user?.userType === 'customer' ? (
            <button
              onClick={hireNow}
              disabled={hiring || (availability && !availability.isAvailable)}
              className={`w-full flex items-center justify-center gap-2 rounded-md py-3 text-sm font-bold text-white shadow-lg transition-colors ${
                availability && !availability.isAvailable
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              <ShoppingCart size={16} />
              {hiring ? 'Placing Order...' : availability && !availability.isAvailable ? 'Out of Stock for Selected Dates' : t('hireCalculator.reserveBtn', 'Reserve This Tool')}
            </button>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 rounded-md bg-[#34495e] py-3 text-sm font-semibold text-white shadow hover:bg-[#2c3e50] transition-colors"
            >
              <LogIn size={16} />
              Log in to Hire
            </Link>
          )}
        </div>
      )}
    </div>
  );
}