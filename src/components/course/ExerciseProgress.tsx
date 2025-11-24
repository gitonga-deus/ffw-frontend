"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExerciseProgressProps {
	exerciseId: string;
	isCompleted: boolean;
	submittedAt?: string | Date;
	formTitle?: string;
}

export function ExerciseProgress({
	exerciseId,
	isCompleted,
	submittedAt,
	formTitle,
}: ExerciseProgressProps) {
	// Format submission date
	const formatDate = (date: string | Date | undefined): string => {
		if (!date) return "";

		try {
			const dateObj = typeof date === "string" ? new Date(date) : date;

			// Check if date is valid
			if (isNaN(dateObj.getTime())) return "";

			return dateObj.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch (err) {
			console.error("Error formatting date:", err);
			return "";
		}
	};

	const formattedDate = formatDate(submittedAt);

	return (
		<div className="flex items-center gap-3">
			{/* Status Icon */}
			<div className="shrink-0">
				{isCompleted ? (
					<CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
				) : (
					<Circle className="h-6 w-6 text-muted-foreground" />
				)}
			</div>

			{/* Exercise Info */}
			<div className="flex-1 min-w-0">
				{formTitle && (
					<p className="text-sm font-medium truncate">{formTitle}</p>
				)}

				{/* Status Badge */}
				<div className="flex items-center gap-2 mt-1">
					{isCompleted ? (
						<Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
							Completed
						</Badge>
					) : (
						<Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
							Pending
						</Badge>
					)}

					{/* Submission Date */}
					{isCompleted && formattedDate && (
						<span className="text-xs text-muted-foreground flex items-center gap-1">
							<Clock className="h-3 w-3" />
							{formattedDate}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
