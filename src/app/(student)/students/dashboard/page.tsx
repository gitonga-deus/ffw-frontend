"use client";

import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PaymentButton } from "@/components/payment/PaymentButton";
import { InlineError } from "@/components/error-display";
import { DashboardSkeleton } from "@/components/loading-skeletons/DashboardSkeleton";

import Link from "next/link";
import {
	CheckCircle2,
	Award,
	AlertCircle,
	Megaphone,
	PlayCircle,
	NotebookPen,
	Scroll,
} from "lucide-react";
import { EnrollmentStatusResponse, ProgressOverview, Announcement } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function StudentDashboard() {
	const { user } = useAuth();

	// Fetch enrollment status
	const {
		data: enrollmentStatus,
		isLoading: enrollmentLoading,
		isError: enrollmentError,
		refetch: refetchEnrollment
	} = useQuery<EnrollmentStatusResponse>({
		queryKey: ["enrollment"],
		queryFn: async () => {
			const response = await api.get("/enrollment/status");
			return response.data;
		},
		enabled: !!user?.is_enrolled,
		refetchInterval: 30000, // Refetch every 30 seconds
		refetchOnWindowFocus: true, // Refetch when user returns to tab
	});

	// Fetch progress overview
	const {
		data: progress,
		isLoading: progressLoading,
		isError: progressError,
		refetch: refetchProgress
	} = useQuery<ProgressOverview>({
		queryKey: ["progress"],
		queryFn: async () => {
			const response = await api.get("/progress");
			return response.data;
		},
		enabled: !!user?.is_enrolled,
		refetchInterval: 30000, // Refetch every 30 seconds
		refetchOnWindowFocus: true, // Refetch when user returns to tab
	});

	// Fetch announcements
	const {
		data: announcementsData,
		isLoading: announcementsLoading,
		isError: announcementsError,
		refetch: refetchAnnouncements
	} = useQuery<{ announcements: Announcement[]; total: number }>({
		queryKey: ["announcements"],
		queryFn: async () => {
			const response = await api.get("/announcements");
			return response.data;
		},
	});

	const announcements = announcementsData?.announcements || [];

	// Show loading skeleton while initial data is loading
	if (!user || (user.is_enrolled && (enrollmentLoading || progressLoading || announcementsLoading))) {
		return <DashboardSkeleton />;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
				{/* Welcome Section */}
				<div>
					<h1 className="text-3xl font-bold">
						Welcome back, {user.full_name.split("")}!
					</h1>
					<p className="text-muted-foreground mt-2">
						{user.is_enrolled
							? "Continue your learning journey"
							: "Ready to start your learning journey?"}
					</p>
				</div>

				{/* Status Banners - Show action items or celebration */}
				{!user.is_enrolled ? (
					<Card className="shadow-xs border-orange-200 bg-orange-50">
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-12 h-12 mb-2">
									<AlertCircle className="h-6 w-6 text-orange-600" />
								</div>
								<div>
									<CardTitle className="text-orange-900 mb-1">Ready to Start Learning?</CardTitle>
									<CardDescription className="text-orange-700">
										Enroll now to unlock all course materials and begin your journey
									</CardDescription>
								</div>
							</div>
						</CardHeader>
					</Card>
				) : !enrollmentStatus?.has_signature ? (
					<Card className="rounded-sm shadow-xs border-blue-200 bg-blue-50">
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-12 h-12 mb-2">
									<AlertCircle className="h-6 w-6 text-blue-600" />
								</div>
								<div>
									<CardTitle className="text-blue-900 mb-1">One More Step!</CardTitle>
									<CardDescription className="text-blue-700">
										Complete your digital signature to unlock the course content
									</CardDescription>
								</div>
							</div>
						</CardHeader>
					</Card>
				) : enrollmentStatus?.enrollment?.completed_at ? (
					<Card className="shadow-xs border-green-200 bg-green-50">
						<CardHeader>
							<CardTitle className="text-green-900 mb-2">Congratulations!</CardTitle>
							<CardDescription className="text-green-700">
								You&apos;ve successfully completed the course on{" "}
								<span className="font-semibold">

									{new Date(enrollmentStatus.enrollment.completed_at).toLocaleDateString()}
								</span>
							</CardDescription>
						</CardHeader>
					</Card>
				) : enrollmentError || progressError ? (
					<InlineError
						message="Failed to load enrollment data"
						onRetry={() => {
							refetchEnrollment();
							refetchProgress();
						}}
					/>
				) : (
					<div className="grid gap-4 md:grid-cols-2">
						{/* Progress Card */}
						<Card className="shadow-xs">
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Course Progress
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div className="text-2xl font-bold">
										{`${progress?.progress_percentage || 0}%`}
									</div>
									<Progress value={progress?.progress_percentage || 0} className="h-2" />
									<p className="text-xs text-muted-foreground">
										{`${progress?.completed_modules || 0} of ${progress?.total_modules || 0} modules completed`}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Enrollment Date Card */}
						<Card className="shadow-xs">
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Enrolled Since
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-2">
									<div>
										<div className="text-2xl font-bold">
											{enrollmentStatus?.enrollment?.enrolled_at
												? new Date(enrollmentStatus.enrollment.enrolled_at).toLocaleDateString()
												: "N/A"}
										</div>
										<p className="text-xs text-muted-foreground mt-2 pl-1">
											{enrollmentStatus?.enrollment?.enrolled_at
												? formatDistanceToNow(new Date(enrollmentStatus.enrollment.enrolled_at), {
													addSuffix: true,
												})
												: ""}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Last Accessed Card */}
						<Card className="shadow-xs">
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Last Accessed
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-2">
									<div>
										<div className="text-sm font-medium">
											{enrollmentStatus?.enrollment?.last_accessed_at
												? formatDistanceToNow(new Date(enrollmentStatus.enrollment.last_accessed_at), {
													addSuffix: true,
												})
												: "Not started"}
										</div>
										<p className="text-xs text-muted-foreground mt-2">
											{progress?.last_accessed_content?.title || "No content accessed yet"}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Completion Status Card */}
						<Card className="shadow-xs">
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Status
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-2">
									{enrollmentStatus?.enrollment?.completed_at ? (
										<>
											<div>
												<Badge variant="secondary" className="">
													Completed
												</Badge>
												<p className="text-xs text-muted-foreground">
													{new Date(enrollmentStatus.enrollment.completed_at).toLocaleDateString()}
												</p>
											</div>
										</>
									) : (
										<>
											{/* <NotebookPen className="h-5 w-5 text-primary" /> */}
											<div>
												<Badge variant="default" className="mb-2 px-3 bg-[#049ad1]">
													In Progress
												</Badge>
												<p className="text-xs text-muted-foreground pl-1">Keep learning!</p>
											</div>
										</>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Quick Actions */}
				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="font-bold mb-2">Quick Actions</CardTitle>
						<CardDescription>
							{!user.is_enrolled
								? "Get started with your learning journey"
								: !enrollmentStatus?.has_signature
									? "Complete your enrollment process"
									: enrollmentStatus?.enrollment?.completed_at
										? "You've completed the course!"
										: progress?.progress_percentage === 0
											? "Start your learning journey"
											: "Continue your learning journey"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{/* Action Buttons */}
							<div className="flex flex-wrap gap-4">
								{!user.is_enrolled ? (
									<PaymentButton className="h-10 bg-[#049ad1] hover:bg-[#0385b5]" />
								) : !enrollmentStatus?.has_signature ? (
									<Button asChild className="h-10 bg-orange-500 hover:bg-orange-600">
										<Link href="/students/signature">
											<CheckCircle2 className="mr-2 h-4 w-4" />
											Complete Signature
										</Link>
									</Button>
								) : enrollmentStatus?.enrollment?.completed_at ? (
									<>
										<Button asChild className="h-10 bg-green-600 hover:bg-green-700">
											<Link href="/students/certificate">
												<Scroll className="mr-2 h-4 w-4" />
												View Certificate
											</Link>
										</Button>
										<Button asChild variant="outline" className="h-10">
											<Link href="/students/course">
												<NotebookPen className="mr-2 h-4 w-4" />
												Review Course
											</Link>
										</Button>
									</>
								) : (
									<>
										<Button asChild variant="default" className="bg-[#049ad1] hover:bg-[#049ad1]/80 px-4! h-10">
											<Link href="/students/course">
												<NotebookPen className="mr-2 h-4 w-4" />
												{progress?.progress_percentage === 0 ? "Start Learning" : "Continue Learning"}
											</Link>
										</Button>
										{progress && progress.last_accessed_content && (
											<Button asChild variant="secondary" className="px-4! h-10">
												<Link href={`/students/course/${progress.last_accessed_content.module_id}`}>
													<PlayCircle className="mr-2 h-4 w-4" />
													Resume Last Content
												</Link>
											</Button>
										)}
									</>
								)}
							</div>

							{/* Progress Display for Active Learning */}
							{user.is_enrolled &&
								enrollmentStatus?.has_signature &&
								!enrollmentStatus?.enrollment?.completed_at &&
								progress && (
									<div className="pt-4 border-t">
										<div className="flex items-center justify-between text-sm mb-2">
											<span className="text-muted-foreground">Course Progress</span>
											<span className="font-semibold">{progress.progress_percentage}%</span>
										</div>
										<Progress value={progress.progress_percentage} className="h-2" />
										<p className="text-xs text-muted-foreground mt-2">
											{progress.completed_modules} of {progress.total_modules} modules completed
										</p>
									</div>
								)}
						</div>
					</CardContent>
				</Card>

				{/* Announcements Section */}
				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							Announcements
						</CardTitle>
						<CardDescription>Latest updates from your instructor</CardDescription>
					</CardHeader>
					<CardContent>
						{announcementsError ? (
							<InlineError
								message="Failed to load announcements"
								onRetry={() => refetchAnnouncements()}
							/>
						) : announcements && announcements.length > 0 ? (
							<div className="space-y-4">
								{announcements.slice(0, 5).map((announcement, index) => (
									<div key={announcement.id}>
										{index > 0 && <Separator className="my-4" />}
										<div className="space-y-2">
											<div className="flex items-start justify-between">
												<h4 className="font-semibold">{announcement.title}</h4>
												<span className="text-xs text-muted-foreground">
													{formatDistanceToNow(new Date(announcement.created_at), {
														addSuffix: true,
													})}
												</span>
											</div>
											<p className="text-sm text-muted-foreground whitespace-pre-line">
												{announcement.content}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
								<p>No announcements yet</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
