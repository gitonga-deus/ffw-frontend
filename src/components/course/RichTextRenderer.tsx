"use client";

import { RichTextContent } from"@/types";
import { ExerciseForm } from"./ExerciseForm";

interface RichTextRendererProps {
	content: RichTextContent;
	onExerciseSubmit: (exerciseId: string, responses: Record<string, string>) => void;
	exerciseResponses?: Record<string, Record<string, string>>;
}

export function RichTextRenderer({
	content,
	onExerciseSubmit,
	exerciseResponses = {},
}: RichTextRendererProps) {
	if (!content?.blocks || content.blocks.length === 0) {
		return (
			<div className="bg-muted rounded-lg p-8 text-center">
				<p className="text-muted-foreground">No content available</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{content.blocks.map((block) => {
				switch (block.type) {
					case"paragraph":
						return (
							<p key={block.id} className="text-base leading-relaxed">
								{block.content}
							</p>
						);

					case"heading":
						const level = block.level || 2;
						const headingClass = `font-bold tracking-tight ${level === 2 ?"text-2xl" : level === 3 ?"text-xl" :"text-lg"
							}`;

						if (level === 2) {
							return (
								<h2 key={block.id} className={headingClass}>
									{block.content}
								</h2>
							);
						} else if (level === 3) {
							return (
								<h3 key={block.id} className={headingClass}>
									{block.content}
								</h3>
							);
						} else {
							return (
								<h4 key={block.id} className={headingClass}>
									{block.content}
								</h4>
							);
						}

					case"exercise":
						if (!block.exercise_id || !block.questions) {
							return null;
						}
						return (
							<ExerciseForm
								key={block.id}
								exerciseId={block.exercise_id}
								title={block.title ||"Exercise"}
								questions={block.questions}
								onSubmit={onExerciseSubmit}
								initialResponses={exerciseResponses[block.exercise_id]}
							/>
						);

					default:
						return null;
				}
			})}
		</div>
	);
}
