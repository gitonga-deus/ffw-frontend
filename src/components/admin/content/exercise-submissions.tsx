"use client";

import { useState, useEffect } from "react";
import { contentApi } from "@/lib/content-api";
import type { ExerciseSubmissionsListResponse } from "@/types/content";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Download } from "lucide-react";
import { toast } from "sonner";

interface ExerciseSubmissionsProps {
	exerciseId: string;
	formId: string;
}

export function ExerciseSubmissions({ exerciseId, formId }: ExerciseSubmissionsProps) {
	const [data, setData] = useState<ExerciseSubmissionsListResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchSubmissions();
	}, [exerciseId]);

	const fetchSubmissions = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await contentApi.getExerciseSubmissions(exerciseId);
			setData(response);
		} catch (err: any) {
			console.error("Failed to fetch submissions:", err);
			setError(err.response?.data?.detail || "Failed to load submissions");
			toast.error("Failed to load submissions");
		} finally {
			setLoading(false);
		}
	};

	const handleViewIn123FormBuilder = () => {
		// Open 123FormBuilder dashboard with the form
		const url = `https://www.123formbuilder.com/form-${formId}/submissions`;
		window.open(url, "_blank", "noopener,noreferrer");
	};

	const handleExportCSV = () => {
		if (!data || data.submissions.length === 0) {
			toast.error("No submissions to export");
			return;
		}

		try {
			// Create CSV content
			const headers = ["Student Name", "Email", "Submission Date", "Webhook Received"];
			const rows = data.submissions.map((sub) => [
				sub.user_name,
				sub.user_email,
				new Date(sub.submitted_at).toLocaleString(),
				new Date(sub.webhook_received_at).toLocaleString(),
			]);

			const csvContent = [
				headers.join(","),
				...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
			].join("\n");

			// Create and download file
			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", `exercise-submissions-${exerciseId}.csv`);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success("CSV exported successfully");
		} catch (err) {
			console.error("Failed to export CSV:", err);
			toast.error("Failed to export CSV");
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	if (loading) {
		return <SubmissionsSkeleton />;
	}

	if (error) {
		return (
			<Card>
				<CardContent className="py-8">
					<p className="text-center text-muted-foreground">{error}</p>
					<div className="flex justify-center mt-4">
						<Button onClick={fetchSubmissions} variant="outline">
							Retry
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!data) {
		return null;
	}

	return (
		<div className="space-y-4">
			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{data.total_submissions}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Unique Students</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{data.unique_users}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{data.completion_rate.toFixed(1)}%</div>
					</CardContent>
				</Card>
			</div>

			{/* Actions */}
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">Submissions</h3>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleViewIn123FormBuilder}
						className="h-9"
					>
						<ExternalLink className="h-4 w-4 mr-2" />
						View in 123FormBuilder
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handleExportCSV}
						disabled={data.submissions.length === 0}
						className="h-9"
					>
						<Download className="h-4 w-4 mr-2" />
						Export CSV
					</Button>
				</div>
			</div>

			{/* Submissions Table */}
			{data.submissions.length > 0 ? (
				<Card>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Student Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Submission Date</TableHead>
									<TableHead>Webhook Received</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.submissions.map((submission) => (
									<TableRow key={submission.id}>
										<TableCell className="font-medium">{submission.user_name}</TableCell>
										<TableCell>{submission.user_email}</TableCell>
										<TableCell>{formatDate(submission.submitted_at)}</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{formatDate(submission.webhook_received_at)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-muted-foreground">No submissions yet</p>
						<p className="text-sm text-muted-foreground mt-2">
							Submissions will appear here once students complete the exercise
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

function SubmissionsSkeleton() {
	return (
		<div className="space-y-4">
			<div className="grid gap-4 md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="pb-3">
							<Skeleton className="h-4 w-32" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16" />
						</CardContent>
					</Card>
				))}
			</div>
			<div className="flex justify-between items-center">
				<Skeleton className="h-6 w-32" />
				<div className="flex gap-2">
					<Skeleton className="h-9 w-48" />
					<Skeleton className="h-9 w-32" />
				</div>
			</div>
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-64 w-full" />
				</CardContent>
			</Card>
		</div>
	);
}
