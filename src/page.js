'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function Home() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#ecf0f1] font-sans">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#34495e] to-[#2c3e50] text-white py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {t('home.heroTitle', 'Professional Tool & Equipment Rental')}
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
            {t(
              'home.heroSubtitle',
              'High-quality tools for building, landscaping, cleaning, decorating, and more. Hire hourly, daily, or weekly.'
            )}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/catalogue"
              className="rounded bg-[#3498db] px-6 py-3 font-semibold text-white shadow hover:bg-[#2980b9]"
            >
              {t('home.browseCatalogue', 'Browse Catalogue')}
            </Link>
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <main id="categories" className="flex-1 mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-[#34495e] text-center mb-10">
          {t('home.categoriesTitle', 'Our Equipment Categories')}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalogue?categoryId=${category.id}`}
              className="block rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow group text-left"
            >
              <h3 className="text-xl font-bold text-[#34495e] mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm">
                {t(
                  'home.categoryDesc',
                  'Professional grade equipment for your project. Select to browse tools in this category.'
                )}
              </p>
              <div className="mt-4">
                <span className="text-[#3498db] font-semibold text-sm group-hover:underline">
                  {t('home.viewTools', 'View Tools →')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer - Remains in English */}
      <footer className="bg-[#34495e] text-gray-400 py-8 border-t border-gray-700 mt-12">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Lanka Tool Hire (Pvt) Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}