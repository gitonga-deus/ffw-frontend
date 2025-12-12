"use client";

import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ButtonGroup } from "@/components/ui/button-group";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { PDFViewer } from "@/components/course/PDFViewer";
import { RichTextRenderer } from "@/components/course/RichTextRenderer";
import { RichTextViewer } from "@/components/course/RichTextViewer";
import { ExerciseViewer } from "@/components/course/ExerciseViewer";
import { ProgressBar } from "@/components/course/ProgressBar";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Circle, Hourglass, InfoIcon, Lock, TableOfContents } from "lucide-react";
import { Content, Module, RichTextContent } from "@/types";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useProgress } from "@/hooks/useProgress";

export default function ModuleContentPage() {
	const params = useParams();
	const moduleId = params.moduleId as string;
	const { user } = useAuth();
	const router = useRouter();
	const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
	const [exerciseResponses, setExerciseResponses] = useState<Record<string, Record<string, string>>>({});
	const hasAutoSelectedRef = useRef(false);

	
	// Use the new progress hook
	const {
		overallProgress,
		moduleProgress,
		isContentCompleted,
		updateProgressAsync,
		isUpdating,
	} = useProgress({ moduleId });



	// Fetch all modules for navigation
	const { data: allModules } = useQuery<Module[]>({
		queryKey: ["course-modules"],
		queryFn: async () => {
			const response = await api.get("/course/modules");
			return response.data;
		},
		enabled: !!user?.is_enrolled,
	});

	// Fetch module details
	const { data: module } = useQuery<Module>({
		queryKey: ["module", moduleId],
		queryFn: async () => {
			const response = await api.get(`/modules/${moduleId}`);
			return response.data;
		},
		enabled: !!user?.is_enrolled,
	});

	// Fetch module content
	const { data: contents, isLoading: contentsLoading } = useQuery<Content[]>({
		queryKey: ["module-content", moduleId],
		queryFn: async () => {
			const response = await api.get(`/modules/${moduleId}/content`);
			return response.data;
		},
		enabled: !!user?.is_enrolled,
		staleTime: 5 * 60 * 1000, // 5 minutes - don't refetch
		gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
		refetchOnWindowFocus: false, // Don't refetch on focus
		refetchOnMount: false, // Don't refetch on remount
	});

	// Check if current module is accessible
	const isModuleAccessible = (): boolean => {
		if (!allModules || !module) return false;

		const moduleIndex = allModules.findIndex(m => m.id === moduleId);
		if (moduleIndex === -1) return false;

		// First module is always accessible
		if (moduleIndex === 0) return true;

		// Check if previous module is completed
		const previousModule = allModules[moduleIndex - 1];
		return (previousModule as any).progress_percentage === 100;
	};

	// Simplified content accessibility check
	const checkContentAccessible = (contentId: string): boolean => {
		if (!contents) return false;

		// Already completed content is always accessible (for review)
		if (isContentCompleted(contentId)) return true;

		// Find the content in the list
		const contentIndex = contents.findIndex((c) => c.id === contentId);
		if (contentIndex === -1) return false;

		// First content is always accessible
		if (contentIndex === 0) return true;

		// Check if previous content is completed
		const previousContent = contents[contentIndex - 1];
		return isContentCompleted(previousContent.id);
	};

	// Redirect if not enrolled
	useEffect(() => {
		if (user && !user.is_enrolled) {
			router.push("/students/dashboard");
		}
	}, [user, router]);

	// Redirect if module is locked
	useEffect(() => {
		if (allModules && module && !isModuleAccessible()) {
			toast.error("Complete the previous module to unlock this one");
			router.push("/students/course");
		}
	}, [allModules, module]);

	// Track module access for "resume where you left off"
	useEffect(() => {
		if (moduleId && user?.is_enrolled) {
			// Import the tracking function
			import('@/lib/api/progress').then(({ trackModuleAccess }) => {
				trackModuleAccess(moduleId);
			});
		}
	}, [moduleId, user]);







	// Submit exercise mutation
	const submitExerciseMutation = useMutation({
		mutationFn: async ({
			contentId,
			exerciseId,
			responseData,
		}: {
			contentId: string;
			exerciseId: string;
			responseData: Record<string, string>;
		}) => {
			const response = await api.post("/progress/exercise", {
				content_id: contentId,
				exercise_id: exerciseId,
				response_data: responseData,
			});
			return response.data;
		},
		onSuccess: () => {
			toast.success("Exercise submitted successfully!");
		},
		onError: () => {
			toast.error("Failed to submit exercise");
		},
	});



	// Auto-select content on initial load
	// Priority: last accessed content > first incomplete > first content
	useEffect(() => {
		// Only run once when contents first load
		if (contents && contents.length > 0 && !selectedContentId && !hasAutoSelectedRef.current) {
			hasAutoSelectedRef.current = true;
			
			let contentToSelect = null;
			
			// 1. Check if there's a last accessed content in this module
			if (overallProgress?.last_accessed_content?.module_id === moduleId) {
				const lastAccessedContent = contents.find(
					c => c.id === overallProgress.last_accessed_content?.id
				);
				if (lastAccessedContent) {
					contentToSelect = lastAccessedContent;
				}
			}
			
			// 2. If no last accessed, find first incomplete accessible content
			if (!contentToSelect) {
				contentToSelect = contents.find(
					c => !isContentCompleted(c.id)
				);
			}
			
			// 3. Fallback to first content
			if (!contentToSelect) {
				contentToSelect = contents[0];
			}
			
			setSelectedContentId(contentToSelect.id);
		}
	}, [contents]); // Only depend on contents loading
	
	// Reset the auto-select flag when module changes
	useEffect(() => {
		hasAutoSelectedRef.current = false;
		setSelectedContentId(null);
	}, [moduleId]);

	const selectedContent = contents?.find((c) => c.id === selectedContentId);
	
	// Debug logging
	useEffect(() => {
		if (selectedContentId && !selectedContent && contents) {
			console.error('Content not found!', {
				selectedContentId,
				availableIds: contents.map(c => c.id),
				contentsLength: contents.length,
				contentsLoading
			});
		}
	}, [selectedContentId, selectedContent, contents, contentsLoading]);

	// Get current content index and navigation info
	const currentIndex = contents?.findIndex((c) => c.id === selectedContentId) ?? -1;
	const hasPrevious = currentIndex > 0;
	const hasNext = currentIndex >= 0 && currentIndex < (contents?.length ?? 0) - 1;
	const previousContent = hasPrevious ? contents?.[currentIndex - 1] : null;
	const nextContent = hasNext ? contents?.[currentIndex + 1] : null;

	// Module navigation logic
	const currentModuleIndex = allModules?.findIndex((m) => m.id === moduleId) ?? -1;
	const hasPreviousModule = currentModuleIndex > 0;
	const hasNextModule = currentModuleIndex >= 0 && currentModuleIndex < (allModules?.length ?? 0) - 1;
	const previousModule = hasPreviousModule ? allModules?.[currentModuleIndex - 1] : null;
	const nextModule = hasNextModule ? allModules?.[currentModuleIndex + 1] : null;

	// Check if current module is completed (all content completed)
	const isCurrentModuleCompleted = contents && moduleProgress
		? contents.every(content => isContentCompleted(content.id))
		: false;

	// Can only navigate to next module if current module is completed
	const canNavigateToNextModule = hasNextModule && isCurrentModuleCompleted;



	const handleComplete = async (contentId: string) => {
		// Prevent duplicate calls
		if (isUpdating || isContentCompleted(contentId)) return;

		try {
			// Check if course was already complete before this action
			const wasAlreadyComplete = overallProgress?.progress_percentage === 100;

			// 1. Mark as complete (optimistic update)
			await updateProgressAsync({
				contentId,
				data: { is_completed: true, time_spent: 0 },
			});

			// 2. Wait for caches to update
			await new Promise(resolve => setTimeout(resolve, 100));

			// 3. Check if course is now complete
			const isCourseComplete = overallProgress?.completed_content === overallProgress?.total_content;

			// 4. Navigate to next content or certificate
			if (nextContent) {
				toast.success("Moving to next content...");
				setTimeout(() => {
					setSelectedContentId(nextContent.id);
				}, 1000);
			} else if (isCourseComplete && !wasAlreadyComplete) {
				// Course just completed - show congratulations and navigate to certificate
				toast.success("🎉 Congratulations! You've completed the course!");
				setTimeout(() => {
					router.push("/students/certificate");
				}, 2000);
			}
		} catch (error) {
			// Error handling done by useProgress hook
			console.error("Failed to complete content:", error);
		}
	};

	const handleNavigate = (direction: "previous" | "next") => {
		if (direction === "previous" && previousContent) {
			// Previous content is always accessible
			setSelectedContentId(previousContent.id);
		} else if (direction === "next" && nextContent) {
			// Check if next content is accessible
			const isAccessible = checkContentAccessible(nextContent.id);
			
			if (isAccessible) {
				setSelectedContentId(nextContent.id);
			} else {
				toast.error("Complete previous content first");
			}
		}
	};

	// Keyboard navigation for content
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			// Only handle if not typing in an input/textarea
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
				return;
			}

			// Content navigation (Arrow keys)
			if (e.key === "ArrowLeft" && hasPrevious) {
				handleNavigate("previous");
			} else if (e.key === "ArrowRight" && hasNext) {
				handleNavigate("next");
			}

			// Module navigation (Ctrl/Cmd + Arrow keys)
			if ((e.ctrlKey || e.metaKey) && e.key === "ArrowLeft" && hasPreviousModule && previousModule) {
				e.preventDefault();
				router.push(`/students/course/${previousModule.id}`);
			} else if ((e.ctrlKey || e.metaKey) && e.key === "ArrowRight" && hasNextModule && nextModule) {
				e.preventDefault();
				router.push(`/students/course/${nextModule.id}`);
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [hasPrevious, hasNext, previousContent, nextContent, hasPreviousModule, hasNextModule, previousModule, nextModule, router]);

	const handleExerciseSubmit = (exerciseId: string, responses: Record<string, string>) => {
		if (selectedContentId) {
			setExerciseResponses((prev) => ({
				...prev,
				[exerciseId]: responses,
			}));
			submitExerciseMutation.mutate({
				contentId: selectedContentId,
				exerciseId,
				responseData: responses,
			});
		}
	};

	if (!user) {
		return null;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto space-y-6">
				{/* Module Navigation Header */}
				<div className="flex items-center justify-between gap-4">
					<Button asChild variant="outline" className="rounded-sm h-10 px-4!">
						<Link href="/students/course">
							<ArrowLeft className="h-4 w-4 mr-2" />
							All Modules
						</Link>
					</Button>

					<ButtonGroup>
						<Button
							asChild
							variant="outline"
							disabled={!hasPreviousModule}
							className="h-10 px-4! rounded-sm"
						>
							{hasPreviousModule ? (
								<Link href={`/students/course/${previousModule?.id}`}>
									<ChevronLeft className="h-4 w-4 mr-1" />
									Previous
								</Link>
							) : (
								<span className="cursor-not-allowed">
									<ChevronLeft className="h-4 w-4 mr-1" />
									Previous
								</span>
							)}
						</Button>

						<Button
							asChild={canNavigateToNextModule}
							variant="outline"
							disabled={!canNavigateToNextModule}
							className="h-10 px-4! rounded-sm"
							onClick={() => {
								if (!isCurrentModuleCompleted && hasNextModule) {
									toast.error("Complete all content in this module to unlock the next module");
								}
							}}
							title={!isCurrentModuleCompleted && hasNextModule ? "Complete all content to unlock" : ""}
						>
							{canNavigateToNextModule ? (
								<Link href={`/students/course/${nextModule?.id}`}>
									Next
									<ChevronRight className="h-4 w-4 ml-1" />
								</Link>
							) : hasNextModule && !isCurrentModuleCompleted ? (
								<span className="cursor-not-allowed flex items-center">
									Next
									<ChevronRight className="h-4 w-4 ml-1" />
								</span>
							) : (
								<span className="cursor-not-allowed flex items-center">
									Next
									<ChevronRight className="h-4 w-4 ml-1" />
								</span>
							)}
						</Button>
					</ButtonGroup>
				</div>

				{/* Module Title */}
				<div>
					<h1 className="text-3xl font-bold">{module?.title || "Module"}</h1>
					{module?.description && (
						<p className="text-muted-foreground mt-2">{module.description}</p>
					)}
				</div>

				{/* Module Progress */}
				{contents && moduleProgress && (
					<div className="space-y-2">
						<ProgressBar
							progressPercentage={
								Math.round(
									(moduleProgress.filter((p) => p.is_completed).length / contents.length) * 100
								) || 0
							}
							completedModules={moduleProgress.filter((p) => p.is_completed).length}
							totalModules={contents.length}
							showDetails={false}
						/>
						<div className="px-2 mt-4">
							{isCurrentModuleCompleted && hasNextModule && (
								<p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4" />
									Module completed! You can now proceed to the next module.
								</p>
							)}
							{!isCurrentModuleCompleted && hasNextModule && (
								<p className="text-sm text-muted-foreground flex items-center gap-2">
									<InfoIcon className="h-4 w-4" />
									Complete all content to unlock the next module.
								</p>
							)}
						</div>
					</div>
				)}


				<div className="">
					{/* Content Display Area */}
					<div className="">
						{contentsLoading ? (
							<Card className="rounded-md shadow-xs">
								<CardContent className="text-center py-12">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
									<p className="text-muted-foreground">Loading content...</p>
								</CardContent>
							</Card>
						) : selectedContent ? (
							!checkContentAccessible(selectedContent.id) ? (
								<Card className="rounded-md shadow-xs border-yellow-500/50">
									<CardHeader>
										<div className="flex items-start gap-3">
											<Lock className="h-6 w-6 text-yellow-500 mt-1" />
											<div className="flex-1">
												<CardTitle>Content Locked</CardTitle>
												<p className="text-sm text-muted-foreground mt-2">
													Complete previous content first to unlock this item.
												</p>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<Button
											onClick={() => {
												// Find and select the first incomplete accessible content
												const firstIncomplete = contents?.find(c => !isContentCompleted(c.id) && checkContentAccessible(c.id));
												if (firstIncomplete) {
													setSelectedContentId(firstIncomplete.id);
												}
											}}
											variant="outline"
											className="rounded-md"
										>
											Go to Next Available Content
										</Button>
									</CardContent>
								</Card>
							) : (
								<Card key={selectedContent.id} className="rounded-md shadow-xs">
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<CardTitle>{selectedContent.title}</CardTitle>
												<Badge variant="secondary" className="mt-2 capitalize px-3 py-0.5">
													{selectedContent.content_type === "exercise" 
														? "Exercise" 
														: selectedContent.content_type.replace("_", " ")}
												</Badge>
											</div>
										</div>
									</CardHeader>
									<Separator />
									<CardContent className="space-y-4 pt-6">
										{selectedContent.content_type === "video" && (
											<VideoPlayer 
												key={selectedContent.id} 
												content={selectedContent} 
											/>
										)}

										{selectedContent.content_type === "pdf" && (
											<PDFViewer 
												key={selectedContent.id} 
												content={selectedContent} 
											/>
										)}

										{selectedContent.content_type === "rich_text" && (
											<>
												{selectedContent.rich_text_content ? (
													typeof selectedContent.rich_text_content === 'string' ? (
														<RichTextViewer htmlContent={selectedContent.rich_text_content} />
													) : typeof selectedContent.rich_text_content === 'object' && 'content' in selectedContent.rich_text_content && selectedContent.rich_text_content.content ? (
														<RichTextViewer htmlContent={selectedContent.rich_text_content.content} />
													) : typeof selectedContent.rich_text_content === 'object' && 'blocks' in selectedContent.rich_text_content ? (
														<RichTextRenderer
															content={selectedContent.rich_text_content as RichTextContent}
															onExerciseSubmit={handleExerciseSubmit}
															exerciseResponses={exerciseResponses}
														/>
													) : (
														<div className="bg-muted rounded-lg p-8 text-center">
															<p className="text-muted-foreground">Invalid content format</p>
														</div>
													)
												) : (
													<div className="bg-muted rounded-lg p-8 text-center">
														<p className="text-muted-foreground">No content available</p>
													</div>
												)}
											</>
										)}

										{selectedContent.content_type === "exercise" &&
											selectedContent.exercise && (
												<ExerciseViewer
													exerciseId={selectedContent.exercise.id}
													embedCode={selectedContent.exercise.embed_code}
													formTitle={selectedContent.exercise.form_title}
													isCompleted={isContentCompleted(selectedContent.id)}
												/>
											)}

										<div className="flex justify-between items-center mt-4">
											{/* Mark as Complete Button */}
											{!isContentCompleted(selectedContent.id) ? (
												<Button
													onClick={() => handleComplete(selectedContent.id)}
													disabled={isUpdating}
													className="rounded-sm bg-[#049ad1] hover:bg-[#049ad1]/90 h-10 px-4!"
												>
													{isUpdating ? (
														<>
															<Hourglass className="w-4 h-4 mr-2 animate-spin" />
															Saving...
														</>
													) : (
														"Mark as Complete"
													)}
												</Button>
											) : (
												<div className="flex items-center justify-center gap-2 py-2 text-green-600 dark:text-green-400 font-medium">
													<CheckCircle2 className="h-5 w-5" />
													<span>Completed</span>
												</div>
											)}

											{/* Content Navigation Header */}
											{selectedContent && (
												<ButtonGroup>
													<Button
														onClick={() => handleNavigate("previous")}
														disabled={!hasPrevious}
														variant="outline"
														className="px-4! h-10 rounded-sm"
													>
														<ChevronLeft className="h-4 w-4 mr-1" />
														Previous
													</Button>

													<Button
														onClick={() => handleNavigate("next")}
														disabled={!hasNext}
														variant="outline"
														className="px-4! h-10 rounded-sm"
													>
														Next
														<ChevronRight className="h-4 w-4 ml-1" />
													</Button>
												</ButtonGroup>
											)}
										</div>
									</CardContent>
								</Card>
							)
						) : selectedContentId && contents && contents.length > 0 ? (
							<Card className="rounded-sm shadow-xs border-destructive">
								<CardContent className="text-center py-12">
									<p className="text-destructive font-medium mb-2">Content not found</p>
									<p className="text-sm text-muted-foreground mb-4">
										The selected content (ID: {selectedContentId}) is not available.
									</p>
									<Button 
										onClick={() => {
											const firstContent = contents[0];
											if (firstContent) {
												setSelectedContentId(firstContent.id);
											}
										}}
										variant="outline"
									>
										Go to First Content
									</Button>
								</CardContent>
							</Card>
						) : (
							<Card className="rounded-sm shadow-xs">
								<CardContent className="text-center py-12">
									<p className="text-muted-foreground">Select a content item to begin</p>
								</CardContent>
							</Card>
						)}
					</div>

					<div className="mt-10 max-w-5xl mx-auto">
						<Card className="rounded-sm shadow-none border-0">
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-4">
									<TableOfContents className="w-5 h-5" />
									Table of Content
								</CardTitle>
							</CardHeader>
							<CardContent className="p-0">
								{contentsLoading ? (
									<div className="p-4 text-center">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
									</div>
								) : contents && contents.length > 0 ? (
									<div className="space-y-1">
										{contents.map((content) => {
											const isCompleted = isContentCompleted(content.id);
											const isAccessible = checkContentAccessible(content.id);
											const isLocked = !isAccessible;

											return (
												<button
													key={content.id}
													onClick={() => {
														if (isAccessible) {
															setSelectedContentId(content.id);
														} else {
															toast.error("Complete previous content first");
														}
													}}
													disabled={isLocked}
													className={`w-full text-left px-4 py-3 rounded-md transition-colors ${selectedContentId === content.id ? "bg-muted" : ""
														} ${isLocked
															? "opacity-50 cursor-not-allowed"
															: "hover:bg-muted cursor-pointer"
														}`}
												>
													<div className="flex items-start gap-3">
														<div className="mt-1">
															{isCompleted ? (
																<CheckCircle2 className="h-5 w-5 text-green-500" />
															) : isLocked ? (
																<Lock className="h-5 w-5 text-yellow-500" />
															) : (
																<Circle className="h-5 w-5 text-muted-foreground" />
															)}
														</div>
														<div className="flex-1 min-w-0">
															<div className="text-sm font-medium truncate flex items-center gap-2">
																{content.title}
																{isLocked && (
																	<Badge variant="outline" className="text-xs text-yellow-600 border-yellow-500">
																		Locked
																	</Badge>
																)}
															</div>
															<div className="text-xs text-muted-foreground capitalize">
																{content.content_type.replace("_", " ")}
															</div>
														</div>
													</div>
												</button>
											);
										})}
									</div>
								) : (
									<div className="p-4 text-center text-muted-foreground text-sm">
										No content available
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
