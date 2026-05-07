import { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let imagePath = '';

      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const uploadRes = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imagePath = uploadRes.data.image;
      }

      await api.post(`/products/${productId}/reviews`, {
        rating,
        comment,
        image: imagePath,
      });

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      setRating(0);
      setComment('');
      removeImage();
      onReviewSubmitted();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-secondary/20 p-6 rounded-lg">
      <h3 className="text-lg font-semibold">Write a Review</h3>
      
      {/* Rating */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors",
                star <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>

      {/* Comment */}
      <textarea
        className="w-full p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
        placeholder="Share your thoughts about this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Add Photo (Optional)</label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('review-image')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <input
            id="review-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {preview && (
            <div className="relative w-16 h-16 rounded overflow-hidden border border-border">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-0 right-0 bg-black/50 text-white p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
