'use client';

import { Star } from 'lucide-react';

export default function StarRating({ value, onChange, size = 18, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="inline-flex gap-0.5">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          onClick={() => !readOnly && onChange && onChange(star)}
          className={`transition-colors ${
            star <= value
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-300'
          } ${readOnly ? 'cursor-default' : 'cursor-pointer hover:text-amber-300'}`}
        />
      ))}
    </div>
  );
}