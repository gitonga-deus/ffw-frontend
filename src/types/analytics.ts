// Overview Metrics
export interface OverviewMetrics {
  total_users: number;
  verified_users: number;
  active_enrollments: number;
  completed_enrollments: number;
  total_revenue: string;
  revenue_this_month: string;
  average_rating: number;
  total_reviews: number;
  pending_reviews: number;
  certificates_issued: number;
  certificates_this_month: number;
}

// User Analytics
export interface UserGrowthDataPoint {
  date: string;
  new_users: number;
  verified_users: number;
}

export interface UserAnalytics {
  total_users: number;
  verified_users: number;
  unverified_users: number;
  enrolled_users: number;
  non_enrolled_users: number;
  new_users_this_month: number;
  growth_data: UserGrowthDataPoint[];
}

// Enrollment Analytics
export interface EnrollmentProgressDistribution {
  range_0_25: number;
  range_26_50: number;
  range_51_75: number;
  range_76_99: number;
  range_100: number;
}

export interface EnrollmentTrendDataPoint {
  date: string;
  enrollments: number;
  completions: number;
}

export interface EnrollmentAnalytics {
  total_enrollments: number;
  active_enrollments: number;
  completed_enrollments: number;
  average_progress: number;
  completion_rate: number;
  average_completion_days: number | null;
  progress_distribution: EnrollmentProgressDistribution;
  trend_data: EnrollmentTrendDataPoint[];
}

// Revenue Analytics
export interface RevenueTrendDataPoint {
  date: string;
  revenue: string;
  payment_count: number;
}

export interface PaymentStatusBreakdown {
  completed: number;
  pending: number;
  failed: number;
  refunded: number;
}

export interface RevenueAnalytics {
  total_revenue: string;
  revenue_this_month: string;
  revenue_last_month: string;
  revenue_growth_percentage: number | null;
  average_transaction_value: string;
  payment_status_breakdown: PaymentStatusBreakdown;
  trend_data: RevenueTrendDataPoint[];
}

// Content Analytics
export interface ContentEngagementItem {
  content_id: string;
  title: string;
  content_type: string;
  view_count: number;
  completion_count: number;
  average_time_spent: number;
  completion_rate: number;
}

export interface ContentAnalytics {
  total_content_items: number;
  total_videos: number;
  total_pdfs: number;
  total_rich_text: number;
  most_viewed_content: ContentEngagementItem[];
  average_completion_rate: number;
}

// Review Analytics
export interface RatingDistribution {
  rating_1: number;
  rating_2: number;
  rating_3: number;
  rating_4: number;
  rating_5: number;
}

export interface RecentReviewItem {
  id: string;
  user_name: string;
  rating: number;
  review_text: string;
  status: string;
  created_at: string;
}

export interface ReviewAnalytics {
  total_reviews: number;
  approved_reviews: number;
  pending_reviews: number;
  rejected_reviews: number;
  average_rating: number;
  rating_distribution: RatingDistribution;
  recent_reviews: RecentReviewItem[];
}

// Recent Activity
export interface RecentEnrollmentItem {
  id: string;
  user_name: string;
  user_email: string;
  enrolled_at: string;
  progress_percentage: string;
}

export interface RecentCompletionItem {
  id: string;
  user_name: string;
  user_email: string;
  completed_at: string;
  completion_days: number;
}

export interface RecentActivity {
  recent_enrollments: RecentEnrollmentItem[];
  recent_completions: RecentCompletionItem[];
}

// Main Dashboard Response
export interface DashboardAnalytics {
  overview: OverviewMetrics;
  user_analytics: UserAnalytics;
  enrollment_analytics: EnrollmentAnalytics;
  revenue_analytics: RevenueAnalytics;
  content_analytics: ContentAnalytics;
  review_analytics: ReviewAnalytics;
  recent_activity: RecentActivity;
}
