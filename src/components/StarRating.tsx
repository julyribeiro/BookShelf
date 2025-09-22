// src/components/StarRating.tsx
import { FaStar } from 'react-icons/fa';
import { cn } from "@/lib/utils";
import * as React from 'react';

export interface StarRatingProps {
  rating: number;
  onRatingChange?: (newRating: number) => void;
  size?: number;
  readOnly?: boolean;
}

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  ({ rating, onRatingChange, size = 20, readOnly = false, ...props }, ref) => {
    return (
      <div ref={ref} className="flex items-center" {...props}>
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          const isSelected = ratingValue <= rating;
          
          return (
            <FaStar
              key={index}
              className={cn(
                "cursor-pointer",
                isSelected ? "text-yellow-400" : "text-gray-300",
                readOnly && "cursor-default"
              )}
              size={size}
              onClick={() => !readOnly && onRatingChange?.(ratingValue)}
            />
          );
        })}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';

export default StarRating;