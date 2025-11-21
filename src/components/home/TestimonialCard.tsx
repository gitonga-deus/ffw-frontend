import { Review } from '@/types/home';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { formatDistanceToNow } from 'date-fns';

interface TestimonialCardProps {
  review: Review;
}

export function TestimonialCard({ review }: TestimonialCardProps) {
  const formattedDate = formatDistanceToNow(new Date(review.created_at), {
    addSuffix: true,
  });

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-base">{review.user_name}</h3>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.review_text}
        </p>
      </CardContent>
    </Card>
  );
}
