// User types
export interface User {
  id: string;
  email: string;
  phone_number: string;
  full_name: string;
  profile_image_url?: string;
  role: 'student' | 'admin';
  is_verified: boolean;
  is_enrolled: boolean;
  created_at: string;
  last_login_at?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone_number: string;
  full_name: string;
  password: string;
  confirm_password: string;
  profile_image?: File;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  instructor_name: string;
  instructor_bio?: string;
  instructor_image_url?: string;
  thumbnail_url?: string;
  is_published: boolean;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  is_published: boolean;
}

export interface Content {
  id: string;
  module_id: string;
  content_type: 'video' | 'pdf' | 'rich_text' | 'exercise';
  title: string;
  order_index: number;
  vimeo_video_id?: string;
  video_duration?: number;
  pdf_url?: string;
  pdf_filename?: string;
  rich_text_content?: RichTextContent | string; // Can be object with blocks/content or HTML string
  is_published: boolean;
  // Exercise fields
  exercise?: {
    id: string;
    content_id: string;
    form_id: string;
    embed_code: string;
    form_title: string;
    allow_multiple_submissions: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface RichTextContent {
  blocks?: RichTextBlock[];
  content?: string; // HTML string from TipTap editor
}

export interface RichTextBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'exercise';
  content?: string;
  level?: number;
  exercise_id?: string;
  title?: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  type: 'radio' | 'text';
  question: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

// Enrollment types
export interface Enrollment {
  id: string;
  user_id: string;
  payment_id?: string;
  signature_url?: string;
  signature_created_at?: string;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
  last_accessed_module_id?: string;
  last_accessed_at?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  ipay_transaction_id?: string;
  created_at: string;
}

export interface PaymentInitiateResponse {
  payment_id: string;
  payment_url: string;
  amount: number;
  currency: string;
}

export interface EnrollmentStatusResponse {
  is_enrolled: boolean;
  enrollment?: Enrollment;
  payment?: Payment;
  has_signature: boolean;
}

// Certificate types
export interface Certificate {
  id: string;
  user_id: string;
  certification_id: string;
  certificate_url: string;
  issued_at: string;
  student_name: string;
  course_title: string;
}

// Review types
export interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  user?: {
    full_name: string;
    profile_image_url?: string;
  };
}

// Announcement types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_by: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementListResponse {
  announcements: Announcement[];
  total: number;
}

// Notification types
export type TargetAudience = 'all_enrolled' | 'all_users' | 'specific';

export interface Notification {
  id: string;
  title: string;
  message: string;
  target_audience: TargetAudience;
  target_user_ids?: string;
  sent_by: string;
  sent_at: string;
  email_sent: boolean;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
}

export interface NotificationCreate {
  title: string;
  message: string;
  target_audience: TargetAudience;
  target_user_ids?: string[];
}

// Analytics types
export interface AnalyticsOverview {
  total_users: number;
  enrolled_users: number;
  non_enrolled_users: number;
  total_revenue: number;
  currency: string;
  payment_count: number;
  previous_revenue: number;
  revenue_change_percentage: number | null;
  registration_rate: number;
  enrollment_rate: number;
  completion_rate: number;
  period: string;
  start_date: string;
  end_date: string;
}

export interface FunnelMetrics {
  visitors: number;
  registered: number;
  enrolled: number;
  completed: number;
  visitor_to_registered_rate: number;
  registered_to_enrolled_rate: number;
  enrolled_to_completed_rate: number;
  overall_conversion_rate: number;
  period: string;
  start_date: string;
  end_date: string;
}

export interface EnrollmentTrend {
  date: string;
  enrollments: number;
  revenue: number;
}

export interface EnrollmentTrends {
  data: EnrollmentTrend[];
  total_enrollments: number;
  total_revenue: number;
  currency: string;
  period: string;
  start_date: string;
  end_date: string;
}

export interface UserListItem {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  profile_image_url?: string;
  role: 'student' | 'admin';
  is_enrolled: boolean;
  is_verified: boolean;
  created_at: string;
  last_login_at?: string;
}

export interface UserListResponse {
  users: UserListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// API Error types
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
  };
}

export interface StudentProgressStats {
  user_id: string;
  full_name: string;
  email: string;
  enrolled_at: string;
  progress_percentage: number;
  completed_at?: string;
  last_accessed_at?: string;
  time_to_completion_days?: number;
}

export interface UserStatisticsResponse {
  students: StudentProgressStats[];
  total_students: number;
  completed_students: number;
  average_progress: number;
  average_completion_days?: number;
  completion_rate: number;
}

// User Detail types
export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  ipay_transaction_id?: string;
  created_at: string;
}

export interface EnrollmentDetail {
  id: string;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
  last_accessed_at?: string;
  signature_url?: string;
  signature_created_at?: string;
}

export interface ActivityLogItem {
  event_type: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface UserDetail {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  profile_image_url?: string;
  role: 'student' | 'admin';
  is_verified: boolean;
  is_enrolled: boolean;
  created_at: string;
  last_login_at?: string;
  enrollment?: EnrollmentDetail;
  payment_history: PaymentHistoryItem[];
  activity_logs: ActivityLogItem[];
}
