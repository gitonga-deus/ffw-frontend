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
	content_type: "video" | "pdf" | "rich_text";
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
}

export interface ContentCreate {
	module_id: string;
	content_type: "video" | "pdf" | "rich_text";
	title: string;
	order_index: number;
	vimeo_video_id?: string;
	video_duration?: number;
	pdf_filename?: string;
	rich_text_content?: any;
	is_published?: boolean;
}

export interface ContentUpdate {
	title?: string;
	order_index?: number;
	vimeo_video_id?: string;
	video_duration?: number;
	pdf_filename?: string;
	rich_text_content?: any;
	is_published?: boolean;
}

// Combined Types
export interface ModuleWithContent extends ModuleResponse {
	content_items: ContentResponse[];
}
