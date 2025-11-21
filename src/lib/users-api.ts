import { api } from "./api";
import type { UserListResponse, UserDetailResponse, UserFilters } from "@/types/user";

/**
 * Users API client
 */
export const usersApi = {
	/**
	 * Get paginated list of users with optional filters
	 */
	async getUsers(filters?: UserFilters): Promise<UserListResponse> {
		const params = new URLSearchParams();

		if (filters?.page) params.append("page", filters.page.toString());
		if (filters?.page_size) params.append("page_size", filters.page_size.toString());
		if (filters?.enrollment_status) params.append("enrollment_status", filters.enrollment_status);
		if (filters?.registration_date_from)
			params.append("registration_date_from", filters.registration_date_from);
		if (filters?.registration_date_to)
			params.append("registration_date_to", filters.registration_date_to);

		const response = await api.get(`/admin/users?${params.toString()}`);
		return response.data;
	},

	/**
	 * Get detailed user information
	 */
	async getUserDetail(userId: string): Promise<UserDetailResponse> {
		const response = await api.get(`/admin/users/${userId}`);
		return response.data;
	},
};
