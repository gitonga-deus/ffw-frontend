// User List Types
export interface UserListItem {
	id: string;
	email: string;
	full_name: string;
	phone_number: string;
	profile_image_url: string | null;
	role: string;
	is_verified: boolean;
	is_enrolled: boolean;
	created_at: string;
	last_login_at: string | null;
}

export interface UserListResponse {
	users: UserListItem[];
	total: number;
	page: number;
	page_size: number;
	total_pages: number;
}

// User Detail Types
export interface PaymentHistoryItem {
	id: string;
	amount: string;
	currency: string;
	status: string;
	payment_method: string | null;
	ipay_transaction_id: string | null;
	created_at: string;
}

export interface EnrollmentDetail {
	id: string;
	enrolled_at: string;
	completed_at: string | null;
	progress_percentage: string;
	last_accessed_at: string | null;
	signature_url: string | null;
	signature_created_at: string | null;
}

export interface ActivityLogItem {
	event_type: string;
	created_at: string;
	metadata: Record<string, any> | null;
}

export interface UserDetailResponse {
	id: string;
	email: string;
	full_name: string;
	phone_number: string;
	profile_image_url: string | null;
	role: string;
	is_verified: boolean;
	is_enrolled: boolean;
	created_at: string;
	last_login_at: string | null;
	enrollment: EnrollmentDetail | null;
	payment_history: PaymentHistoryItem[];
	activity_logs: ActivityLogItem[];
}

// Filter Types
export interface UserFilters {
	page?: number;
	page_size?: number;
	enrollment_status?: "enrolled" | "not_enrolled" | null;
	registration_date_from?: string;
	registration_date_to?: string;
}
