"use client";

import { useState, useEffect } from"react";
import { contentApi } from"@/lib/content-api";
import type { ContentResponse, ContentCreate, ContentUpdate } from"@/types/content";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from"@/components/ui/dialog";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Switch } from"@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from"@/components/ui/tabs";
import { toast } from"sonner";
import { VideoContentForm } from"./video-content-form";
import { PDFContentForm } from"./pdf-content-form";
import { RichTextContentForm } from"./rich-text-content-form";
import { ExerciseContentForm } from"./exercise-content-form";

interface ContentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	content: ContentResponse | null;
	moduleId: string | null;
	onSuccess: () => void;
}

export function ContentDialog({ open, onOpenChange, content, moduleId, onSuccess }: ContentDialogProps) {
	const [loading, setLoading] = useState(false);
	const [contentType, setContentType] = useState<"video" |"pdf" |"rich_text" |"exercise">("video");
	const [formData, setFormData] = useState({
		title:"",
		order_index: 0,
		is_published: false,
		// Video fields
		vimeo_video_id:"",
		video_duration: 0,
		// PDF fields
		pdf_file: null as File | null,
		pdf_filename:"",
		// Rich text fields
		rich_text_content: null as any,
		// Exercise fields
		embed_code:"",
		form_title:"",
		allow_multiple_submissions: false,
		embed_code_valid: false,
	});

	useEffect(() => {
		if (content) {
			setContentType(content.content_type);
			setFormData({
				title: content.title,
				order_index: content.order_index,
				is_published: content.is_published,
				vimeo_video_id: content.vimeo_video_id ||"",
				video_duration: content.video_duration || 0,
				pdf_file: null,
				pdf_filename: content.pdf_filename ||"",
				rich_text_content: content.rich_text_content,
				embed_code: content.exercise?.embed_code ||"",
				form_title: content.exercise?.form_title ||"",
				allow_multiple_submissions: content.exercise?.allow_multiple_submissions || false,
				embed_code_valid: true,
			});
		} else {
			setContentType("video");
			setFormData({
				title:"",
				order_index: 0,
				is_published: false,
				vimeo_video_id:"",
				video_duration: 0,
				pdf_file: null,
				pdf_filename:"",
				rich_text_content: null,
				embed_code:"",
				form_title:"",
				allow_multiple_submissions: false,
				embed_code_valid: false,
			});
		}
	}, [content, open]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!moduleId && !content) return;

		setLoading(true);

		try {
			if (content) {
				// Update existing content
				const updateData: ContentUpdate = {
					title: formData.title,
					order_index: formData.order_index,
					is_published: formData.is_published,
				};

				if (contentType ==="video") {
					updateData.vimeo_video_id = formData.vimeo_video_id;
					updateData.video_duration = formData.video_duration;
				} else if (contentType ==="pdf") {
					updateData.pdf_filename = formData.pdf_filename;
				} else if (contentType ==="rich_text") {
					updateData.rich_text_content = formData.rich_text_content;
				} else if (contentType ==="exercise") {
					updateData.embed_code = formData.embed_code;
					updateData.form_title = formData.form_title;
					updateData.allow_multiple_submissions = formData.allow_multiple_submissions;
				}

				await contentApi.updateContent(content.id, updateData);

				// Handle PDF upload if new file selected
				if (contentType ==="pdf" && formData.pdf_file) {
					await contentApi.uploadPDF(content.id, formData.pdf_file);
				}

				toast.success("Content updated successfully");
			} else {
				// Create new content
				const createData: ContentCreate = {
					module_id: moduleId!,
					content_type: contentType,
					title: formData.title,
					order_index: formData.order_index,
					is_published: formData.is_published,
				};

				if (contentType ==="video") {
					createData.vimeo_video_id = formData.vimeo_video_id;
					createData.video_duration = formData.video_duration;
				} else if (contentType ==="pdf") {
					createData.pdf_filename = formData.pdf_filename;
				} else if (contentType ==="rich_text") {
					createData.rich_text_content = formData.rich_text_content;
				} else if (contentType ==="exercise") {
					createData.exercise_data = {
						embed_code: formData.embed_code,
						form_title: formData.form_title,
						allow_multiple_submissions: formData.allow_multiple_submissions || false
					};
				}

				const newContent = await contentApi.createContent(createData);

				// Handle PDF upload for new content
				if (contentType ==="pdf" && formData.pdf_file) {
					await contentApi.uploadPDF(newContent.id, formData.pdf_file);
				}

				toast.success("Content created successfully");
			}

			onSuccess();
			onOpenChange(false);
		} catch (err: any) {
			console.error(err);
			const errorMessage = err.response?.data?.detail ||"Failed to save content";
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto max-w-4xl! rounded">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{content ?"Edit Content" :"Create Content"}</DialogTitle>
						<DialogDescription>
							{content
								?"Update the content details below."
								:"Create new content for your module."}
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						{/* Basic Fields */}
						<div className="grid gap-2">
							<Label htmlFor="title">Title *</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								placeholder="Content title"
								className="h-10"
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="order_index">Order Index *</Label>
							<Input
								id="order_index"
								type="number"
								min="0"
								value={formData.order_index || 0}
								className="h-10"
								onChange={(e) =>
									setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
								}
								required
							/>
						</div>

						{/* Content Type Tabs */}
						{!content && (
							<div className="grid gap-2">
								<Label>Content Type *</Label>
								<Tabs value={contentType} onValueChange={(v) => setContentType(v as any)}>
									<TabsList className="grid w-full grid-cols-4 h-10 rounded">
										<TabsTrigger value="video" className="rounded">Video</TabsTrigger>
										<TabsTrigger value="pdf" className="rounded">PDF</TabsTrigger>
										<TabsTrigger value="rich_text" className="rounded">Rich Text</TabsTrigger>
										<TabsTrigger value="exercise" className="rounded">Exercise</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>
						)}

						{/* Content Type Specific Forms */}
						{contentType ==="video" && (
							<VideoContentForm formData={formData} setFormData={setFormData} />
						)}

						{contentType ==="pdf" && (
							<PDFContentForm formData={formData} setFormData={setFormData} content={content} />
						)}

						{contentType ==="rich_text" && (
							<RichTextContentForm formData={formData} setFormData={setFormData} />
						)}

						{contentType ==="exercise" && (
							<ExerciseContentForm formData={formData} setFormData={setFormData} />
						)}

						{/* Published Toggle */}
						<div className="flex items-center justify-between">
							<div className="space-y-2">
								<Label htmlFor="is_published">Published</Label>
								<p className="text-xs text-muted-foreground">
									Make this content visible to students
								</p>
							</div>
							<Switch
								id="is_published"
								checked={formData.is_published}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, is_published: checked })
								}
							/>
						</div>
					</div>

					<DialogFooter className="flex! justify-between! items-center!">
						<Button type="button" variant="outline" className="h-10 px-8!" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit" className="h-10 px-8!" disabled={loading}>
							{loading ?"Saving..." : content ?"Update" :"Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
