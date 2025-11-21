"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usersApi } from "@/lib/users-api";
import type { UserDetailResponse } from "@/types/user";
import {
	User,
	Mail,
	Phone,
	Calendar,
	Clock,
	CheckCircle,
	XCircle,
	DollarSign,
	TrendingUp,
	FileText,
	ArrowLeft,
	Activity,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserDetailPage() {
	const params = useParams();
	const router = useRouter();
	const userId = params.id as string;

	const [user, setUser] = useState<UserDetailResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchUserDetail();
	}, [userId]);

	const fetchUserDetail = async () => {
		try {
			setLoading(true);
			const data = await usersApi.getUserDetail(userId);
			setUser(data);
		} catch (err) {
			setError("Failed to load user details");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return <UserDetailSkeleton />;
	}

	if (error || !user) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-6">
				<Button variant="ghost" onClick={() => router.back()} className="w-fit h-10">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back
				</Button>
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-muted-foreground">{error || "User not found"}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			{/* Back Button */}
			<Button variant="ghost" onClick={() => router.back()} className="w-fit h-10 px-4!">
				<ArrowLeft className="h-4 w-4 mr-2" />
				Back to Users
			</Button>

			{/* User Profile Header */}
			<Card className="rounded-md shadow-xs">
				<CardContent className="pt-6">
					<div className="flex flex-col md:flex-row gap-6">
						<Avatar className="h-24 w-24">
							<AvatarImage src={user.profile_image_url || undefined} />
							<AvatarFallback className="text-2xl">{getInitials(user.full_name)}</AvatarFallback>
						</Avatar>

						<div className="flex-1 space-y-4">
							<div>
								<h1 className="text-2xl font-bold">{user.full_name}</h1>
								<p className="text-muted-foreground capitalize">{user.role}</p>
							</div>

							<div className="grid gap-3 md:grid-cols-2">
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{user.email}</span>
								</div>
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{user.phone_number}</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">Joined {formatDate(user.created_at)}</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">
										Last login:{" "}
										{user.last_login_at ? formatDateTime(user.last_login_at) : "Never"}
									</span>
								</div>
							</div>

							<div className="flex gap-2">
								<Badge variant={user.is_enrolled ? "default" : "secondary"} className="px-4 bg-[#049ad1]">
									{user.is_enrolled ? (
										<>
											Enrolled
										</>
									) : (
										<>
											Not Enrolled
										</>
									)}
								</Badge>
								<Badge variant={user.is_verified ? "secondary" : "outline"} className="rounded-full px-3 py-1">
									{user.is_verified ? (
										<>
											Verified
										</>
									) : (
										<>
											Unverified
										</>
									)}
								</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabs for different sections */}
			<Tabs defaultValue="enrollment" className="space-y-6">
				<TabsList className="w-full rounded h-10">
					<TabsTrigger value="enrollment" className="rounded">Enrollment</TabsTrigger>
					<TabsTrigger value="payments" className="rounded">Payments</TabsTrigger>
				</TabsList>

				{/* Enrollment Tab */}
				<TabsContent value="enrollment" className="space-y-6">
					{user.enrollment ? (
						<>
							<div className="grid gap-4 md:grid-cols-3">
								<Card className="rounded-md shadow-xs">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Progress</CardTitle>
										<TrendingUp className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{parseFloat(user.enrollment.progress_percentage).toFixed(1)}%
										</div>
										<Progress
											value={parseFloat(user.enrollment.progress_percentage)}
											className="mt-2"
										/>
									</CardContent>
								</Card>

								<Card className="rounded-sm shadow-none">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Enrolled Date</CardTitle>
										<Calendar className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-lg font-medium">
											{formatDate(user.enrollment.enrolled_at)}
										</div>
									</CardContent>
								</Card>

								<Card className="rounded-md shadow-xs">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Status</CardTitle>
										<CheckCircle className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-lg font-medium">
											{user.enrollment.completed_at ? "Completed" : "In Progress"}
										</div>
										{user.enrollment.completed_at && (
											<p className="text-xs text-muted-foreground mt-1">
												{formatDate(user.enrollment.completed_at)}
											</p>
										)}
									</CardContent>
								</Card>
							</div>

							<Card className="rounded-md shadow-xs">
								<CardHeader>
									<CardTitle>Enrollment Details</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<p className="text-sm font-medium text-muted-foreground">Last Accessed</p>
											<p className="text-sm">
												{user.enrollment.last_accessed_at
													? formatDateTime(user.enrollment.last_accessed_at)
													: "Never"}
											</p>
										</div>
										<div className="space-y-2">
											<p className="text-sm font-medium text-muted-foreground">
												Signature Status
											</p>
											<p className="text-sm">
												{user.enrollment.signature_url ? (
													<Badge variant="default" className="px-4 py-0.5">
														Signed
													</Badge>
												) : (
													<Badge variant="secondary">
														Not Signed
													</Badge>
												)}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</>
					) : (
						<Card className="rounded-md shadow-xs">
							<CardContent className="py-12 text-center">
								<p className="text-muted-foreground">User is not enrolled in the course</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				{/* Payments Tab */}
				<TabsContent value="payments" className="space-y-6">
					{user.payment_history.length > 0 ? (
						<>
							<div className="grid gap-4 md:grid-cols-3">
								<Card className="rounded-md shadow-xs">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Total Payments</CardTitle>
										<DollarSign className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{user.payment_history.length}</div>
									</CardContent>
								</Card>

								<Card className="rounded-md shadow-xs">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Total Amount</CardTitle>
										<DollarSign className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{user.payment_history[0]?.currency}{" "}
											{user.payment_history
												.filter((p) => p.status === "completed")
												.reduce((sum, p) => sum + parseFloat(p.amount), 0)
												.toLocaleString()}
										</div>
									</CardContent>
								</Card>

								<Card className="rounded-md shadow-xs">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Completed</CardTitle>
										<CheckCircle className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{user.payment_history.filter((p) => p.status === "completed").length}
										</div>
									</CardContent>
								</Card>
							</div>

							<Card className="rounded-md shadow-xs">
								<CardHeader>
									<CardTitle>Payment History</CardTitle>
									<CardDescription>All payment transactions</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{user.payment_history.map((payment) => (
											<div
												key={payment.id}
												className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
											>
												<div className="space-y-1">
													<div className="flex items-center gap-2">
														<Badge
															variant={
																payment.status === "completed"
																	? "default"
																	: payment.status === "pending"
																		? "secondary"
																		: "destructive"
															}
														>
															{payment.status}
														</Badge>
														{payment.payment_method && (
															<span className="text-sm text-muted-foreground capitalize">
																{payment.payment_method}
															</span>
														)}
													</div>
													<p className="text-sm text-muted-foreground">
														{formatDateTime(payment.created_at)}
													</p>
													{payment.ipay_transaction_id && (
														<p className="text-xs text-muted-foreground">
															Transaction ID: {payment.ipay_transaction_id}
														</p>
													)}
												</div>
												<div className="text-right">
													<p className="text-lg font-medium">
														{payment.currency} {parseFloat(payment.amount).toLocaleString()}
													</p>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</>
					) : (
						<Card className="rounded-md shadow-xs">
							<CardContent className="py-12 text-center">
								<p className="text-muted-foreground">No payment history available</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}

function UserDetailSkeleton() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			<Skeleton className="h-10 w-32" />
			<Card className="rounded-sm shadow-none">
				<CardContent className="pt-6">
					<div className="flex gap-6">
						<Skeleton className="h-24 w-24 rounded-full" />
						<div className="flex-1 space-y-4">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-32" />
							<div className="grid gap-3 md:grid-cols-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
