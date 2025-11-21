import { api } from "./api";
import type {
	DashboardAnalytics,
	OverviewMetrics,
	UserAnalytics,
	EnrollmentAnalytics,
	RevenueAnalytics,
	ContentAnalytics,
	ReviewAnalytics,
	RecentActivity,
} from "@/types/analytics";

/**
 * Analytics API client
 */
export const analyticsApi = {
	/**
	 * Get complete dashboard analytics
	 */
	async getDashboardAnalytics(): Promise<DashboardAnalytics> {
		const response = await api.get("/admin/analytics/dashboard");
		return response.data;
	},

};
