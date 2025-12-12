"use client";

import { useEffect, useState, useRef } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface ExerciseViewerProps {
	exerciseId: string;
	embedCode: string;
	formTitle: string;
	isCompleted: boolean;
}

export function ExerciseViewer({
	exerciseId,
	embedCode,
	formTitle,
	isCompleted,
}: ExerciseViewerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Inject embed code into container
	useEffect(() => {
		if (!containerRef.current || !embedCode) return;

		// Reset state for fresh load
		setIsLoading(true);
		setError(null);

		let timeout: NodeJS.Timeout | null = null;

		try {
			// Set a timeout to detect if 123FormBuilder service is unavailable
			timeout = setTimeout(() => {
				setIsLoading(false);
			}, 3000); // 3 second timeout

			// Simply inject the embed code directly using dangerouslySetInnerHTML approach
			// This preserves the exact script tags and attributes from 123FormBuilder
			containerRef.current.innerHTML = embedCode;

			// Find any script tags and re-execute them (innerHTML doesn't execute scripts)
			const scripts = containerRef.current.querySelectorAll("script");
			scripts.forEach((oldScript) => {
				const newScript = document.createElement("script");

				// Copy all attributes
				Array.from(oldScript.attributes).forEach((attr) => {
					newScript.setAttribute(attr.name, attr.value);
				});

				// Copy inline script content if any
				if (oldScript.innerHTML) {
					newScript.innerHTML = oldScript.innerHTML;
				}

				// Replace old script with new one to trigger execution
				oldScript.parentNode?.replaceChild(newScript, oldScript);
			});

			console.log("123FormBuilder embed code injected for exercise:", exerciseId);

		} catch (err) {
			console.error("Error injecting embed code:", err);
			setError("Failed to load exercise form. Please try refreshing the page.");
			setIsLoading(false);
		}

		// Cleanup function
		return () => {
			if (timeout) {
				clearTimeout(timeout);
			}
		};
	}, [embedCode, exerciseId]); // Re-run when exerciseId changes to ensure fresh load

	if (!embedCode) {
		return (
			<div className="bg-muted rounded-lg p-8 text-center">
				<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
				<p className="text-muted-foreground">Exercise not available</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Completion Status Badge */}
			{isCompleted && (
				<div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
					<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
					<span className="text-sm font-medium text-green-900 dark:text-green-100">
						Exercise Completed
					</span>
				</div>
			)}

			{/* Exercise Container */}
			<div className="relative bg-white dark:bg-gray-900 overflow-hidden">
				{/* Loading Overlay */}
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
						<div className="flex flex-col items-center gap-3">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
							<p className="text-sm text-muted-foreground">Loading exercise...</p>
						</div>
					</div>
				)}

				{/* Error Display */}
				{error && (
					<div className="p-8 text-center">
						<AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
						<p className="text-destructive font-medium mb-2">{error}</p>
						<p className="text-sm text-muted-foreground mb-4">
							The exercise form could not be loaded. This may be due to:
						</p>
						<ul className="text-sm text-muted-foreground mb-4 text-left max-w-md mx-auto space-y-1">
							<li>• 123FormBuilder service is temporarily down</li>
							<li>• Network connectivity issues</li>
							<li>• Browser blocking the embedded content</li>
						</ul>
						<p className="text-sm text-muted-foreground mb-4">
							If the problem persists, please contact your instructor at support.
						</p>
						<button
							onClick={() => {
								setError(null);
								setIsLoading(true);
								// Clear container to force re-injection
								if (containerRef.current) {
									containerRef.current.innerHTML = '';
								}
							}}
							className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
						>
							Retry Loading
						</button>
					</div>
				)}

				{/* Embed Container */}
				{!error && (
					<div
						ref={containerRef}
						className="w-full h-screen exercise-embed-container"
						style={{
							// Ensure proper sizing for mobile
							maxWidth: "100%",
							overflow: "auto",
							height: "600px"
						}}
					/>
				)}
			</div>

			{/* Help Text */}
			{!isCompleted && !error && (
				<div className="text-sm text-muted-foreground text-center p-3 bg-muted/50 rounded">
					Complete and submit the form above. After submitting, click "Mark Complete & Continue" below to proceed to the next lesson.
				</div>
			)}
		</div>
	);
}
