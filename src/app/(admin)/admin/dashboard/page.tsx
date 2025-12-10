"use client";

import { useEffect, useState } from"react";
import { analyticsApi } from"@/lib/analytics-api";
import { api } from"@/lib/api";
import type { DashboardAnalytics } from"@/types/analytics";
import {
	Users,
	TrendingUp,
	DollarSign,
	Star,
	Award,
	UserCheck,
	Download,
} from"lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Skeleton } from"@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from"@/components/ui/tabs";
import { Progress } from"@/components/ui/progress";
import { Button } from"@/components/ui/button";
import { Badge } from"@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from"@/components/ui/table";
import {
	exportOverviewCSV,
	exportEnrollmentAnalyticsCSV,
	exportRevenueAnalyticsCSV,
	exportAllAnalyticsCSV,
} from"@/lib/csv-export";

interface PaymentListItem {
	id: string;
	user_id: string;
	user_name: string;
	user_email: string;
	amount: string;
	currency: string;
	status: string;
	payment_method: string | null;
	ipay_transaction_id: string | null;
	ipay_reference: string | null;
	created_at: string;
}

export default function AdminDashboardPage() {
	const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
	const [payments, setPayments] = useState<PaymentListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			
			// Fetch both analytics and payments in a single request
			const response = await api.get("/admin/analytics/dashboard-with-payments?page=1&page_size=20");
			
			setAnalytics(response.data.analytics);
			setPayments(response.data.payments);
			setLoading(false);
		} catch (err) {
			setError("Failed to load dashboard data");
			console.error(err);
			setLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year:"numeric",
			month:"short",
			day:"numeric",
		});
	};

	const getStatusBadge = (status: string) => {
		const variants: Record<string, string> = {
			completed:"bg-green-500",
			pending:"bg-yellow-500",
			failed:"bg-red-500",
			refunded:"bg-gray-500",
		};
		return (
			<Badge className={variants[status] ||"bg-gray-500"}>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</Badge>
		);
	};

	const exportPaymentsToCSV = (paymentsData: PaymentListItem[]) => {
		if (paymentsData.length === 0) {
			return;
		}

		// Prepare CSV headers
		const headers = [
			"Transaction ID",
			"Student Name",
			"Student Email",
			"Amount",
			"Currency",
			"Payment Method",
			"Status",
			"Date",
		];

		// Prepare CSV rows
		const rows = paymentsData.map((payment) => [
			payment.ipay_transaction_id || payment.id.slice(0, 8),
			payment.user_name,
			payment.user_email,
			parseFloat(payment.amount).toLocaleString(),
			payment.currency,
			payment.payment_method || "N/A",
			payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
			formatDate(payment.created_at),
		]);

		// Create CSV content
		const csvContent = [
			headers.join(","),
			...rows.map((row) =>
				row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
			),
		].join("\n");

		// Create blob and download
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		
		link.setAttribute("href", url);
		link.setAttribute("download", `payment-transactions-${new Date().toISOString().split("T")[0]}.csv`);
		link.style.visibility = "hidden";
		
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (loading) {
		return <DashboardSkeleton />;
	}

	if (error || !analytics) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-muted-foreground">{error ||"No data available"}</p>
				</div>
			</div>
		);
	}

	const { overview, enrollment_analytics, revenue_analytics, review_analytics, recent_activity } =
		analytics;

	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold mb-2">Dashboard</h1>
					<p className="text-muted-foreground">Overview of your LMS performance</p>
				</div>
				<Button onClick={() => exportAllAnalyticsCSV(analytics)} className="h-10 px-6! rounded-md">
					<Download className="h-4 w-4 mr-2" />
					Export All Data
				</Button>
			</div>

			{/* Overview Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{overview.total_users}</div>
						<p className="text-xs text-muted-foreground">
							<UserCheck className="inline h-3 w-3 mr-1" />
							{overview.verified_users} verified
						</p>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{overview.active_enrollments}</div>
						<p className="text-xs text-muted-foreground">
							{overview.completed_enrollments} completed
						</p>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							KES {parseFloat(overview.total_revenue).toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">
							KES {parseFloat(overview.revenue_this_month).toLocaleString()} this month
						</p>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Average Rating</CardTitle>
						<Star className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{overview.average_rating.toFixed(1)}</div>
						<p className="text-xs text-muted-foreground">
							{overview.total_reviews} reviews ({overview.pending_reviews} pending)
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Tabs for Enrollment & Revenue */}
			<Tabs defaultValue="overview" className="space-y-6">
				<TabsList className="w-full h-10 rounded">
					<TabsTrigger value="overview" className="rounded">
						Overview
					</TabsTrigger>
					<TabsTrigger value="enrollment-revenue" className="rounded">
						Enrollment & Revenue
					</TabsTrigger>
					<TabsTrigger value="reviews" className="rounded">
						Reviews
					</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6">
					{/* Quick Stats Row */}
					<div className="grid gap-4 md:grid-cols-3">
						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{enrollment_analytics.completion_rate.toFixed(1)}%
								</div>
								<Progress value={enrollment_analytics.completion_rate} className="mt-2" />
								<p className="text-xs text-muted-foreground mt-2">
									Avg. {enrollment_analytics.average_completion_days?.toFixed(0) ||"N/A"} days to
									complete
								</p>
							</CardContent>
						</Card>

						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{revenue_analytics.revenue_growth_percentage !== null
										? `${revenue_analytics.revenue_growth_percentage > 0 ?"+" :""}${revenue_analytics.revenue_growth_percentage.toFixed(1)}%`
										:"N/A"}
								</div>
								<p className="text-xs text-muted-foreground mt-2">Month-over-month</p>
							</CardContent>
						</Card>

						<Card className="rounded-md shadow-xs">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
								<Award className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{overview.certificates_issued}</div>
								<p className="text-xs text-muted-foreground">
									{overview.certificates_this_month} this month
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Recent Activity */}
					<div className="grid gap-4 md:grid-cols-2">
						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle>Recent Enrollments</CardTitle>
								<CardDescription>Latest students who enrolled</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{recent_activity.recent_enrollments.length > 0 ? (
										recent_activity.recent_enrollments.map((enrollment) => (
											<div key={enrollment.id} className="flex items-center justify-between">
												<div className="space-y-1">
													<p className="text-sm font-medium leading-none">
														{enrollment.user_name}
													</p>
													<p className="text-xs text-muted-foreground">{enrollment.user_email}</p>
												</div>
												<div className="text-right">
													<p className="text-sm font-medium">
														{parseFloat(enrollment.progress_percentage).toFixed(0)}%
													</p>
													<p className="text-xs text-muted-foreground">
														{new Date(enrollment.enrolled_at).toLocaleDateString()}
													</p>
												</div>
											</div>
										))
									) : (
										<p className="text-sm text-muted-foreground">No recent enrollments</p>
									)}
								</div>
							</CardContent>
						</Card>

						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle>Recent Completions</CardTitle>
								<CardDescription>Students who completed the course</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{recent_activity.recent_completions.length > 0 ? (
										recent_activity.recent_completions.map((completion) => (
											<div key={completion.id} className="flex items-center justify-between">
												<div className="space-y-1">
													<p className="text-sm font-medium leading-none">
														{completion.user_name}
													</p>
													<p className="text-xs text-muted-foreground">{completion.user_email}</p>
												</div>
												<div className="text-right">
													<p className="text-sm font-medium">{completion.completion_days} days</p>
													<p className="text-xs text-muted-foreground">
														{new Date(completion.completed_at).toLocaleDateString()}
													</p>
												</div>
											</div>
										))
									) : (
										<p className="text-sm text-muted-foreground">No recent completions</p>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Enrollment & Revenue Tab */}
				<TabsContent value="enrollment-revenue" className="space-y-6">
					{/* <div className="flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => exportEnrollmentAnalyticsCSV(analytics)}
							className="h-9"
						>
							<Download className="h-4 w-4 mr-2" />
							Export Enrollment
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => exportRevenueAnalyticsCSV(analytics)}
							className="h-9"
						>
							<Download className="h-4 w-4 mr-2" />
							Export Revenue
						</Button>
					</div> */}

					{/* Enrollment & Revenue Stats */}
					<div className="grid gap-4 md:grid-cols-4">
						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{enrollment_analytics.total_enrollments}</div>
							</CardContent>
						</Card>

						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">Active</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{enrollment_analytics.active_enrollments}</div>
								<Progress
									value={
										(enrollment_analytics.active_enrollments /
											enrollment_analytics.total_enrollments) *
										100
									}
									className="mt-2"
								/>
							</CardContent>
						</Card>

						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">Completed</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{enrollment_analytics.completed_enrollments}
								</div>
								<Progress
									value={
										(enrollment_analytics.completed_enrollments /
											enrollment_analytics.total_enrollments) *
										100
									}
									className="mt-2"
								/>
							</CardContent>
						</Card>

						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{enrollment_analytics.average_progress.toFixed(1)}%
								</div>
								<Progress value={enrollment_analytics.average_progress} className="mt-2" />
							</CardContent>
						</Card>
					</div>

					{/* Revenue Stats */}
					<div className="grid gap-4 md:grid-cols-3">
						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									KES {parseFloat(revenue_analytics.total_revenue).toLocaleString()}
								</div>
							</CardContent>
						</Card>

						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">This Month</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									KES {parseFloat(revenue_analytics.revenue_this_month).toLocaleString()}
								</div>
							</CardContent>
						</Card>

						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">Last Month</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									KES {parseFloat(revenue_analytics.revenue_last_month).toLocaleString()}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Payment Transactions Table */}
					<Card className="rounded-md shadow-xs">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Recent Transactions</CardTitle>
									<CardDescription>Latest payment transactions</CardDescription>
								</div>
								<Button
									variant="outline"
									onClick={() => exportPaymentsToCSV(payments)}
									disabled={payments.length === 0}
									className="rounded"
								>
									<Download className="h-4 w-4 mr-2" />
									Export Data
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{payments.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Transaction ID</TableHead>
											<TableHead>Student</TableHead>
											<TableHead>Amount</TableHead>
											<TableHead>Method</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Date</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{payments.map((payment) => (
											<TableRow key={payment.id}>
												<TableCell className="font-mono text-xs">
													{payment.ipay_transaction_id || payment.id.slice(0, 8)}
												</TableCell>
												<TableCell>
													<div>
														<p className="font-medium">{payment.user_name}</p>
														<p className="text-xs text-muted-foreground">{payment.user_email}</p>
													</div>
												</TableCell>
												<TableCell className="font-medium">
													{payment.currency} {parseFloat(payment.amount).toLocaleString()}
												</TableCell>
												<TableCell>
													<Badge variant="outline" className="capitalize">
														{payment.payment_method ||"N/A"}
													</Badge>
												</TableCell>
												<TableCell>{getStatusBadge(payment.status)}</TableCell>
												<TableCell>{formatDate(payment.created_at)}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<div className="text-center py-8 text-muted-foreground">
									<p>No payment transactions yet</p>
								</div>
							)}
						</CardContent>
					</Card>

				</TabsContent>

				{/* Reviews Tab */}
				<TabsContent value="reviews" className="space-y-6">
					{/* Rating Stats */}
					<div className="grid gap-4 md:grid-cols-4">
						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{review_analytics.total_reviews}</div>
							</CardContent>
						</Card>

						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">Approved</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{review_analytics.approved_reviews}</div>
							</CardContent>
						</Card>

						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">Pending</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{review_analytics.pending_reviews}</div>
							</CardContent>
						</Card>

						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle className="text-sm font-medium">Average Rating</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{review_analytics.average_rating.toFixed(1)}</div>
								<div className="flex items-center mt-2">
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={i}
											className={`h-4 w-4 ${
												i < Math.round(review_analytics.average_rating)
													?"fill-yellow-400 text-yellow-400"
													:"text-gray-300"
											}`}
										/>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Recent Reviews */}
					<Card className="rounded-md shadow-xs">
						<CardHeader>
							<CardTitle>Recent Reviews</CardTitle>
							<CardDescription>Latest course reviews from students</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{review_analytics.recent_reviews.length > 0 ? (
									review_analytics.recent_reviews.map((review) => (
										<div
											key={review.id}
											className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
										>
											<div className="space-y-1 flex-1">
												<div className="flex items-center gap-2">
													<p className="text-sm font-medium">{review.user_name}</p>
													<div className="flex items-center">
														{Array.from({ length: 5 }).map((_, i) => (
															<Star
																key={i}
																className={`h-3 w-3 ${
																	i < review.rating
																		?"fill-yellow-400 text-yellow-400"
																		:"text-gray-300"
																}`}
															/>
														))}
													</div>
													<span
														className={`text-xs px-2 py-0.5 rounded ${
															review.status ==="approved"
																?"bg-green-100 text-green-700"
																: review.status ==="pending"
																?"bg-yellow-100 text-yellow-700"
																:"bg-red-100 text-red-700"
														}`}
													>
														{review.status}
													</span>
												</div>
												<p className="text-sm text-muted-foreground">{review.review_text}</p>
											</div>
											<p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
												{new Date(review.created_at).toLocaleDateString()}
											</p>
										</div>
									))
								) : (
									<p className="text-sm text-muted-foreground">No reviews yet</p>
								)}
							</div>
						</CardContent>
					</Card>

				</TabsContent>
			</Tabs>
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			{/* Page Header Skeleton */}
			<div className="flex items-center justify-between">
				<div>
					<Skeleton className="h-8 w-48 mb-2" />
					<Skeleton className="h-4 w-64" />
				</div>
				<Skeleton className="h-10 w-40" />
			</div>

			{/* Overview Cards Skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i} className="rounded-sm shadow-none">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-20 mb-2" />
							<Skeleton className="h-3 w-32" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Tabs Skeleton */}
			<div className="space-y-6">
				<Skeleton className="h-10 w-full" />

				{/* Quick Stats Row Skeleton */}
				<div className="grid gap-4 md:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<Card key={i} className="rounded-sm shadow-none">
							<CardHeader>
								<Skeleton className="h-4 w-32" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-8 w-20 mb-2" />
								<Skeleton className="h-2 w-full mb-2" />
								<Skeleton className="h-3 w-40" />
							</CardContent>
						</Card>
					))}
				</div>

				{/* Recent Activity Skeleton */}
				<div className="grid gap-4 md:grid-cols-2">
					{Array.from({ length: 2 }).map((_, i) => (
						<Card key={i} className="rounded-sm shadow-none">
							<CardHeader>
								<Skeleton className="h-5 w-40 mb-1" />
								<Skeleton className="h-3 w-48" />
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{Array.from({ length: 3 }).map((_, j) => (
										<div key={j} className="flex items-center justify-between">
											<div className="space-y-1 flex-1">
												<Skeleton className="h-4 w-32" />
												<Skeleton className="h-3 w-48" />
											</div>
											<div className="text-right">
												<Skeleton className="h-4 w-12 mb-1" />
												<Skeleton className="h-3 w-20" />
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Table Skeleton */}
				<Card className="rounded-sm shadow-none">
					<CardHeader>
						<Skeleton className="h-5 w-40 mb-1" />
						<Skeleton className="h-3 w-56" />
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{/* Table Header */}
							<div className="flex gap-4 pb-2 border-b">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-32 flex-1" />
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-24" />
							</div>
							{/* Table Rows */}
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="flex gap-4 py-3">
									<Skeleton className="h-4 w-24" />
									<div className="flex-1 space-y-1">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-48" />
									</div>
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-4 w-24" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
