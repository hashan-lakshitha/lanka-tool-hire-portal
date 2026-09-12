'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Package, Star, Search,
  ChevronRight, User, ShoppingBag, Loader2,
  Wrench, Grid3x3, Clock,
  ArrowRight, ImageOff,
  Receipt, MessageSquare, ShoppingCart
} from 'lucide-react';

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalTools, setTotalTools] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [rentalCount, setRentalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [toolsRes, catsRes, quotesRes, reviewsRes, rentalsRes] = await Promise.all([
          fetch('/api/tools?page=1&limit=100&sortBy=rating'),
          fetch('/api/categories'),
          fetch('/api/customer/quotes'),
          fetch('/api/customer/reviews'),
          fetch('/api/customer/rentals'),
        ]);
        const toolsData = await toolsRes.json();
        const catsData = await catsRes.json();
        const quotesData = quotesRes.ok ? await quotesRes.json() : [];
        const reviewsData = reviewsRes.ok ? await reviewsRes.json() : [];
        const rentalsData = rentalsRes.ok ? await rentalsRes.json() : [];
        const allTools = Array.isArray(toolsData.tools) ? toolsData.tools : [];
        setTools(allTools.slice(0, 8));
        setTotalTools(toolsData.pagination?.total || allTools.length);
        const sumStock = allTools.reduce((acc, t) => acc + Number(t.totalQuantity ?? 5), 0);
        setTotalStock(sumStock);
        setQuoteCount(Array.isArray(quotesData) ? quotesData.length : 0);
        setReviewCount(Array.isArray(reviewsData) ? reviewsData.length : 0);
        setRentalCount(Array.isArray(rentalsData) ? rentalsData.length : 0);
        setCategories(Array.isArray(catsData) ? catsData : []);
      } catch {
        setTools([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    if (status === 'authenticated') loadData();
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#ecf0f1]">
        <Loader2 size={32} className="animate-spin text-[#3498db]" />
      </div>
    );
  }

  if (!session) return null;

  const avgRating = tools.length > 0
    ? (tools.reduce((sum, t) => sum + (t.averageRating || 0), 0) / tools.filter(t => t.averageRating).length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-[#34495e] to-[#2c3e50] border-b border-gray-300">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <LayoutDashboard size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Welcome back, {session.user.name}
                  </h1>
                  <p className="text-sm text-gray-300">
                    Your customer dashboard
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/catalogue"
              className="flex items-center gap-2 rounded-lg bg-[#3498db] px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#2980b9] transition-colors"
            >
              <Search size={16} />
              Browse Catalogue
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span className="font-medium">Loading dashboard...</span>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              <StatCard
                icon={<Wrench size={20} className="text-[#3498db]" />}
                label="Tools (Total Units)"
                value={`${totalTools} (${totalStock} units)`}
              />
              <StatCard
                icon={<Grid3x3 size={20} className="text-emerald-500" />}
                label="Categories"
                value={categories.length}
              />
              <StatCard
                icon={<Star size={20} className="text-amber-500" />}
                label="Avg. Rating"
                value={avgRating}
              />
              <StatCard
                icon={<Receipt size={20} className="text-violet-500" />}
                label="My Quotes"
                value={quoteCount}
                href="/dashboard/quotes"
              />
              <StatCard
                icon={<MessageSquare size={20} className="text-rose-500" />}
                label="My Reviews"
                value={reviewCount}
                href="/dashboard/reviews"
              />
              <StatCard
                icon={<ShoppingCart size={20} className="text-cyan-600" />}
                label="My Rentals"
                value={rentalCount}
                href="/dashboard/rentals"
              />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column — Top Rated Tools */}
              <div className="lg:col-span-2">
                <div className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="flex items-center gap-2 text-base font-bold text-[#34495e]">
                      <Star size={16} className="text-amber-500" />
                      Top Rated Equipment
                    </h2>
                    <Link href="/catalogue?sortBy=rating" className="flex items-center gap-1 text-xs font-medium text-[#3498db] hover:underline transition-colors">
                      View all <ArrowRight size={12} />
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {tools.slice(0, 6).map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.id}`}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                          {tool.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={tool.imageUrl} alt={tool.name} className="h-full w-full object-cover" />
                          ) : (
                            <ImageOff size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#34495e] truncate group-hover:text-[#3498db] transition-colors">
                            {tool.name}
                          </p>
                          <p className="text-xs text-gray-500">{tool.category?.name}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {tool.averageRating != null && (
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mb-0.5">
                              <Star size={11} className="fill-amber-500" />
                              {tool.averageRating.toFixed(1)}
                            </div>
                          )}
                          <p className="text-xs font-semibold text-emerald-600">
                            LKR {Number(tool.dailyRate).toFixed(2)}/day
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-[#3498db] shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-[#34495e]">Quick Actions</h2>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <QuickAction href="/catalogue" icon={<ShoppingBag size={16} />} label="Browse Full Catalogue" color="text-[#3498db]" />
                    <QuickAction href="/dashboard/rentals" icon={<ShoppingCart size={16} />} label="My Rentals" color="text-cyan-600" />
                    <QuickAction href="/dashboard/quotes" icon={<Receipt size={16} />} label="My Quotes" color="text-emerald-600" />
                    <QuickAction href="/dashboard/reviews" icon={<MessageSquare size={16} />} label="My Reviews" color="text-amber-600" />
                    <QuickAction href="/profile" icon={<User size={16} />} label="My Profile" color="text-violet-600" />
                  </div>
                </div>

                {/* Categories */}
                <div className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="flex items-center gap-2 text-base font-bold text-[#34495e]">
                      <Grid3x3 size={16} className="text-emerald-500" />
                      Categories
                    </h2>
                  </div>
                  <div className="p-3 space-y-1.5">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/catalogue?categoryId=${cat.id}`}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#34495e] transition-colors">
                          {cat.name}
                        </span>
                        <ChevronRight size={14} className="text-gray-300 group-hover:text-[#3498db]" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Help Card */}
                <div className="rounded-xl bg-gradient-to-br from-[#3498db]/10 to-[#3498db]/5 border border-[#3498db]/20 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-[#3498db]" />
                    <h3 className="text-sm font-bold text-[#34495e]">Need a Quote?</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    Select any tool and use the hire calculator to get an instant cost estimate based on your rental period.
                  </p>
                  <Link
                    href="/catalogue"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3498db] hover:underline transition-colors"
                  >
                    Get started <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, href }) {
  const Wrapper = href ? Link : 'div';
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper {...wrapperProps} className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${href ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-[#34495e]">{value}</p>
    </Wrapper>
  );
}

function QuickAction({ href, icon, label, color }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors group"
    >
      <div className={`${color}`}>{icon}</div>
      <span className="text-sm font-medium text-gray-600 group-hover:text-[#34495e] transition-colors flex-1">
        {label}
      </span>
      <ArrowRight size={14} className="text-gray-300 group-hover:text-[#3498db]" />
    </Link>
  );
}
