// Course Types
export interface CourseResponse {
	id: string;
	title: string;
	description: string;
	price: number;
	currency: string;
	instructor_name: string;
	instructor_bio: string | null;
	instructor_image_url: string | null;
	thumbnail_url: string | null;
	is_published: boolean;
	created_at: string;
	updated_at: string;
}

// Module Types
export interface ModuleResponse {
	id: string;
	course_id: string;
	title: string;
	description: string | null;
	order_index: number;
	is_published: boolean;
	created_at: string;
	updated_at: string;
}

export interface ModuleCreate {
	course_id: string;
	title: string;
	description?: string;
	order_index: number;
	is_published?: boolean;
}

export interface ModuleUpdate {
	title?: string;
	description?: string;
	order_index?: number;
	is_published?: boolean;
}

// Content Types
export interface ContentResponse {
	id: string;
	module_id: string;
	content_type: "video" | "pdf" | "rich_text" | "exercise";
	title: string;
	order_index: number;
	vimeo_video_id?: string | null;
	video_duration?: number | null;
	pdf_url?: string | null;
	pdf_filename?: string | null;
	rich_text_content?: any;
	is_published: boolean;
	created_at: string;
	updated_at: string;
	// Exercise fields
	exercise?: ExerciseResponse;
}

export interface ContentCreate {
	module_id: string;
	content_type: "video" | "pdf" | "rich_text" | "exercise";
	title: string;
	order_index: number;
	vimeo_video_id?: string;
	video_duration?: number;
	pdf_filename?: string;
	rich_text_content?: any;
	is_published?: boolean;
	// Exercise fields (nested object for backend)
	exercise_data?: {
		embed_code: string;
		form_title: string;
		allow_multiple_submissions?: boolean;
	};
}

export interface ContentUpdate {
	title?: string;
	order_index?: number;
	vimeo_video_id?: string;
	video_duration?: number;
	pdf_filename?: string;
	rich_text_content?: any;
	is_published?: boolean;
	// Exercise fields
	embed_code?: string;
	form_title?: string;
	allow_multiple_submissions?: boolean;
}

// Exercise Types
export interface ExerciseResponse {
	id: string;
	content_id: string;
	form_id: string;
	embed_code: string;
	form_title: string;
	allow_multiple_submissions: boolean;
	created_at: string;
	updated_at: string;
}

export interface ExerciseSubmissionResponse {
	id: string;
	exercise_id: string;
	user_id: string;
	user_name: string;
	user_email: string;
	form_submission_id: string;
	submitted_at: string;
	webhook_received_at: string;
}

export interface ExerciseSubmissionsListResponse {
	submissions: ExerciseSubmissionResponse[];
	total_submissions: number;
	unique_users: number;
	completion_rate: number;
	exercise_info: ExerciseResponse;
}

// Combined Types
export interface ModuleWithContent extends ModuleResponse {
	content_items: ContentResponse[];
}
