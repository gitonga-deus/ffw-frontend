"use client";

import { useEffect, useState } from"react";
import { Content } from"@/types";
import { Button } from"@/components/ui/button";
import { Download, ExternalLink } from"lucide-react";

interface PDFViewerProps {
	content: Content;
	onProgress?: (timeSpent: number, lastPosition: number) => void;
	onComplete?: () => void;
}

export function PDFViewer({ content, onProgress, onComplete }: PDFViewerProps) {

	if (!content.pdf_url) {
		return (
			<div className="bg-muted rounded-lg p-8 text-center">
				<p className="text-muted-foreground">PDF not available</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* PDF Display - Show immediately */}
			<div className="border overflow-hidden bg-white" style={{ height:"600px" }}>
				<iframe
					src={content.pdf_url}
					className="w-full h-full"
					title={content.title}
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
