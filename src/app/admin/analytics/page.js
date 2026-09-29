'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';
import {
  TrendingUp, DollarSign, Users, Star, ShoppingCart,
  Package, Activity, ArrowUpRight,
} from 'lucide-react';

const COLORS = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'];
const STATUS_COLORS = {
  pending: '#f39c12',
  confirmed: '#3498db',
  active: '#2ecc71',
  returned: '#8e44ad',
  cancelled: '#e74c3c',
};

function formatLKR(value) {
  return `LKR ${Number(value).toLocaleString('en-LK')}`;
}

function formatMonth(monthStr) {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
}

function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    returned: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/admin/analytics');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#3498db] border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          Failed to load analytics: {error}
        </div>
      </div>
    );
  }

  const { revenueByMonth, statusBreakdown, popularTools, reviewStats, recentRentals, summary } = data;

  const revenueChartData = (revenueByMonth || []).map((item) => ({
    month: formatMonth(item.month),
    revenue: Number(item.revenue || 0),
    count: Number(item.count || 0),
  }));

  const statusPieData = (statusBreakdown || []).map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: Number(item.count),
    color: STATUS_COLORS[item.status] || '#95a5a6',
  }));

  const statCards = [
    { label: 'Total Revenue', value: formatLKR(summary.totalRevenue), icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Total Rentals', value: summary.totalRentals, icon: ShoppingCart, color: 'bg-[#3498db]' },
    { label: 'Active Rentals', value: summary.activeRentals, icon: Activity, color: 'bg-amber-500' },
    { label: 'Total Users', value: summary.totalUsers, icon: Users, color: 'bg-purple-600' },
    { label: 'Equipment Types', value: summary.totalTools, icon: Package, color: 'bg-cyan-600' },
    { label: 'Avg Rating', value: `${reviewStats.overallAvg} / 5`, icon: Star, color: 'bg-yellow-500' },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#34495e] tracking-tight flex items-center gap-2">
          <TrendingUp className="text-[#3498db]" size={28} />
          Analytics & Reports
        </h1>
        <p className="mt-1 text-gray-500 text-sm">
          Comprehensive overview of rental performance, revenue, and customer engagement.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${card.color} text-white`}>
                  <Icon size={18} />
                </span>
                <ArrowUpRight size={14} className="text-gray-300" />
              </div>
              <p className="text-xl font-extrabold text-[#34495e]">{card.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1: Revenue + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#34495e] mb-4">Monthly Revenue (LKR)</h2>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7f8c8d' }} />
                <YAxis tick={{ fontSize: 12, fill: '#7f8c8d' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value) => [formatLKR(value), 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #ecf0f1', fontSize: '13px' }}
                />
                <Bar dataKey="revenue" fill="#3498db" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
              No revenue data available yet
            </div>
          )}
        </div>

        {/* Rental Status Pie */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#34495e] mb-4">Rental Status</h2>
          {statusPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #ecf0f1', fontSize: '13px' }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
              No rental data available yet
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2: Popular Tools + Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Tools */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#34495e] mb-4">Top 5 Most Rented Tools</h2>
          {popularTools && popularTools.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={popularTools} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#7f8c8d' }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={{ fontSize: 11, fill: '#34495e' }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'totalRevenue') return [formatLKR(value), 'Revenue'];
                    return [value, 'Rentals'];
                  }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #ecf0f1', fontSize: '13px' }}
                />
                <Bar dataKey="rentalCount" fill="#2ecc71" radius={[0, 6, 6, 0]} name="Rentals" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
              No rental data available yet
            </div>
          )}
        </div>

        {/* Monthly Trend Line */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#34495e] mb-4">Monthly Rental Trend</h2>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7f8c8d' }} />
                <YAxis tick={{ fontSize: 12, fill: '#7f8c8d' }} allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [value, 'Rentals']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #ecf0f1', fontSize: '13px' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3498db"
                  strokeWidth={3}
                  dot={{ fill: '#3498db', r: 5 }}
                  activeDot={{ r: 7, fill: '#2980b9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
              No trend data available yet
            </div>
          )}
        </div>
      </div>

      {/* Review Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-[#34495e] mb-4">Review Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#ecf0f1] rounded-lg p-4 text-center">
            <p className="text-2xl font-extrabold text-[#34495e]">{reviewStats.total}</p>
            <p className="text-xs text-gray-500 mt-1">Total Reviews</p>
          </div>
          <div className="bg-[#ecf0f1] rounded-lg p-4 text-center">
            <p className="text-2xl font-extrabold text-yellow-500 flex items-center justify-center gap-1">
              <Star size={18} fill="#eab308" /> {reviewStats.overallAvg}
            </p>
            <p className="text-xs text-gray-500 mt-1">Average Rating</p>
          </div>
          {(reviewStats.breakdown || []).map((item) => (
            <div key={item.status} className="bg-[#ecf0f1] rounded-lg p-4 text-center">
              <p className="text-2xl font-extrabold text-[#34495e]">{item.count}</p>
              <p className="text-xs text-gray-500 mt-1 capitalize">{item.status} Reviews</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-[#34495e] mb-4">Recent Rental Activity</h2>
        {recentRentals && recentRentals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Tool</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Cost (LKR)</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRentals.map((rental) => (
                  <tr key={rental.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-3 text-gray-400 font-mono text-xs">#{rental.id}</td>
                    <td className="py-3 px-3 font-medium text-[#34495e]">{rental.tool}</td>
                    <td className="py-3 px-3 text-gray-600">{rental.customer}</td>
                    <td className="py-3 px-3"><StatusBadge status={rental.status} /></td>
                    <td className="py-3 px-3 text-right font-semibold text-[#34495e]">{formatLKR(rental.totalCost)}</td>
                    <td className="py-3 px-3 text-gray-400 text-xs">
                      {new Date(rental.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-8">No rental activity yet</p>
        )}
      </div>
    </div>
  );
}
