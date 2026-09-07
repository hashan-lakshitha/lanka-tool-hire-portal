"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ToolCard from '@/components/ToolCard';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Package, Loader2 } from 'lucide-react';

export default function CataloguePage() {
  return (
    <Suspense fallback={null}>
      <CatalogueContent />
    </Suspense>
  );
}

function CatalogueContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("categoryId");

  const [categories, setCategories] = useState([]);
  const [tools, setTools] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(
    initialCategoryId ? Number(initialCategoryId) : null,
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        // API may return an array or an object like { categories: [...] }
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]));
  }, []);

  const fetchTools = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategoryId) params.set("categoryId", activeCategoryId);
    if (search) params.set("search", search);
    params.set("sortBy", sortBy);
    params.set("page", page);

    try {
      const res = await fetch(`/api/tools?${params.toString()}`);
      const data = await res.json();
      setTools(Array.isArray(data.tools) ? data.tools : []);
      setPagination(data.pagination || { totalPages: 1, total: 0 });
    } catch {
      setTools([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategoryId, search, sortBy, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [activeCategoryId, search, sortBy]);

  useEffect(() => {
    const timeout = setTimeout(fetchTools, 300);
    return () => clearTimeout(timeout);
  }, [fetchTools]);

  return (
    <div className="min-h-screen bg-[#ecf0f1] font-sans">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Package size={28} className="text-[#3498db]" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#34495e] tracking-tight">
            {t('catalogue.title', 'Equipment Catalogue')}
          </h1>
        </div>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          {t('catalogue.subtitle', 'Browse by category or search for what you need.')}
        </p>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('catalogue.searchPlaceholder', 'Search tools, e.g. hedge trimmer...')}
            className="w-full rounded-lg border border-gray-300 bg-white pl-11 pr-4 py-3 text-gray-900 shadow-sm focus:border-[#3498db] focus:outline-none focus:ring-2 focus:ring-[#3498db] text-sm"
          />
        </div>

        {/* Filters & Sorting Row */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategoryId(null)}
              className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                activeCategoryId === null
                  ? "bg-[#3498db] text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              {t('catalogue.all', 'All')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  activeCategoryId === cat.id
                    ? "bg-[#3498db] text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm focus:border-[#3498db] focus:outline-none"
            >
              <option value="name">{t('catalogue.sortName', 'Name (A-Z)')}</option>
              <option value="rating">{t('catalogue.sortRating', 'Top Rated')}</option>
              <option value="priceLow">{t('catalogue.sortPriceLow', 'Price: Low to High')}</option>
              <option value="priceHigh">{t('catalogue.sortPriceHigh', 'Price: High to Low')}</option>
            </select>
          </div>
        </div>

        {/* Tool Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span className="font-medium">{t('catalogue.loading', 'Loading tools...')}</span>
          </div>
        ) : tools.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-200">
            <Search size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">{t('catalogue.noMatchTitle', 'No tools match your search.')}</p>
            <p className="text-sm">{t('catalogue.noMatchSubtitle', 'Try a different keyword or category.')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 rounded-md bg-white border border-gray-300 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} /> {t('catalogue.prev', 'Prev')}
                </button>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  Page {page} of {pagination.totalPages} ({pagination.total} tools)
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}
                  className="flex items-center gap-1 rounded-md bg-white border border-gray-300 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('catalogue.next', 'Next')} <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
