"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ExternalLink } from "lucide-react";

interface ExerciseContentFormProps {
	formData: any;
	setFormData: (data: any) => void;
}

export function ExerciseContentForm({ formData, setFormData }: ExerciseContentFormProps) {
	const validateEmbedCode = (code: string): boolean => {
		if (!code || !code.trim()) return false;
		
		// Check if embed code contains 123FormBuilder domain
		const has123FormBuilder = code.includes('123formbuilder.com') || 
		                          code.includes('123contactform.com');
		
		// Check if it looks like HTML/iframe/script
		const hasHtmlTags = code.includes('<iframe') || 
		                    code.includes('<script') || 
		                    code.includes('src=');
		
		return has123FormBuilder && hasHtmlTags;
	};

	const handleEmbedCodeChange = (value: string) => {
		setFormData({ 
			...formData, 
			embed_code: value,
			embed_code_valid: validateEmbedCode(value)
		});
	};

	const isValid = formData.embed_code && validateEmbedCode(formData.embed_code);
	const showValidation = formData.embed_code && formData.embed_code.length > 10;

	return (
		<div className="space-y-4">
			{/* Help Text */}
			<div className="bg-muted/50 p-4 rounded-md space-y-2">
				<p className="text-sm font-medium">How to add an exercise:</p>
				<ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
					<li>Create your form in 123FormBuilder</li>
					<li>Copy the embed code from your form settings</li>
					<li>Paste the embed code below</li>
				</ol>
				<a
					href="https://www.123formbuilder.com"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
				>
					Open 123FormBuilder
					<ExternalLink className="h-3 w-3" />
				</a>
			</div>

			{/* Form Title */}
			<div className="grid gap-2">
				<Label htmlFor="form_title">Form Title *</Label>
				<Input
					id="form_title"
					value={formData.form_title || ""}
					onChange={(e) => setFormData({ ...formData, form_title: e.target.value })}
					placeholder="e.g., Module 1 Quiz"
					className="h-10"
					required
				/>
				<p className="text-xs text-muted-foreground">
					A descriptive title for this exercise
				</p>
			</div>

			{/* Embed Code */}
			<div className="grid gap-2">
				<Label htmlFor="embed_code">123FormBuilder Embed Code *</Label>
				<Textarea
					id="embed_code"
					value={formData.embed_code || ""}
					onChange={(e) => handleEmbedCodeChange(e.target.value)}
					placeholder='<iframe src="https://www.123formbuilder.com/form-..." ...'
					className="font-mono text-sm min-h-[120px]"
					required
				/>
				{showValidation && (
					<p className={`text-xs ${isValid ? 'text-green-600' : 'text-destructive'}`}>
						{isValid 
							? '✓ Valid 123FormBuilder embed code' 
							: '✗ Invalid embed code. Please ensure you copied the complete embed code from 123FormBuilder.'}
					</p>
				)}
				<p className="text-xs text-muted-foreground">
					Paste the complete embed code (iframe or script tag) from your 123FormBuilder form
				</p>
			</div>

			{/* Multiple Submissions Toggle */}
			<div className="flex items-center justify-between border rounded-md p-4">
				<div className="space-y-1">
					<Label htmlFor="allow_multiple_submissions">Allow Multiple Submissions</Label>
					<p className="text-xs text-muted-foreground">
						Enable this if students can submit the exercise multiple times
					</p>
				</div>
				<Switch
					id="allow_multiple_submissions"
					checked={formData.allow_multiple_submissions || false}
					onCheckedChange={(checked) =>
						setFormData({ ...formData, allow_multiple_submissions: checked })
					}
				/>
			</div>
		</div>
	);
}
