"use client";

import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useProgress } from "@/hooks/useProgress";

import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/course/ProgressBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotebookPen, Lock } from "lucide-react";
import { Module } from "@/types";

interface ModuleWithProgress extends Module {
	content_count: number;
	completed_count: number;
	progress_percentage: number;
}

export default function CoursePage() {
	const { user } = useAuth();
	const router = useRouter();

	// Use new progress hook - only enabled for enrolled users
	const { overallProgress, isLoadingOverall } = useProgress({ 
		enabled: user?.is_enrolled ?? false 
	});

	// Check enrollment status including signature - ALWAYS call this hook
	const { data: enrollmentStatus, isLoading: enrollmentLoading } = useQuery({
		queryKey: ["enrollment-status"],
		queryFn: async () => {
			const response = await api.get("/enrollment/status");
			return response.data;
		},
		enabled: !!user?.is_enrolled,
	});

	// Fetch all modules - ALWAYS call this hook
	const { data: modules, isLoading: modulesLoading } = useQuery<ModuleWithProgress[]>({
		queryKey: ["course-modules"],
		queryFn: async () => {
			const response = await api.get("/course/modules");
			return response.data;
		},
		enabled: !!user?.is_enrolled && !!enrollmentStatus?.has_signature,
		refetchInterval: 30000,
		refetchOnWindowFocus: true
	});

	// Redirect if not enrolled - ALWAYS call this effect
	React.useEffect(() => {
		if (user && !user.is_enrolled) {
			router.push("/students/dashboard");
		}
	}, [user, router]);

	// Redirect to signature page if signature not completed - ALWAYS call this effect
	React.useEffect(() => {
		if (user?.is_enrolled && enrollmentStatus && !enrollmentStatus.has_signature) {
			router.push("/students/signature");
		}
	}, [user, enrollmentStatus, router]);

	// Show nothing while checking enrollment, signature, or redirecting
	if (!user || !user.is_enrolled || enrollmentLoading || !enrollmentStatus?.has_signature) {
		return null;
	}

	// Merge module data with progress data from new system
	// Computed inline after early return (not a hook, so it's safe here)
	const modulesWithProgress = !modules || !overallProgress 
		? modules 
		: modules.map(module => {
				const progressData = overallProgress.modules.find(m => m.module_id === module.id);
				if (progressData) {
					return {
						...module,
						completed_count: progressData.completed_content,
						content_count: progressData.total_content,
						progress_percentage: Math.round(progressData.progress_percentage),
					};
				}
				return module;
			});

	return (
		<div className="py-8">
			<div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto space-y-8">
				{/* Header */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">Course Content</h1>
							<p className="text-muted-foreground mt-2">
								Complete all modules to earn your certificate
							</p>
						</div>
					</div>

					{/* Overall Progress Bar */}
					{overallProgress && (
						<ProgressBar
							progressPercentage={overallProgress.progress_percentage}
							completedModules={overallProgress.completed_modules}
							totalModules={overallProgress.total_modules}
							showDetails={true}
						/>
					)}
				</div>

				{/* Modules List */}
				<div className="space-y-4">
					{modulesLoading || isLoadingOverall ? (
						<div className="text-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
							<p className="text-muted-foreground">Loading modules...</p>
						</div>
					) : modulesWithProgress && modulesWithProgress.length > 0 ? (
						modulesWithProgress.map((module, index) => {
							// Get progress data from new system
							const moduleProgress = overallProgress?.modules.find(m => m.module_id === module.id);
							// Check if module is accessible using new progress system
							const isAccessible = moduleProgress?.is_accessible ?? (index === 0 || (modulesWithProgress[index - 1]?.progress_percentage === 100));

							return (
								<Card key={module.id} className={`hover:shadow-sm transition-shadow shadow-xs rounded-sm ${!isAccessible ? 'opacity-60' : ''}`}>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="flex items-start gap-4 flex-1">
												<div className={`flex items-center justify-center w-12 h-12 rounded-full ${isAccessible ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'} font-bold`}>
													{!isAccessible ? <Lock className="h-5 w-5" /> : index + 1}
												</div>
												<div className="flex-1">
													<div className="flex items-center gap-2">
														<CardTitle className="text-xl mb-2">{module.title}</CardTitle>
														{/* {!isAccessible && (
															<Lock className="h-4 w-4 text-muted-foreground" />
														)} */}
													</div>
													{module.description && (
														<CardDescription className="text-base">
															{module.description}
														</CardDescription>
													)}
													{!isAccessible && (
														<p className="text-sm text-orange-600 mt-2">
															Complete the previous module to unlock this one
														</p>
													)}
													<div className="space-y-4 my-4">
														{/* Module Progress */}
														<div className="space-y-2">
															<div className="flex justify-between text-sm">
																<span className="text-muted-foreground">
																	{module.completed_count} of {module.content_count} items completed
																</span>
																<span className="font-medium">{module.progress_percentage}%</span>
															</div>
															<Progress value={module.progress_percentage} className="h-2" />
														</div>

														{/* Action Button */}
														{isAccessible ? (
															<Button asChild className="w-full sm:w-auto px-6! rounded-sm h-10" variant={"outline"}>
																<Link href={`/students/course/${module.id}`}>
																	<NotebookPen className="mr-2 h-4 w-4" />
																	{module.progress_percentage === 0
																		? "Start Module"
																		: module.progress_percentage === 100
																			? "Review Module"
																			: "Continue Module"}
																</Link>
															</Button>
														) : (
															<Button disabled className="w-full sm:w-auto px-4.5! h-10" variant={"outline"}>
																<Lock className="mr-2 h-4 w-4" />
																Locked
															</Button>
														)}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2">
												{!isAccessible ? (
													<Badge variant="destructive" className="gap-1 px-3 py-1 border-muted-foreground/50">
														Locked
													</Badge>
												) : module.progress_percentage === 100 ? (
													<Badge variant="default" className="gap-1 py-1 px-3 bg-[#049ad1] text-white">
														Completed
													</Badge>
												) : module.progress_percentage > 0 ? (
													<Badge variant="secondary" className="gap-1 py-1">
														In Progress
													</Badge>
												) : (
													<Badge variant="outline" className="gap-1 py-1 px-3">
														Not Started
													</Badge>
												)}
											</div>
										</div>
									</CardHeader>
								</Card>
							);
						})
					) : (
						<Card className="shadow-xs">
							<CardContent className="text-center py-12">
								<NotebookPen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
								<p className="text-muted-foreground">No modules available yet</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
