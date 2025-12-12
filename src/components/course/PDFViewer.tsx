"use client";

import { useState } from "react";
import { Content } from "@/types";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, AlertCircle, RefreshCw } from "lucide-react";

interface PDFViewerProps {
	content: Content;
}

export function PDFViewer({ content }: PDFViewerProps) {
	const [hasError, setHasError] = useState(false);
	const [retryKey, setRetryKey] = useState(0);

	const handleRetry = () => {
		setHasError(false);
		setRetryKey(prev => prev + 1);
	};

	if (!content.pdf_url) {
		return (
			<div className="bg-muted rounded-lg p-8 text-center">
				<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
				<p className="text-muted-foreground">PDF not available</p>
			</div>
		);
	}

	if (hasError) {
		return (
			<div className="bg-muted rounded-lg p-8 text-center space-y-4">
				<AlertCircle className="h-12 w-12 text-destructive mx-auto" />
				<div>
					<p className="text-destructive font-medium">Failed to load PDF</p>
					<p className="text-sm text-muted-foreground mt-1">
						The PDF could not be displayed. Please try refreshing or download it instead.
					</p>
				</div>
				<div className="flex justify-center gap-2">
					<Button onClick={handleRetry} variant="outline">
						<RefreshCw className="mr-2 h-4 w-4" />
						Retry
					</Button>
					<Button asChild variant="default">
						<a href={content.pdf_url} download={content.pdf_filename}>
							<Download className="mr-2 h-4 w-4" />
							Download PDF
						</a>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* PDF Display - Show immediately */}
			<div className="border overflow-hidden bg-white" style={{ height: "600px" }}>
				<iframe
					key={retryKey}
					src={content.pdf_url}
					className="w-full h-full"
					title={content.title}
					onError={() => setHasError(true)}
				/>
			</div>

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
