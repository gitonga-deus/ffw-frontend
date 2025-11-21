"use client";

import { useEffect, useState } from"react";
import { api } from"@/lib/api";
import { Plus, Edit, Trash2, Eye, Megaphone } from"lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Skeleton } from"@/components/ui/skeleton";
import { Button } from"@/components/ui/button";
import { Badge } from"@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from"@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from"@/components/ui/alert-dialog";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Textarea } from"@/components/ui/textarea";
import { Switch } from"@/components/ui/switch";
import { toast } from"sonner";

interface Announcement {
	id: string;
	title: string;
	content: string;
	is_published: boolean;
	created_at: string;
	updated_at: string;
}

export default function AnnouncementsPage() {
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
	const [formData, setFormData] = useState({ title:"", content:"", is_published: false });
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		fetchAnnouncements();
	}, []);

	const fetchAnnouncements = async () => {
		try {
			setLoading(true);
			const response = await api.get<{ announcements: Announcement[] }>("/admin/announcements");
			setAnnouncements(response.data.announcements);
		} catch (err) {
			console.error(err);
			toast.error("Failed to load announcements");
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		setEditingAnnouncement(null);
		setFormData({ title:"", content:"", is_published: false });
		setDialogOpen(true);
	};

	const handleEdit = (announcement: Announcement) => {
		setEditingAnnouncement(announcement);
		setFormData({
			title: announcement.title,
			content: announcement.content,
			is_published: announcement.is_published,
		});
		setDialogOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			if (editingAnnouncement) {
				await api.put(`/admin/announcements/${editingAnnouncement.id}`, formData);
				toast.success("Announcement updated successfully");
			} else {
				await api.post("/admin/announcements", formData);
				toast.success("Announcement created successfully");
			}
			setDialogOpen(false);
			await fetchAnnouncements();
		} catch (err: any) {
			console.error(err);
			toast.error(err.response?.data?.detail ||"Failed to save announcement");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!deleteTarget) return;

		try {
			await api.delete(`/admin/announcements/${deleteTarget.id}`);
			toast.success("Announcement deleted successfully");
			setDeleteDialogOpen(false);
			await fetchAnnouncements();
		} catch (err) {
			console.error(err);
			toast.error("Failed to delete announcement");
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year:"numeric",
			month:"short",
			day:"numeric",
			hour:"2-digit",
			minute:"2-digit",
		});
	};

	if (loading) {
		return <AnnouncementsSkeleton />;
	}

	const publishedCount = announcements.filter((a) => a.is_published).length;

	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold mb-2">Announcements</h1>
					<p className="text-muted-foreground">Manage course announcements</p>
				</div>
				<Button onClick={handleCreate} className="h-10">
					<Plus className="h-4 w-4 mr-2" />
					New Announcement
				</Button>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
						<Megaphone className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{announcements.length}</div>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Published</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{publishedCount}</div>
					</CardContent>
				</Card>
			</div>

			{/* Announcements List */}
			<div className="space-y-4">
				{announcements.length > 0 ? (
					announcements.map((announcement) => (
						<Card key={announcement.id} className="rounded-md shadow-xs">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<CardTitle>{announcement.title}</CardTitle>
											<Badge className="bg-[#049ad1] px-3" variant={announcement.is_published ?"default" :"secondary"}>
												{announcement.is_published ? (
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
										<CardDescription className="mt-2">
											{formatDate(announcement.created_at)}
										</CardDescription>
									</div>
									<div className="flex gap-2">
										<Button variant="ghost" size="sm" onClick={() => handleEdit(announcement)}>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												setDeleteTarget(announcement);
												setDeleteDialogOpen(true);
											}}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm whitespace-pre-wrap">{announcement.content}</p>
							</CardContent>
						</Card>
					))
				) : (
					<Card className="rounded-md shadow-xs">
						<CardContent className="py-12 text-center">
							<p className="text-muted-foreground mb-4">No announcements yet</p>
							<Button onClick={handleCreate} className="h-10">
								<Plus className="h-4 w-4 mr-2" />
								New Announcement
							</Button>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Create/Edit Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-[600px]">
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle>
								{editingAnnouncement ?"Edit Announcement" :"Create Announcement"}
							</DialogTitle>
							<DialogDescription>
								{editingAnnouncement
									?"Update the announcement details."
									:"Create a new announcement for students."}
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="title">Title *</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) => setFormData({ ...formData, title: e.target.value })}
									placeholder="Announcement title"
									required
									className="h-10"
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="content">Content *</Label>
								<Textarea
									id="content"
									value={formData.content}
									onChange={(e) => setFormData({ ...formData, content: e.target.value })}
									placeholder="Announcement content"
									rows={6}
									className="h-[40vh]!"
									required
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<Label htmlFor="is_published">Published</Label>
									<p className="text-xs text-muted-foreground">
										Make this announcement visible to students
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
							<Button type="button" variant="outline" className="h-10 px-6!" onClick={() => setDialogOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={submitting} className="h-10 px-6!">
								{submitting ?"Saving..." : editingAnnouncement ?"Update" :"Create"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent className="rounded">
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the announcement &quot;{deleteTarget?.title}&quot;. This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex! justify-between! items-center!">
						<AlertDialogCancel className="h-10 px-6!">Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} className="bg-destructive text-white h-10 px-6! hover:bg-destructive/90">
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

function AnnouncementsSkeleton() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<Skeleton className="h-8 w-48 mb-2" />
					<Skeleton className="h-4 w-96" />
				</div>
				<Skeleton className="h-10 w-40" />
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				{Array.from({ length: 2 }).map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-4 w-32" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16" />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
