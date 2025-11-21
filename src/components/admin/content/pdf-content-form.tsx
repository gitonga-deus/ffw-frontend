"use client";

import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Upload, FileText } from"lucide-react";
import type { ContentResponse } from"@/types/content";

interface PDFContentFormProps {
	formData: any;
	setFormData: (data: any) => void;
	content: ContentResponse | null;
}

export function PDFContentForm({ formData, setFormData, content }: PDFContentFormProps) {
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.type !=="application/pdf") {
				alert("Please select a PDF file");
				return;
			}
			if (file.size > 20 * 1024 * 1024) {
				alert("File size must not exceed 20MB");
				return;
			}
			setFormData({
				...formData,
				pdf_file: file,
				pdf_filename: file.name,
			});
		}
	};

	return (
		<div className="space-y-4 border p-4">
			<h4 className="font-medium">PDF Settings</h4>

			{content?.pdf_url && (
				<div className="flex items-center gap-2 p-3 bg-muted">
					<FileText className="h-4 w-4" />
					<div className="flex-1">
						<p className="text-sm font-medium">Current PDF</p>
						<p className="text-xs text-muted-foreground">{content.pdf_filename}</p>
					</div>
				</div>
			)}

			<div className="grid gap-2">
				<Label htmlFor="pdf_file">
					{content ?"Upload New PDF (optional)" :"Upload PDF *"}
				</Label>
				<div className="flex items-center gap-2">
					<Input
						id="pdf_file"
						type="file"
						accept="application/pdf"
						className="h-10"
						onChange={handleFileChange}
						required={!content}
					/>
					{/* <Upload className="h-4 w-4 text-muted-foreground" /> */}
				</div>
				<p className="text-xs text-muted-foreground">
					Maximum file size: 20MB. Only PDF files are allowed.
				</p>
			</div>

			{formData.pdf_filename && (
				<div className="text-sm text-muted-foreground">
					Selected: {formData.pdf_filename}
				</div>
			)}
		</div>
	);
}
