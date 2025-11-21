import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  className,
  onRatingChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const isInteractive = !!onRatingChange;

  const handleStarClick = (starValue: number) => {
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= Math.floor(rating);
    const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 !== 0;

    const starElement = (
      <div key={index} className="relative">
        {isHalfFilled && !isInteractive ? (
          <>
            {/* Background empty star */}
            <Star className={cn(sizeClasses[size], 'text-muted-foreground')} aria-hidden="true" />
            {/* Foreground half-filled star */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')} aria-hidden="true" />
            </div>
          </>
        ) : (
          <Star
            className={cn(
              sizeClasses[size],
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground',
              isInteractive && 'cursor-pointer transition-colors hover:text-yellow-400'
            )}
            onClick={() => handleStarClick(starValue)}
            aria-hidden="true"
          />
        )}
      </div>
    );

    return starElement;
  });

  return (
    <div 
      className={cn('flex items-center gap-1', className)}
      role="img"
      aria-label={`Rating: ${rating.toFixed(1)} out of ${maxRating} stars`}
    >
      {stars}
      {showValue && (
        <span className="ml-1 text-sm text-muted-foreground" aria-hidden="true">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
