// Module types
export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Review/Testimonial types
export interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text: string;
  status: string;
  created_at: string;
  user_name: string;
  user_email: string;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: Record<number, number>;
}

export interface ReviewListResponse {
  reviews: Review[];
  stats: ReviewStats;
}

// Video embed types
export type VideoProvider = 'youtube' | 'vimeo';

export interface ParsedVideo {
  provider: VideoProvider;
  videoId: string;
  embedUrl: string;
}
