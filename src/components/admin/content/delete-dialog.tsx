"use client";

import { useState } from"react";
import { contentApi } from"@/lib/content-api";
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
import { toast } from"sonner";

interface DeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	target: { type:"module" |"content"; id: string; name: string } | null;
	onSuccess: () => void;
}

export function DeleteDialog({ open, onOpenChange, target, onSuccess }: DeleteDialogProps) {
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		if (!target) return;

		setLoading(true);
		try {
			if (target.type ==="module") {
				await contentApi.deleteModule(target.id);
				toast.success("Module deleted successfully");
			} else {
				await contentApi.deleteContent(target.id);
				toast.success("Content deleted successfully");
			}
			onSuccess();
			onOpenChange(false);
		} catch (err: any) {
			console.error(err);
			const errorMessage = err.response?.data?.detail || `Failed to delete ${target.type}`;
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="rounded!">
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently delete the {target?.type}{""}
						<span className="font-semibold">&quot;{target?.name}&quot;</span>.
						{target?.type ==="module" &&" All content within this module will also be deleted."}
						<br />
						<br />
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				
				<AlertDialogFooter className="flex! justify-between! items-center!">
					<AlertDialogCancel className="h-10 px-6!">Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}  disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-6! text-white">
						{loading ?"Deleting..." :"Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
