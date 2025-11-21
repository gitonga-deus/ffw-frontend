"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from"@/components/ui/dialog";
import { Badge } from"@/components/ui/badge";
import { Video, FileText, ExternalLink, Download } from"lucide-react";
import type { ContentResponse } from"@/types/content";
import { Button } from"@/components/ui/button";

interface ContentPreviewDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	content: ContentResponse | null;
}

export function ContentPreviewDialog({ open, onOpenChange, content }: ContentPreviewDialogProps) {
	if (!content) return null;

	const renderContentPreview = () => {
		switch (content.content_type) {
			case"video":
				return (
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Video className="h-5 w-5 text-muted-foreground" />
							<span className="font-medium">Video Content</span>
						</div>
						{content.vimeo_video_id ? (
							<div className="aspect-video w-full overflow-hidden bg-black">
								<iframe
									src={`https://player.vimeo.com/video/${content.vimeo_video_id}?badge=0&autopause=0&player_id=0&app_id=58479`}
									frameBorder="0"
									allow="autoplay; fullscreen; picture-in-picture"
									allowFullScreen
									className="w-full h-full"
									title={content.title}
								></iframe>
							</div>
						) : (
							<div className="aspect-video w-full bg-muted flex items-center justify-center">
								<p className="text-muted-foreground">No video ID provided</p>
							</div>
						)}
						{content.video_duration && (
							<p className="text-sm text-muted-foreground">
								Duration: {Math.floor(content.video_duration / 60)}:
								{(content.video_duration % 60).toString().padStart(2,"0")}
							</p>
						)}
					</div>
				);

			case"pdf":
				return (
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-muted-foreground" />
							<span className="font-medium">PDF Document</span>
						</div>
						{content.pdf_url ? (
							<div className="space-y-4">
								<div className="border p-4 bg-muted/50 rounded-md">
									<p className="text-sm font-medium mb-2">
										{content.pdf_filename ||"Document.pdf"}
									</p>
									<div className="flex gap-2">
										<Button asChild variant="outline">
											<a href={content.pdf_url} target="_blank" rel="noopener noreferrer">
												<ExternalLink className="h-4 w-4 mr-2" />
												Open in New Tab
											</a>
										</Button>
										<Button asChild variant="outline">
											<a href={content.pdf_url} download={content.pdf_filename}>
												<Download className="h-4 w-4 mr-2" />
												Download
											</a>
										</Button>
									</div>
								</div>
								<div className="border overflow-hidden bg-white rounded-md">
									<iframe
										src={content.pdf_url}
										className="w-full h-[500px]"
										title={content.title}
									/>
								</div>
							</div>
						) : (
							<div className="border p-8 bg-muted/50 text-center rounded-md">
								<p className="text-muted-foreground">No PDF uploaded</p>
							</div>
						)}
					</div>
				);

			case"rich_text":
				return (
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-muted-foreground" />
							<span className="font-medium">Rich Text Content</span>
						</div>
						{content.rich_text_content ? (
							<div className="space-y-6">
								{/* Main Content */}
								{content.rich_text_content.content && (
									<div
										className="prose prose-sm max-w-none border p-6 bg-muted/50"
										dangerouslySetInnerHTML={{ __html: content.rich_text_content.content }}
									/>
								)}

								{/* Exercises */}
								{content.rich_text_content.exercises &&
									content.rich_text_content.exercises.length > 0 && (
										<div className="space-y-4">
											<h3 className="font-semibold text-lg">Exercises</h3>
											{content.rich_text_content.exercises.map(
												(exercise: any, index: number) => (
													<div key={index} className="border p-4 bg-background">
														<div className="flex items-start gap-2 mb-3">
															<span className="font-medium text-sm bg-primary text-primary-foreground px-2 py-1">
																{index + 1}
															</span>
															<p className="font-medium flex-1">{exercise.question}</p>
														</div>

														{exercise.type ==="radio" || exercise.type ==="checkbox" ? (
															<div className="space-y-2 ml-8">
																{exercise.options?.map((option: string, optIdx: number) => (
																	<div key={optIdx} className="flex items-center gap-2">
																		<div
																			className={`w-4 h-4 rounded-full border-2 ${
																				exercise.type ==="checkbox"
																					?"rounded"
																					:"rounded-full"
																			}`}
																		/>
																		<span className="text-sm">{option}</span>
																	</div>
																))}
															</div>
														) : (
															<div className="ml-8 text-sm text-muted-foreground">
																Type: {exercise.type}
															</div>
														)}

														{exercise.correctAnswer && (
															<div className="mt-3 ml-8 text-xs text-muted-foreground">
																Correct answer: {exercise.correctAnswer}
															</div>
														)}
													</div>
												)
											)}
										</div>
									)}
							</div>
						) : (
							<div className="border p-8 bg-muted/50 text-center">
								<p className="text-muted-foreground">No content available</p>
							</div>
						)}
					</div>
				);

			default:
				return (
					<div className="text-center py-8 text-muted-foreground">
						<p>Preview not available for this content type</p>
					</div>
				);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl! max-h-[90vh]! overflow-y-auto">
				<DialogHeader>
					<div className="flex items-center justify-between mt-6">
						<DialogTitle>{content.title}</DialogTitle>
						<div className="flex items-center gap-2">
							<Badge variant="outline" className="capitalize px-3">
								{content.content_type}
							</Badge>
							<Badge variant={content.is_published ?"default" :"secondary"} className="px-3 bg-[#049ad1]">
								{content.is_published ?"Published" :"Draft"}
							</Badge>
						</div>
					</div>
				</DialogHeader>
				<div className="mt-4">{renderContentPreview()}</div>
			</DialogContent>
		</Dialog>
	);
}
