    // src/components/StarRating.tsx

'use client';

import { FaStar } from 'react-icons/fa';
import { useState } from 'react';

type StarRatingProps = {
  rating: number | undefined;
  onRatingChange: (newRating: number) => void;
};

export default function StarRating({ rating, onRatingChange }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  const roundedRating = Math.round(rating || 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const currentRating = index + 1;
        return (
          <label key={index} className="cursor-pointer">
            <input
              type="radio"
              name="rating"
              className="hidden"
              value={currentRating}
              onClick={() => onRatingChange(currentRating)}
            />
            <FaStar
              className="transition-colors duration-200"
              size={20}
              color={currentRating <= (hover || roundedRating) ? '#ffc107' : '#e4e5e9'}
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
}