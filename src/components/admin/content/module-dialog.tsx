"use client";

import { useState, useEffect } from"react";
import { contentApi } from"@/lib/content-api";
import type { ModuleResponse, ModuleCreate, ModuleUpdate } from"@/types/content";
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
import { Textarea } from"@/components/ui/textarea";
import { Switch } from"@/components/ui/switch";
import { toast } from"sonner";

interface ModuleDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	module: ModuleResponse | null;
	onSuccess: () => void;
}

export function ModuleDialog({ open, onOpenChange, module, onSuccess }: ModuleDialogProps) {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title:"",
		description:"",
		order_index: 0,
		is_published: false,
	});

	useEffect(() => {
		if (module) {
			setFormData({
				title: module.title,
				description: module.description ||"",
				order_index: module.order_index,
				is_published: module.is_published,
			});
		} else {
			setFormData({
				title:"",
				description:"",
				order_index: 0,
				is_published: false,
			});
		}
	}, [module, open]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			if (module) {
				// Update existing module
				const updateData: ModuleUpdate = {
					title: formData.title,
					description: formData.description || undefined,
					order_index: formData.order_index,
					is_published: formData.is_published,
				};
				await contentApi.updateModule(module.id, updateData);
				toast.success("Module updated successfully");
			} else {
				// Create new module - need to get course ID
				const course = await contentApi.getCourse();
				const createData: ModuleCreate = {
					course_id: course.id,
					title: formData.title,
					description: formData.description || undefined,
					order_index: formData.order_index,
					is_published: formData.is_published,
				};
				await contentApi.createModule(createData);
				toast.success("Module created successfully");
			}
			onSuccess();
			onOpenChange(false);
		} catch (err: any) {
			console.error(err);
			const errorMessage = err.response?.data?.detail ||"Failed to save module";
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] max-w-2xl!!">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{module ?"Edit Module" :"Create Module"}</DialogTitle>
						<DialogDescription>
							{module
								?"Update the module details below."
								:"Create a new module for your course."}
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="title">Title *</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								placeholder="Module title"
								className="h-10"
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								placeholder="Module description (optional)"
								className="rounded"
								rows={3}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="order_index">Order Index *</Label>
							<Input
								id="order_index"
								type="number"
								min="0"
								value={formData.order_index}
								className="h-10"
								onChange={(e) =>
									setFormData({ ...formData, order_index: parseInt(e.target.value) })
								}
								required
							/>
							<p className="text-xs text-muted-foreground">
								Determines the order of modules (0 = first)
							</p>
						</div>

						<div className="flex items-center justify-between">
							<div className="space-y-2">
								<Label htmlFor="is_published">Published</Label>
								<p className="text-xs text-muted-foreground">
									Make this module visible to students
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

					<DialogFooter className="flex! justify-between!">
						<Button type="button" className="h-10 px-6!" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit" className="h-10 px-6!" disabled={loading}>
							{loading ?"Saving..." : module ?"Update" :"Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
