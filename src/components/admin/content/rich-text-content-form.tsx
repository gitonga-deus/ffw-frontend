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

			{/* Exercises Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label>Exercises / Questions</Label>
					<Button type="button" variant="outline" className="h-10" onClick={addExercise}>
						<Plus className="h-4 w-4 mr-2" />
						Add Exercise
					</Button>
				</div>

				{exercises.map((exercise, exerciseIndex) => (
					<Card key={exercise.id} className="rounded-sm shadow-xs">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm flex items-center gap-2">
									<GripVertical className="h-4 w-4 text-muted-foreground" />
									Exercise {exerciseIndex + 1}
								</CardTitle>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => deleteExercise(exerciseIndex)}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Exercise Type */}
							<div className="grid gap-2">
								<Label>Question Type</Label>
								<Select
									value={exercise.type}
									onValueChange={(value: any) =>
										updateExercise(exerciseIndex, { type: value })
									}
								>
									<SelectTrigger className="rounded-sm h-10 w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-sm">
										<SelectItem value="radio">Multiple Choice (Single)</SelectItem>
										<SelectItem value="checkbox">Multiple Choice (Multiple)</SelectItem>
										<SelectItem value="textarea">Text Answer</SelectItem>
										<SelectItem value="date">Date Picker</SelectItem>
										<SelectItem value="number">Number Input</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Question */}
							<div className="grid gap-2">
								<Label>Question</Label>
								<Textarea
									value={exercise.question}
									onChange={(e) =>
										updateExercise(exerciseIndex, { question: e.target.value })
									}
									placeholder="Enter your question"
									className="h-32!"
									rows={2}
								/>
							</div>

							{/* Options (for radio/checkbox) */}
							{(exercise.type ==="radio" || exercise.type ==="checkbox") && (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label>Options</Label>
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="rounded-sm h-10"
											onClick={() => addOption(exerciseIndex)}
										>
											<Plus className="h-3 w-3 mr-1" />
											Add Option
										</Button>
									</div>
									{exercise.options?.map((option, optionIndex) => (
										<div key={optionIndex} className="flex items-center gap-2">
											<Input
												value={option}
												onChange={(e) =>
													updateOption(exerciseIndex, optionIndex, e.target.value)
												}
												placeholder={`Option ${optionIndex + 1}`}
												className="h-10"
											/>
											<Button
												type="button"
												variant="outline"
												className="h-10"
												onClick={() => deleteOption(exerciseIndex, optionIndex)}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>
									))}
								</div>
							)}

							{/* Correct Answer */}
							<div className="grid gap-2">
								<Label>Correct Answer (optional)</Label>
								{exercise.type ==="radio" ? (
									<Select
										value={(exercise.correctAnswer as string) || undefined}
										onValueChange={(value) =>
											updateExercise(exerciseIndex, { correctAnswer: value })
										}
									>
										<SelectTrigger className="h-10 w-full">
											<SelectValue placeholder="Select correct answer" />
										</SelectTrigger>
										<SelectContent className="rounded-sm">
											{exercise.options?.filter(option => option.trim() !=="").map((option, idx) => (
												<SelectItem key={idx} value={option}>
													{option}
												</SelectItem>
											))}
											{exercise.options?.filter(option => option.trim() !=="").length === 0 && (
												<div className="px-2 py-1.5 text-sm text-muted-foreground">
													No options available
												</div>
											)}
										</SelectContent>
									</Select>
								) : (
									<Input
										value={exercise.correctAnswer as string}
										onChange={(e) =>
											updateExercise(exerciseIndex, { correctAnswer: e.target.value })
										}
										placeholder="Enter correct answer for reference"
									/>
								)}
							</div>
						</CardContent>
					</Card>
				))}

				{exercises.length === 0 && (
					<p className="text-sm text-muted-foreground text-center py-4">
						No exercises added yet. Click &quot;Add Exercise&quot; to create one.
					</p>
				)}
			</div>
		</div>
	);
}
