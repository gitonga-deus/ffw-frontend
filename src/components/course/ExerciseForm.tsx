"use client";

import { useState } from"react";
import { Question } from"@/types";
import { Card, CardContent, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { RadioGroup, RadioGroupItem } from"@/components/ui/radio-group";
import { Textarea } from"@/components/ui/textarea";
import { CheckCircle2 } from"lucide-react";

interface ExerciseFormProps {
	exerciseId: string;
	title: string;
	questions: Question[];
	onSubmit: (exerciseId: string, responses: Record<string, string>) => void;
	initialResponses?: Record<string, string>;
}

export function ExerciseForm({
	exerciseId,
	title,
	questions,
	onSubmit,
	initialResponses = {},
}: ExerciseFormProps) {
	const [responses, setResponses] = useState<Record<string, string>>(initialResponses);
	const [isSubmitted, setIsSubmitted] = useState(Object.keys(initialResponses).length > 0);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(exerciseId, responses);
		setIsSubmitted(true);
	};

	const handleResponseChange = (questionId: string, value: string) => {
		setResponses((prev) => ({ ...prev, [questionId]: value }));
	};

	const isComplete = questions.every((q) => responses[q.id]?.trim());

	return (
		<Card className="rounded-sm shadow-xs">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					{title}
					{isSubmitted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					{questions.map((question, index) => (
						<div key={question.id} className="space-y-3">
							<Label className="text-base font-medium">
								{index + 1}. {question.question}
							</Label>

							{question.type ==="radio" && question.options ? (
								<RadioGroup
									value={responses[question.id] ||""}
									onValueChange={(value: string) => handleResponseChange(question.id, value)}
									disabled={isSubmitted}
								>
									{question.options.map((option) => (
										<div key={option.value} className="flex items-center space-x-2">
											<RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
											<Label
												htmlFor={`${question.id}-${option.value}`}
												className="font-normal cursor-pointer"
											>
												{option.label}
											</Label>
										</div>
									))}
								</RadioGroup>
							) : question.type ==="text" ? (
								<Textarea
									value={responses[question.id] ||""}
									onChange={(e) => handleResponseChange(question.id, e.target.value)}
									placeholder={question.placeholder ||"Type your answer here..."}
									disabled={isSubmitted}
									rows={4}
									className="resize-none"
								/>
							) : null}
						</div>
					))}

					<Button type="submit" disabled={!isComplete || isSubmitted} className="w-full sm:w-auto h-10 px-8">
						{isSubmitted ?"Submitted" :"Submit Responses"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
