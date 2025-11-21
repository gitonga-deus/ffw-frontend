/**
 * CSV Export Utilities
 * Functions to export analytics data as CSV files
 */

import type { DashboardAnalytics } from "@/types/analytics";

/**
 * Convert data to CSV format
 */
function convertToCSV(data: any[], headers: string[]): string {
	const csvRows = [];
	
	// Add headers
	csvRows.push(headers.join(","));
	
	// Add data rows
	for (const row of data) {
		const values = headers.map((header) => {
			const value = row[header];
			// Escape quotes and wrap in quotes if contains comma
			const escaped = String(value).replace(/"/g, '""');
			return escaped.includes(",") ? `"${escaped}"` : escaped;
		});
		csvRows.push(values.join(","));
	}
	
	return csvRows.join("\n");
}

/**
 * Download CSV file
 */
function downloadCSV(csv: string, filename: string): void {
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);
	
	link.setAttribute("href", url);
	link.setAttribute("download", filename);
	link.style.visibility = "hidden";
	
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

/**
 * Export overview analytics
 */
export function exportOverviewCSV(analytics: DashboardAnalytics): void {
	const data = [
		{
			metric: "Total Users",
			value: analytics.overview.total_users,
		},
		{
			metric: "Verified Users",
			value: analytics.overview.verified_users,
		},
		{
			metric: "Active Enrollments",
			value: analytics.overview.active_enrollments,
		},
		{
			metric: "Completed Enrollments",
			value: analytics.overview.completed_enrollments,
		},
		{
			metric: "Total Revenue (KES)",
			value: analytics.overview.total_revenue,
		},
		{
			metric: "Revenue This Month (KES)",
			value: analytics.overview.revenue_this_month,
		},
		{
			metric: "Average Rating",
			value: analytics.overview.average_rating,
		},
		{
			metric: "Total Reviews",
			value: analytics.overview.total_reviews,
		},
		{
			metric: "Certificates Issued",
			value: analytics.overview.certificates_issued,
		},
	];
	
	const csv = convertToCSV(data, ["metric", "value"]);
	downloadCSV(csv, `overview-analytics-${new Date().toISOString().split("T")[0]}.csv`);
}

/**
 * Export user analytics
 */
export function exportUserAnalyticsCSV(analytics: DashboardAnalytics): void {
	const summaryData = [
		{
			metric: "Total Users",
			value: analytics.user_analytics.total_users,
		},
		{
			metric: "Verified Users",
			value: analytics.user_analytics.verified_users,
		},
		{
			metric: "Unverified Users",
			value: analytics.user_analytics.unverified_users,
		},
		{
			metric: "Enrolled Users",
			value: analytics.user_analytics.enrolled_users,
		},
		{
			metric: "Non-Enrolled Users",
			value: analytics.user_analytics.non_enrolled_users,
		},
		{
			metric: "New Users This Month",
			value: analytics.user_analytics.new_users_this_month,
		},
	];
	
	let csv = "User Analytics Summary\n";
	csv += convertToCSV(summaryData, ["metric", "value"]);
	
	if (analytics.user_analytics.growth_data && analytics.user_analytics.growth_data.length > 0) {
		csv += "\n\nUser Growth Data (Last 30 Days)\n";
		csv += convertToCSV(analytics.user_analytics.growth_data, ["date", "new_users", "verified_users"]);
	}
	
	downloadCSV(csv, `user-analytics-${new Date().toISOString().split("T")[0]}.csv`);
}

/**
 * Export enrollment analytics
 */
export function exportEnrollmentAnalyticsCSV(analytics: DashboardAnalytics): void {
	const summaryData = [
		{
			metric: "Total Enrollments",
			value: analytics.enrollment_analytics.total_enrollments,
		},
		{
			metric: "Active Enrollments",
			value: analytics.enrollment_analytics.active_enrollments,
		},
		{
			metric: "Completed Enrollments",
			value: analytics.enrollment_analytics.completed_enrollments,
		},
		{
			metric: "Average Progress (%)",
			value: analytics.enrollment_analytics.average_progress.toFixed(2),
		},
		{
			metric: "Completion Rate (%)",
			value: analytics.enrollment_analytics.completion_rate.toFixed(2),
		},
		{
			metric: "Average Completion Days",
			value: analytics.enrollment_analytics.average_completion_days?.toFixed(0) || "N/A",
		},
	];
	
	const distributionData = [
		{
			range: "0-25%",
			count: analytics.enrollment_analytics.progress_distribution.range_0_25,
		},
		{
			range: "26-50%",
			count: analytics.enrollment_analytics.progress_distribution.range_26_50,
		},
		{
			range: "51-75%",
			count: analytics.enrollment_analytics.progress_distribution.range_51_75,
		},
		{
			range: "76-99%",
			count: analytics.enrollment_analytics.progress_distribution.range_76_99,
		},
		{
			range: "100%",
			count: analytics.enrollment_analytics.progress_distribution.range_100,
		},
	];
	
	let csv = "Enrollment Analytics Summary\n";
	csv += convertToCSV(summaryData, ["metric", "value"]);
	csv += "\n\nProgress Distribution\n";
	csv += convertToCSV(distributionData, ["range", "count"]);
	
	downloadCSV(csv, `enrollment-analytics-${new Date().toISOString().split("T")[0]}.csv`);
}

/**
 * Export revenue analytics
 */
export function exportRevenueAnalyticsCSV(analytics: DashboardAnalytics): void {
	const summaryData = [
		{
			metric: "Total Revenue (KES)",
			value: analytics.revenue_analytics.total_revenue,
		},
		{
			metric: "Revenue This Month (KES)",
			value: analytics.revenue_analytics.revenue_this_month,
		},
		{
			metric: "Revenue Last Month (KES)",
			value: analytics.revenue_analytics.revenue_last_month,
		},
		{
			metric: "Revenue Growth (%)",
			value: analytics.revenue_analytics.revenue_growth_percentage?.toFixed(2) || "N/A",
		},
		{
			metric: "Average Transaction Value (KES)",
			value: analytics.revenue_analytics.average_transaction_value,
		},
	];
	
	const statusData = [
		{
			status: "Completed",
			count: analytics.revenue_analytics.payment_status_breakdown.completed,
		},
		{
			status: "Pending",
			count: analytics.revenue_analytics.payment_status_breakdown.pending,
		},
		{
			status: "Failed",
			count: analytics.revenue_analytics.payment_status_breakdown.failed,
		},
		{
			status: "Refunded",
			count: analytics.revenue_analytics.payment_status_breakdown.refunded,
		},
	];
	
	let csv = "Revenue Analytics Summary\n";
	csv += convertToCSV(summaryData, ["metric", "value"]);
	csv += "\n\nPayment Status Breakdown\n";
	csv += convertToCSV(statusData, ["status", "count"]);
	
	downloadCSV(csv, `revenue-analytics-${new Date().toISOString().split("T")[0]}.csv`);
}

/**
 * Export content analytics
 */
export function exportContentAnalyticsCSV(analytics: DashboardAnalytics): void {
	const summaryData = [
		{
			metric: "Total Content Items",
			value: analytics.content_analytics.total_content_items,
		},
		{
			metric: "Total Videos",
			value: analytics.content_analytics.total_videos,
		},
		{
			metric: "Total PDFs",
			value: analytics.content_analytics.total_pdfs,
		},
		{
			metric: "Total Rich Text",
			value: analytics.content_analytics.total_rich_text,
		},
		{
			metric: "Average Completion Rate (%)",
			value: analytics.content_analytics.average_completion_rate.toFixed(2),
		},
	];
	
	let csv = "Content Analytics Summary\n";
	csv += convertToCSV(summaryData, ["metric", "value"]);
	
	if (analytics.content_analytics.most_viewed_content.length > 0) {
		csv += "\n\nMost Viewed Content\n";
		csv += convertToCSV(
			analytics.content_analytics.most_viewed_content,
			["title", "content_type", "view_count", "completion_count", "completion_rate"]
		);
	}
	
	downloadCSV(csv, `content-analytics-${new Date().toISOString().split("T")[0]}.csv`);
}

/**
 * Export review analytics
 */
export function exportReviewAnalyticsCSV(analytics: DashboardAnalytics): void {
	const summaryData = [
		{
			metric: "Total Reviews",
			value: analytics.review_analytics.total_reviews,
		},
		{
			metric: "Approved Reviews",
			value: analytics.review_analytics.approved_reviews,
		},
		{
			metric: "Pending Reviews",
			value: analytics.review_analytics.pending_reviews,
		},
		{
			metric: "Rejected Reviews",
			value: analytics.review_analytics.rejected_reviews,
		},
		{
			metric: "Average Rating",
			value: analytics.review_analytics.average_rating.toFixed(2),
		},
	];
	
	const ratingData = [
		{
			rating: "5 Stars",
			count: analytics.review_analytics.rating_distribution.rating_5,
		},
		{
			rating: "4 Stars",
			count: analytics.review_analytics.rating_distribution.rating_4,
		},
		{
			rating: "3 Stars",
			count: analytics.review_analytics.rating_distribution.rating_3,
		},
		{
			rating: "2 Stars",
			count: analytics.review_analytics.rating_distribution.rating_2,
		},
		{
			rating: "1 Star",
			count: analytics.review_analytics.rating_distribution.rating_1,
		},
	];
	
	let csv = "Review Analytics Summary\n";
	csv += convertToCSV(summaryData, ["metric", "value"]);
	csv += "\n\nRating Distribution\n";
	csv += convertToCSV(ratingData, ["rating", "count"]);
	
	downloadCSV(csv, `review-analytics-${new Date().toISOString().split("T")[0]}.csv`);
}

/**
 * Export all analytics data
 */
export function exportAllAnalyticsCSV(analytics: DashboardAnalytics): void {
	// This creates a comprehensive export with all data
	let csv = "LMS Analytics Report\n";
	csv += `Generated: ${new Date().toISOString()}\n\n`;
	
	// Overview
	csv += "=== OVERVIEW ===\n";
	csv += convertToCSV([
		{ metric: "Total Users", value: analytics.overview.total_users },
		{ metric: "Active Enrollments", value: analytics.overview.active_enrollments },
		{ metric: "Total Revenue (KES)", value: analytics.overview.total_revenue },
		{ metric: "Average Rating", value: analytics.overview.average_rating },
	], ["metric", "value"]);
	
	csv += "\n\n=== USER ANALYTICS ===\n";
	csv += convertToCSV([
		{ metric: "Total Users", value: analytics.user_analytics.total_users },
		{ metric: "Verified Users", value: analytics.user_analytics.verified_users },
		{ metric: "Enrolled Users", value: analytics.user_analytics.enrolled_users },
	], ["metric", "value"]);
	
	csv += "\n\n=== ENROLLMENT ANALYTICS ===\n";
	csv += convertToCSV([
		{ metric: "Total Enrollments", value: analytics.enrollment_analytics.total_enrollments },
		{ metric: "Completion Rate (%)", value: analytics.enrollment_analytics.completion_rate.toFixed(2) },
		{ metric: "Average Progress (%)", value: analytics.enrollment_analytics.average_progress.toFixed(2) },
	], ["metric", "value"]);
	
	csv += "\n\n=== REVENUE ANALYTICS ===\n";
	csv += convertToCSV([
		{ metric: "Total Revenue (KES)", value: analytics.revenue_analytics.total_revenue },
		{ metric: "This Month (KES)", value: analytics.revenue_analytics.revenue_this_month },
		{ metric: "Growth (%)", value: analytics.revenue_analytics.revenue_growth_percentage?.toFixed(2) || "N/A" },
	], ["metric", "value"]);
	
	downloadCSV(csv, `complete-analytics-${new Date().toISOString().split("T")[0]}.csv`);
}
