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
		<div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-muted-foreground prose-blockquote:border-l-primary prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-img:rounded-lg">
			{content.blocks.map((block) => {
				switch (block.type) {
					case"paragraph":
						return (
							<p key={block.id}>
								{block.content}
							</p>
						);

					case"heading":
						const level = block.level || 2;

						if (level === 1) {
							return (
								<h1 key={block.id}>
									{block.content}
								</h1>
							);
						} else if (level === 2) {
							return (
								<h2 key={block.id}>
									{block.content}
								</h2>
							);
						} else if (level === 3) {
							return (
								<h3 key={block.id}>
									{block.content}
								</h3>
							);
						} else if (level === 4) {
							return (
								<h4 key={block.id}>
									{block.content}
								</h4>
							);
						} else if (level === 5) {
							return (
								<h5 key={block.id}>
									{block.content}
								</h5>
							);
						} else {
							return (
								<h6 key={block.id}>
									{block.content}
								</h6>
							);
						}

					case"exercise":
						if (!block.exercise_id || !block.questions) {
							return null;
						}
						return (
							<div key={block.id} className="not-prose my-8">
								<ExerciseForm
									exerciseId={block.exercise_id}
									title={block.title ||"Exercise"}
									questions={block.questions}
									onSubmit={onExerciseSubmit}
									initialResponses={exerciseResponses[block.exercise_id]}
								/>
							</div>
						);

					default:
						return null;
				}
			})}
		</div>
	);
}
