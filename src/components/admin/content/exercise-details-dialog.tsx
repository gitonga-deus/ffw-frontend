"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContentResponse } from "@/types/content";
import { ExerciseSubmissions } from "./exercise-submissions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExerciseDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	content: ContentResponse | null;
}

export function ExerciseDetailsDialog({
	open,
	onOpenChange,
	content,
}: ExerciseDetailsDialogProps) {
	if (!content || content.content_type !== "exercise" || !content.exercise) {
		return null;
	}

	const exercise = content.exercise;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{content.title}</DialogTitle>
					<DialogDescription>Exercise details and submissions</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="submissions" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="submissions">Submissions</TabsTrigger>
						<TabsTrigger value="details">Exercise Details</TabsTrigger>
					</TabsList>

					<TabsContent value="submissions" className="mt-4">
						<ExerciseSubmissions exerciseId={exercise.id} formId={exercise.form_id} />
					</TabsContent>

					<TabsContent value="details" className="mt-4">
						<div className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Exercise Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Form Title</p>
										<p className="text-sm">{exercise.form_title}</p>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">Form ID</p>
										<p className="text-sm font-mono">{exercise.form_id}</p>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Multiple Submissions
										</p>
										<Badge variant={exercise.allow_multiple_submissions ? "default" : "secondary"}>
											{exercise.allow_multiple_submissions ? "Allowed" : "Not Allowed"}
										</Badge>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">Created</p>
										<p className="text-sm">
											{new Date(exercise.created_at).toLocaleString()}
										</p>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">Last Updated</p>
										<p className="text-sm">
											{new Date(exercise.updated_at).toLocaleString()}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-base">Embed Code</CardTitle>
								</CardHeader>
								<CardContent>
									<pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
										<code>{exercise.embed_code}</code>
									</pre>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
