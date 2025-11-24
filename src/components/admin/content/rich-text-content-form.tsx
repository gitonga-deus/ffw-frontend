"use client";

import { useState, Suspense } from"react";
import { Label } from"@/components/ui/label";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from"@/components/ui/select";
import { Plus, Trash2, GripVertical } from"lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from"@/components/ui/card";
import { Skeleton } from"@/components/ui/skeleton";
import dynamic from"next/dynamic";

// Dynamically import Tiptap editor to avoid SSR issues
const TiptapEditor = dynamic(() => import("./tiptap-editor").then((mod) => mod.TiptapEditor), {
	ssr: false,
	loading: () => <Skeleton className="h-[400px] w-full" />,
});

interface RichTextContentFormProps {
	formData: any;
	setFormData: (data: any) => void;
}

interface Exercise {
	id: string;
	type:"radio" |"checkbox" |"textarea" |"date" |"number";
	question: string;
	options?: string[];
	correctAnswer?: string | string[];
	required: boolean;
}

export function RichTextContentForm({ formData, setFormData }: RichTextContentFormProps) {
	const [content, setContent] = useState(formData.rich_text_content?.content ||"");
	const [exercises, setExercises] = useState<Exercise[]>(
		formData.rich_text_content?.exercises || []
	);

	const updateFormData = (newContent: string, newExercises: Exercise[]) => {
		setFormData({
			...formData,
			rich_text_content: {
				content: newContent,
				exercises: newExercises,
			},
		});
	};

	const handleContentChange = (value: string) => {
		setContent(value);
		updateFormData(value, exercises);
	};

	const addExercise = () => {
		const newExercise: Exercise = {
			id: `exercise_${Date.now()}`,
			type:"radio",
			question:"",
			options: [""],
			correctAnswer:"",
			required: true,
		};
		const newExercises = [...exercises, newExercise];
		setExercises(newExercises);
		updateFormData(content, newExercises);
	};

	const updateExercise = (index: number, updates: Partial<Exercise>) => {
		const newExercises = [...exercises];
		newExercises[index] = { ...newExercises[index], ...updates };
		setExercises(newExercises);
		updateFormData(content, newExercises);
	};

	const deleteExercise = (index: number) => {
		const newExercises = exercises.filter((_, i) => i !== index);
		setExercises(newExercises);
		updateFormData(content, newExercises);
	};

	const addOption = (exerciseIndex: number) => {
		const newExercises = [...exercises];
		if (!newExercises[exerciseIndex].options) {
			newExercises[exerciseIndex].options = [];
		}
		newExercises[exerciseIndex].options!.push("");
		setExercises(newExercises);
		updateFormData(content, newExercises);
	};

	const updateOption = (exerciseIndex: number, optionIndex: number, value: string) => {
		const newExercises = [...exercises];
		newExercises[exerciseIndex].options![optionIndex] = value;
		setExercises(newExercises);
		updateFormData(content, newExercises);
	};

	const deleteOption = (exerciseIndex: number, optionIndex: number) => {
		const newExercises = [...exercises];
		newExercises[exerciseIndex].options = newExercises[exerciseIndex].options!.filter(
			(_, i) => i !== optionIndex
		);
		setExercises(newExercises);
		updateFormData(content, newExercises);
	};

	return (
		<div className="space-y-4 border p-4">
			<h4 className="font-medium">Rich Text Content</h4>

			{/* Main Content */}
			<div className="grid gap-2">
				<Label htmlFor="content">Content *</Label>
				<Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
					<TiptapEditor content={content} onChange={handleContentChange} />
				</Suspense>
				<p className="text-xs text-muted-foreground">
					Use the rich text editor to format your content with headings, lists, images, and more
				</p>
			</div>
		</div>
	);
}
