'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Star, Banknote, ImageOff } from 'lucide-react';
import '@/lib/i18n';

export default function ToolCard({ tool }) {
  const { t } = useTranslation();

  return (
    <Link
      href={`/tools/${tool.id}`}
      className="group block bg-white rounded-lg border border-gray-200 shadow hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="h-40 bg-gray-100 flex items-center justify-center border-b border-gray-100 overflow-hidden">
          {tool.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tool.imageUrl}
              alt={tool.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <ImageOff size={24} />
              <span className="text-xs font-medium tracking-wider">
                {t('toolCard.noImage', 'NO IMAGE')}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs font-semibold text-[#3498db] uppercase tracking-wider mb-1">
            {tool.category?.name || t('toolCard.uncategorised', 'Uncategorised')}
          </p>

          <h3 className="text-base font-bold text-[#34495e] mb-2 line-clamp-1 group-hover:text-[#3498db] transition-colors">
            {tool.name}
          </h3>

          {tool.averageRating !== null && tool.averageRating !== undefined && (
            <div className="flex items-center gap-1.5 mb-3">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-gray-800">
                {tool.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">
                ({tool.reviewCount})
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 bg-[#3498db] text-white font-semibold text-xs px-3 py-1.5 rounded shadow-sm">
          <Banknote size={12} />
          LKR {Number(tool.dailyRate).toFixed(2)}{' '}
          <span className="font-normal opacity-90">{t('toolCard.perDay', '/ day')}</span>
        </span>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
          {t('toolCard.inStock', { count: tool.totalQuantity ?? 5, defaultValue: `${tool.totalQuantity ?? 5} in stock` })}
        </span>
      </div>
    </Link>
  );
}