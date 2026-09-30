'use client';

import { useEffect, useState } from 'react';
import {
  ShoppingCart, Loader2, Banknote, ImageOff,
  CheckCircle, Timer, RotateCcw, XCircle, Truck,
  User, CalendarDays, Filter
} from 'lucide-react';

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  async function loadRentals() {
    try {
      const res = await fetch('/api/admin/rentals');
      if (res.ok) {
        const data = await res.json();
        setRentals(data);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRentals();
  }, []);

  async function updateStatus(id, newStatus) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/rentals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRentals((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch { /* ignore */ }
    setUpdating(null);
  }

  const statusConfig = {
    pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700', icon: <Timer size={12} /> },
    confirmed: { label: 'Confirmed', cls: 'bg-blue-100 text-blue-700', icon: <CheckCircle size={12} /> },
    active: { label: 'Active', cls: 'bg-emerald-100 text-emerald-700', icon: <Truck size={12} /> },
    returned: { label: 'Returned', cls: 'bg-gray-100 text-gray-600', icon: <RotateCcw size={12} /> },
    cancelled: { label: 'Cancelled', cls: 'bg-rose-100 text-rose-700', icon: <XCircle size={12} /> },
  };

  const statusActions = {
    pending: [
      { label: 'Confirm', status: 'confirmed', cls: 'bg-blue-500 hover:bg-blue-600 text-white' },
      { label: 'Cancel', status: 'cancelled', cls: 'bg-rose-500 hover:bg-rose-600 text-white' },
    ],
    confirmed: [
      { label: 'Set Active', status: 'active', cls: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
      { label: 'Cancel', status: 'cancelled', cls: 'bg-rose-500 hover:bg-rose-600 text-white' },
    ],
    active: [
      { label: 'Mark Returned', status: 'returned', cls: 'bg-gray-600 hover:bg-gray-700 text-white' },
    ],
    returned: [],
    cancelled: [],
  };

  const filtered = filter === 'all' ? rentals : rentals.filter((r) => r.status === filter);

  const counts = {
    all: rentals.length,
    pending: rentals.filter((r) => r.status === 'pending').length,
    confirmed: rentals.filter((r) => r.status === 'confirmed').length,
    active: rentals.filter((r) => r.status === 'active').length,
    returned: rentals.filter((r) => r.status === 'returned').length,
    cancelled: rentals.filter((r) => r.status === 'cancelled').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart size={22} className="text-[#3498db]" />
        <h1 className="text-xl font-bold text-[#34495e]">Rental Management</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { key: 'all', label: 'All', color: 'bg-[#34495e]' },
          { key: 'pending', label: 'Pending', color: 'bg-amber-500' },
          { key: 'confirmed', label: 'Confirmed', color: 'bg-blue-500' },
          { key: 'active', label: 'Active', color: 'bg-emerald-500' },
          { key: 'returned', label: 'Returned', color: 'bg-gray-500' },
          { key: 'cancelled', label: 'Cancelled', color: 'bg-rose-500' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`rounded-lg p-3 text-center transition-all ${
              filter === s.key
                ? `${s.color} text-white shadow-lg scale-105`
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <p className="text-xl font-extrabold">{counts[s.key]}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="font-medium">Loading rentals...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-white border border-gray-200 p-10 text-center">
          <ShoppingCart size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-base font-semibold text-[#34495e] mb-1">No rentals found</p>
          <p className="text-sm text-gray-400">
            {filter !== 'all' ? `No ${filter} rentals` : 'No hire orders yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((rental) => {
            const sc = statusConfig[rental.status] || statusConfig.pending;
            const actions = statusActions[rental.status] || [];

            return (
              <div
                key={rental.id}
                className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Tool Image */}
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                    {rental.tool?.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={rental.tool.imageUrl} alt={rental.tool.name} className="h-full w-full object-cover" />
                    ) : (
                      <ImageOff size={16} className="text-gray-300" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-[#34495e] truncate">
                        {rental.tool?.name || `Tool #${rental.toolId}`}
                      </p>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${sc.cls}`}>
                        {sc.icon} {sc.label}
                      </span>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <User size={11} />
                      <span>{rental.user?.name || 'Unknown'}</span>
                      <span className="text-gray-300 mx-1">|</span>
                      <span>{rental.user?.email || ''}</span>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={11} />
                        {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-emerald-600">
                        <Banknote size={12} />
                        LKR {Number(rental.totalCost).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {actions.length > 0 && (
                    <div className="flex gap-2 shrink-0">
                      {actions.map((action) => (
                        <button
                          key={action.status}
                          onClick={() => updateStatus(rental.id, action.status)}
                          disabled={updating === rental.id}
                          className={`rounded-md px-3 py-1.5 text-xs font-semibold shadow-sm disabled:opacity-50 transition-colors ${action.cls}`}
                        >
                          {updating === rental.id ? '...' : action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
