"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface CertificateViewerProps {
	url: string;
}

export function CertificateViewer({ url }: CertificateViewerProps) {
	const [blobUrl, setBlobUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let objectUrl: string | null = null;

		const loadPDF = async () => {
			try {
				setLoading(true);
				setError(null);

				// Fetch the PDF as a blob
				const response = await fetch(url);
				
				if (!response.ok) {
					throw new Error('Failed to load certificate');
				}

				const blob = await response.blob();
				
				// Create a blob URL
				objectUrl = URL.createObjectURL(blob);
				setBlobUrl(objectUrl);
				setLoading(false);
			} catch (err) {
				console.error('Error loading certificate:', err);
				setError('Failed to load certificate. Please try downloading it instead.');
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
	}, [url]);

	if (loading) {
		return (
			<div className="border overflow-hidden bg-white rounded-md flex items-center justify-center" style={{ height: "600px" }}>
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-sm text-muted-foreground">Loading certificate...</p>
				</div>
			</div>
		);
	}

	if (error || !blobUrl) {
		return (
			<div className="border overflow-hidden bg-muted rounded-md flex items-center justify-center" style={{ height: "600px" }}>
				<div className="text-center p-8">
					<p className="text-destructive font-medium mb-2">Failed to load certificate</p>
					<p className="text-sm text-muted-foreground">Please try downloading it using the button below</p>
				</div>
			</div>
		);
	}

	return (
		<div className="border overflow-hidden bg-white" style={{ height: "600px" }}>
			<iframe
				src={blobUrl}
				className="w-full h-full"
				title="Course Completion Certificate"
			/>
		</div>
	);
}
