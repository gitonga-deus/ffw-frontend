"use client";

import { useEffect, useRef } from "react";

interface RichTextViewerProps {
	htmlContent: string;
}

export function RichTextViewer({ htmlContent }: RichTextViewerProps) {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current && htmlContent) {
			// Clean up the HTML content
			const cleanedContent = typeof htmlContent === 'string' ? htmlContent.trim() : '';
			contentRef.current.innerHTML = cleanedContent;
		}
	}, [htmlContent]);

	// Handle empty or invalid content
	if (!htmlContent || (typeof htmlContent === 'string' && htmlContent.trim() === '')) {
		return (
			<div className="bg-muted rounded-lg p-8 text-center">
				<p className="text-muted-foreground">No content available</p>
			</div>
		);
	}

	return (
		<div
			ref={contentRef}
			className="prose prose-slate dark:prose-invert max-w-none 
				prose-headings:font-bold prose-headings:tracking-tight 
				prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-6
				prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-5
				prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-4
				prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-3
				prose-p:text-base prose-p:leading-relaxed prose-p:my-4
				prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
				prose-strong:font-semibold prose-strong:text-foreground
				prose-em:italic
				prose-ul:list-disc prose-ul:my-4 prose-ul:pl-6
				prose-ol:list-decimal prose-ol:my-4 prose-ol:pl-6
				prose-li:my-2 prose-li:leading-relaxed
				prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4
				prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
				prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-4
				prose-img:rounded-lg prose-img:my-6
				prose-table:border-collapse prose-table:w-full prose-table:my-6
				prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-2 prose-th:text-left prose-th:font-semibold
				prose-td:border prose-td:border-border prose-td:p-2"
		/>
	);
}
