'use client';

import { useQuery } from '@tanstack/react-query';
import { homeApi } from '@/lib/api/home';
import { TestimonialCard } from './TestimonialCard';
import { TestimonialCardSkeleton } from './TestimonialCardSkeleton';
import { StarRating } from '@/components/ui/star-rating';

export function TestimonialsSection() {
  const {
    data: testimonialData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['testimonials'],
    queryFn: homeApi.getTestimonials,
  });

  // Fail silently on error - testimonials are non-critical
  if (isError) {
    return null;
  }

  // Don't render section if no testimonials
  if (!isLoading && testimonialData && testimonialData.reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 id="testimonials-heading" className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            What Our Students Say
          </h2>
          {!isLoading && testimonialData && testimonialData.stats.total_reviews > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <StarRating
                rating={testimonialData.stats.average_rating}
                size="md"
                showValue
              />
              <span className="text-sm text-muted-foreground">
                ({testimonialData.stats.total_reviews} {testimonialData.stats.total_reviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {[...Array(3)].map((_, index) => (
              <TestimonialCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Success State - Display Testimonials */}
        {!isLoading && testimonialData && testimonialData.reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {testimonialData.reviews.map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
