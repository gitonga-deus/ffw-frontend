"use client";

import { useEffect, useState } from"react";
import { Content } from"@/types";
import { Button } from"@/components/ui/button";
import { Download, ExternalLink, Loader2 } from"lucide-react";

interface PDFViewerProps {
	content: Content;
	onProgress?: (timeSpent: number, lastPosition: number) => void;
	onComplete?: () => void;
}

export function PDFViewer({ content, onProgress, onComplete }: PDFViewerProps) {
	const [startTime] = useState(Date.now());
	const [blobUrl, setBlobUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Track time spent
		const interval = setInterval(() => {
			const timeSpent = Math.floor((Date.now() - startTime) / 1000);
			onProgress?.(timeSpent, 0);
		}, 30000); // Every 30 seconds

		return () => clearInterval(interval);
	}, [startTime, onProgress]);

	useEffect(() => {
		if (!content.pdf_url) return;

		let objectUrl: string | null = null;

		const loadPDF = async () => {
			try {
				setLoading(true);
				setError(null);

				// Fetch the PDF as a blob
				const response = await fetch(content.pdf_url!);
				
				if (!response.ok) {
					throw new Error('Failed to load PDF');
				}

				const blob = await response.blob();
				
				// Create a blob URL
				objectUrl = URL.createObjectURL(blob);
				setBlobUrl(objectUrl);
				setLoading(false);
			} catch (err) {
				console.error('Error loading PDF:', err);
				setError('Failed to load PDF. Please try downloading it instead.');
				setLoading(false);
			}
		};

		loadPDF();

		// Cleanup: revoke the blob URL when component unmounts
		return () => {
			if (objectUrl) {
				URL.revokeObjectURL(objectUrl);
			}
		};
	}, [content.pdf_url]);

	if (!content.pdf_url) {
		return (
			<div className="bg-muted rounded-lg p-8 text-center">
				<p className="text-muted-foreground">PDF not available</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* PDF Display */}
			{loading ? (
				<div className="border overflow-hidden bg-white rounded-md flex items-center justify-center" style={{ height:"600px" }}>
					<div className="flex flex-col items-center gap-3">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<p className="text-sm text-muted-foreground">Loading PDF...</p>
					</div>
				</div>
			) : error || !blobUrl ? (
				<div className="border overflow-hidden bg-muted rounded-md flex items-center justify-center" style={{ height:"600px" }}>
					<div className="text-center p-8">
						<p className="text-destructive font-medium mb-2">Failed to load PDF</p>
						<p className="text-sm text-muted-foreground">Please try downloading it using the button below</p>
					</div>
				</div>
			) : (
				<div className="border overflow-hidden bg-white rounded-md" style={{ height:"600px" }}>
					<iframe
						src={blobUrl}
						className="w-full h-full"
						title={content.title}
					/>
				</div>
			)}

			{/* Actions */}
			<div className="flex justify-between items-center gap-4">
				<Button asChild variant="outline">
					<a href={content.pdf_url} target="_blank" rel="noopener noreferrer">
						<ExternalLink className="mr-2 h-4 w-4" />
						Open in New Tab
					</a>
				</Button>
				<Button asChild variant="outline">
					<a href={content.pdf_url} download={content.pdf_filename}>
						<Download className="mr-2 h-4 w-4" />
						Download PDF
					</a>
				</Button>
			</div>
		</div>
	);
}
