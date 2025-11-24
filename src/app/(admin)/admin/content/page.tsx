"use client";

import { useEffect, useState } from "react";
import { contentApi } from "@/lib/content-api";
import type { ModuleResponse, ContentResponse, ModuleWithContent } from "@/types/content";
import { NotebookPen, Video, FileText, Plus, Edit, EyeClosed, GripVertical, Trash2, ClipboardList } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ModuleDialog } from "@/components/admin/content/module-dialog";
import { ContentDialog } from "@/components/admin/content/content-dialog";
import { DeleteDialog } from "@/components/admin/content/delete-dialog";
import { ContentPreviewDialog } from "@/components/admin/content/content-preview-dialog";
import { ExerciseDetailsDialog } from "@/components/admin/content/exercise-details-dialog";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ContentPage() {
	const [modules, setModules] = useState<ModuleWithContent[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

	// Dialog states
	const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
	const [contentDialogOpen, setContentDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
	const [exerciseDetailsDialogOpen, setExerciseDetailsDialogOpen] = useState(false);
	const [editingModule, setEditingModule] = useState<ModuleResponse | null>(null);
	const [editingContent, setEditingContent] = useState<ContentResponse | null>(null);
	const [previewingContent, setPreviewingContent] = useState<ContentResponse | null>(null);
	const [viewingExercise, setViewingExercise] = useState<ContentResponse | null>(null);
	const [selectedModuleForContent, setSelectedModuleForContent] = useState<string | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<{ type: "module" | "content"; id: string; name: string } | null>(null);

	useEffect(() => {
		fetchContent();
	}, []);

	const fetchContent = async () => {
		try {
			setLoading(true);
			// Use optimized endpoint that fetches modules with content in one query
			const modulesWithContent = await contentApi.getModulesWithContentAdmin();
			setModules(modulesWithContent);
			setExpandedModules(new Set(modulesWithContent.map((m) => m.id)));
		} catch (err) {
			setError("Failed to load content");
			console.error(err);
			toast.error("Failed to load content");
		} finally {
			setLoading(false);
		}
	};

	const toggleModule = (moduleId: string) => {
		setExpandedModules((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(moduleId)) {
				newSet.delete(moduleId);
			} else {
				newSet.add(moduleId);
			}
			return newSet;
		});
	};

	const handleCreateModule = () => {
		setEditingModule(null);
		setModuleDialogOpen(true);
	};

	const handleEditModule = (module: ModuleResponse) => {
		setEditingModule(module);
		setModuleDialogOpen(true);
	};

	const handleCreateContent = (moduleId: string) => {
		setSelectedModuleForContent(moduleId);
		setEditingContent(null);
		setContentDialogOpen(true);
	};

	const handleEditContent = (content: ContentResponse) => {
		setSelectedModuleForContent(content.module_id);
		setEditingContent(content);
		setContentDialogOpen(true);
	};

	const handleDeleteModule = (module: ModuleResponse) => {
		setDeleteTarget({ type: "module", id: module.id, name: module.title });
		setDeleteDialogOpen(true);
	};

	const handlePreviewContent = (content: ContentResponse) => {
		// For exercises, show details dialog instead of preview
		if (content.content_type === "exercise") {
			setViewingExercise(content);
			setExerciseDetailsDialogOpen(true);
		} else {
			setPreviewingContent(content);
			setPreviewDialogOpen(true);
		}
	};

	const handleDeleteContent = (content: ContentResponse) => {
		setDeleteTarget({ type: "content", id: content.id, name: content.title });
		setDeleteDialogOpen(true);
	};

	const handleTogglePublish = async (type: "module" | "content", id: string, currentStatus: boolean) => {
		try {
			if (type === "module") {
				await contentApi.updateModule(id, { is_published: !currentStatus });
				toast.success(`Module ${!currentStatus ? "published" : "unpublished"} successfully`);
			} else {
				await contentApi.updateContent(id, { is_published: !currentStatus });
				toast.success(`Content ${!currentStatus ? "published" : "unpublished"} successfully`);
			}
			await fetchContent();
		} catch (err) {
			console.error(err);
			toast.error(`Failed to ${!currentStatus ? "publish" : "unpublish"}`);
		}
	};

	const getContentIcon = (type: string) => {
		switch (type) {
			case "video":
				return <Video className="h-4 w-4" />;
			case "pdf":
				return <FileText className="h-4 w-4" />;
			case "rich_text":
				return <FileText className="h-4 w-4" />;
			case "exercise":
				return <ClipboardList className="h-4 w-4" />;
			default:
				return <NotebookPen className="h-4 w-4" />;
		}
	};

	const formatDuration = (seconds: number | null | undefined) => {
		if (!seconds) return "N/A";
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = async (event: DragEndEvent, moduleId: string) => {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		// Find the module
		const module = modules.find((m) => m.id === moduleId);
		if (!module) return;

		const oldIndex = module.content_items.findIndex((item) => item.id === active.id);
		const newIndex = module.content_items.findIndex((item) => item.id === over.id);

		if (oldIndex === -1 || newIndex === -1) return;

		// Reorder locally first for immediate feedback
		const newContentItems = arrayMove(module.content_items, oldIndex, newIndex);

		// Update local state
		setModules((prevModules) =>
			prevModules.map((m) =>
				m.id === moduleId ? { ...m, content_items: newContentItems } : m
			)
		);

		// Prepare the order data with updated order_index
		const contentOrder = newContentItems.map((item, index) => ({
			id: item.id,
			order_index: index,
		}));

		try {
			// Send to backend
			console.log("Sending reorder request with data:", contentOrder);
			await contentApi.reorderContent(contentOrder);
			toast.success("Content reordered successfully");
		} catch (err: any) {
			console.error("Reorder error:", err);
			console.error("Error response:", err.response?.data);
			const errorMessage = err.response?.data?.detail || err.message || "Failed to reorder content";
			toast.error(errorMessage);
			// Revert on error
			await fetchContent();
		}
	};

	if (loading) {
		return <ContentSkeleton />;
	}

	if (error) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-6">
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-muted-foreground">{error}</p>
				</div>
			</div>
		);
	}

	const stats = {
		totalModules: modules.length,
		publishedModules: modules.filter((m) => m.is_published).length,
		totalContent: modules.reduce((sum, m) => sum + m.content_items.length, 0),
		publishedContent: modules.reduce(
			(sum, m) => sum + m.content_items.filter((c) => c.is_published).length,
			0
		),
		videos: modules.reduce(
			(sum, m) => sum + m.content_items.filter((c) => c.content_type === "video").length,
			0
		),
		pdfs: modules.reduce(
			(sum, m) => sum + m.content_items.filter((c) => c.content_type === "pdf").length,
			0
		),
		richText: modules.reduce(
			(sum, m) => sum + m.content_items.filter((c) => c.content_type === "rich_text").length,
			0
		),
		exercises: modules.reduce(
			(sum, m) => sum + m.content_items.filter((c) => c.content_type === "exercise").length,
			0
		),
	};

	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold mb-2">Content Management</h1>
					<p className="text-muted-foreground">Manage course modules and content</p>
				</div>
				<div className="flex gap-2">
					<Button onClick={handleCreateModule} className="h-10 px-6!">
						<Plus className="h-4 w-4 mr-2" />
						Add Module
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-5">
				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Modules</CardTitle>
						<NotebookPen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalModules}</div>
						<p className="text-xs text-muted-foreground">{stats.publishedModules} published</p>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Content</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalContent}</div>
						<p className="text-xs text-muted-foreground">{stats.publishedContent} published</p>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Videos</CardTitle>
						<Video className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.videos}</div>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Documents</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.pdfs + stats.richText}</div>
						<p className="text-xs text-muted-foreground">
							{stats.pdfs} PDFs, {stats.richText} Rich Text
						</p>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Exercises</CardTitle>
						<ClipboardList className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.exercises}</div>
					</CardContent>
				</Card>
			</div>

			{/* Modules List */}
			<div className="space-y-4">
				{modules.length > 0 ? (
					modules.map((module) => (
						<Card key={module.id} className="rounded-md shadow-xs">
							<CardHeader
								className="cursor-pointer hover:bg-muted/50 transition-colors"
								onClick={() => toggleModule(module.id)}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4 flex-1">
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<CardTitle className="text-lg">
													{module.title}
												</CardTitle>
												<Badge
													variant={module.is_published ? "secondary" : "secondary"}
													className="cursor-pointer"
													onClick={(e) => {
														e.stopPropagation();
														handleTogglePublish("module", module.id, module.is_published);
													}}
												>
													{module.is_published ? (
														<>
															Published
														</>
													) : (
														<>
															Draft
														</>
													)}
												</Badge>
											</div>
											{module.description && (
												<CardDescription className="mt-1">{module.description}</CardDescription>
											)}
										</div>
									</div>
									<div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
										<Badge variant="outline">{module.content_items.length} items</Badge>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleEditModule(module)}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleCreateContent(module.id)}
										>
											<Plus className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleDeleteModule(module)}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								</div>
							</CardHeader>

							{expandedModules.has(module.id) && (
								<CardContent>
									{module.content_items.length > 0 ? (
										<DndContext
											sensors={sensors}
											collisionDetection={closestCenter}
											onDragEnd={(event) => handleDragEnd(event, module.id)}
										>
											<SortableContext
												items={module.content_items.map((item) => item.id)}
												strategy={verticalListSortingStrategy}
											>
												<div className="space-y-2">
													{module.content_items.map((content) => (
														<SortableContentItem
															key={content.id}
															content={content}
															onPreview={handlePreviewContent}
															onEdit={handleEditContent}
															onDelete={handleDeleteContent}
															onTogglePublish={handleTogglePublish}
														/>
													))}
												</div>
											</SortableContext>
										</DndContext>
									) : (
										<div className="text-center py-8 text-muted-foreground">
											<p>No content items yet</p>
											<Button
												variant="outline"
												size="sm"
												className="mt-2 px-4! h-10"
												onClick={() => handleCreateContent(module.id)}
											>
												<Plus className="h-4 w-4 mr-2" />
												Add Content
											</Button>
										</div>
									)}
								</CardContent>
							)}
						</Card>
					))
				) : (
					<Card className="rounded-md shadow-xs">
						<CardContent className="py-12 text-center">
							<p className="text-muted-foreground mb-4">No modules created yet</p>
							<Button onClick={handleCreateModule}>
								<Plus className="h-4 w-4 mr-2" />
								Create First Module
							</Button>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Dialogs */}
			<ModuleDialog
				open={moduleDialogOpen}
				onOpenChange={setModuleDialogOpen}
				module={editingModule}
				onSuccess={fetchContent}
			/>

			<ContentDialog
				open={contentDialogOpen}
				onOpenChange={setContentDialogOpen}
				content={editingContent}
				moduleId={selectedModuleForContent}
				onSuccess={fetchContent}
			/>

			<DeleteDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				target={deleteTarget}
				onSuccess={fetchContent}
			/>

			<ContentPreviewDialog
				open={previewDialogOpen}
				onOpenChange={setPreviewDialogOpen}
				content={previewingContent}
			/>

			<ExerciseDetailsDialog
				open={exerciseDetailsDialogOpen}
				onOpenChange={setExerciseDetailsDialogOpen}
				content={viewingExercise}
			/>
		</div>
	);
}

