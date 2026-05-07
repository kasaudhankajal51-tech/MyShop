import { Star, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  image?: string;
  verified?: boolean;
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="border-b border-border pb-6 last:border-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{review.name}</span>
              {review.verified && (
                <span className="flex items-center text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Buyer
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {format(new Date(review.createdAt), 'MMM d, yyyy')}
            </span>
          </div>

          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"
                )}
              />
            ))}
          </div>

          <p className="text-muted-foreground mb-3">{review.comment}</p>

          {review.image && (
            <div className="w-24 h-24 rounded-md overflow-hidden border border-border">
              <img
                src={review.image}
                alt="Review attachment"
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(review.image, '_blank')}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
