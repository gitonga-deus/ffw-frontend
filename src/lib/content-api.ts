import { api } from "./api";
import type {
	CourseResponse,
	ModuleResponse,
	ModuleCreate,
	ModuleUpdate,
	ContentResponse,
	ContentCreate,
	ContentUpdate,
} from "@/types/content";

/**
 * Content Management API client
 */
export const contentApi = {
	// Course endpoints
	async getCourse(): Promise<CourseResponse> {
		const response = await api.get("/course");
		return response.data;
	},

	// Module endpoints
	async getModules(): Promise<ModuleResponse[]> {
		const response = await api.get("/course/modules");
		return response.data;
	},

	async getModulesAdmin(): Promise<ModuleResponse[]> {
		const response = await api.get("/admin/modules");
		return response.data;
	},

	async getModulesWithContentAdmin(): Promise<any[]> {
		const response = await api.get("/admin/modules-with-content");
		return response.data;
	},

	async getModule(moduleId: string): Promise<ModuleResponse> {
		const response = await api.get(`/modules/${moduleId}`);
		return response.data;
	},

	async createModule(data: ModuleCreate): Promise<ModuleResponse> {
		const response = await api.post("/admin/modules", data);
		return response.data;
	},

	async updateModule(moduleId: string, data: ModuleUpdate): Promise<ModuleResponse> {
		const response = await api.put(`/admin/modules/${moduleId}`, data);
		return response.data;
	},

	// Content endpoints
	async getModuleContent(moduleId: string): Promise<ContentResponse[]> {
		const response = await api.get(`/modules/${moduleId}/content`);
		return response.data;
	},

	async getContent(contentId: string): Promise<ContentResponse> {
		const response = await api.get(`/content/${contentId}`);
		return response.data;
	},

	async createContent(data: ContentCreate): Promise<ContentResponse> {
		const response = await api.post("/admin/content", data);
		return response.data;
	},

	async updateContent(contentId: string, data: ContentUpdate): Promise<ContentResponse> {
		const response = await api.put(`/admin/content/${contentId}`, data);
		return response.data;
	},

	async uploadPDF(contentId: string, file: File): Promise<{ pdf_url: string; filename: string }> {
		const formData = new FormData();
		formData.append("file", file);

		const response = await api.post(`/admin/content/${contentId}/upload-pdf`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	async deleteModule(moduleId: string): Promise<void> {
		await api.delete(`/admin/modules/${moduleId}`);
	},

	async deleteContent(contentId: string): Promise<void> {
		await api.delete(`/admin/content/${contentId}`);
	},

	async reorderContent(contentOrder: Array<{ id: string; order_index: number }>): Promise<void> {
		console.log("API call - reorderContent with:", contentOrder);
		const response = await api.put("/admin/content/reorder", { items: contentOrder });
		console.log("API response:", response.data);
		return response.data;
	},

	// Exercise endpoints
	async getExerciseSubmissions(exerciseId: string): Promise<any> {
		const response = await api.get(`/admin/exercises/${exerciseId}/submissions`);
		return response.data;
	},
};