interface SortableContentItemProps {
	content: ContentResponse;
	onPreview: (content: ContentResponse) => void;
	onEdit: (content: ContentResponse) => void;
	onDelete: (content: ContentResponse) => void;
	onTogglePublish: (type: "content", id: string, currentStatus: boolean) => void;
}

function SortableContentItem({
	content,
	onPreview,
	onEdit,
	onDelete,
	onTogglePublish,
}: SortableContentItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: content.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex items-center justify-between p-3 mt-4 border hover:bg-muted/50 transition-colors"
		>
			<div className="flex items-center gap-2 flex-1">
				<div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
					<GripVertical className="h-4 w-4 text-muted-foreground" />
				</div>
				<div className="flex items-center gap-2">
					<span className="font-medium">{content.title}</span>
				</div>
				<Badge variant="secondary" className="lowercase text-xs">
					{content.content_type}
				</Badge>
				<Badge
					variant={content.is_published ? "default" : "secondary"}
					className="text-xs cursor-pointer lowercase bg-[#049ad1]"
					onClick={() => onTogglePublish("content", content.id, content.is_published)}
				>
					{content.is_published ? <>Published</> : <>Draft</>}
				</Badge>
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => onPreview(content)}
					title={content.content_type === "exercise" ? "View Details" : "Preview"}
				>
					<EyeClosed className="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="sm" onClick={() => onEdit(content)} title="Edit">
					<Edit className="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="sm" onClick={() => onDelete(content)} title="Delete">
					<Trash2 className="h-4 w-4 text-destructive" />
				</Button>
			</div>
		</div>
	);
}

function ContentSkeleton() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<Skeleton className="h-8 w-64 mb-2" />
					<Skeleton className="h-4 w-96" />
				</div>
				<Skeleton className="h-10 w-32" />
			</div>
			<div className="grid gap-4 md:grid-cols-5">
				{Array.from({ length: 5 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16 mb-2" />
							<Skeleton className="h-3 w-24" />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
