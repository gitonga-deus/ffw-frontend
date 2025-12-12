"use client";

import { Content, RichTextContent } from "@/types";
import { VideoPlayer } from "./VideoPlayer";
import { PDFViewer } from "./PDFViewer";
import { RichTextViewer } from "./RichTextViewer";
import { RichTextRenderer } from "./RichTextRenderer";
import { ExerciseViewer } from "./ExerciseViewer";
import { CompleteButton } from "./CompleteButton";

interface ContentViewerProps {
  content: Content;
  isCompleted: boolean;
  onMarkComplete: () => Promise<void>;
  exerciseResponses?: Record<string, Record<string, string>>;
  onExerciseSubmit?: (exerciseId: string, responses: Record<string, string>) => void;
}

/**
 * ContentViewer - Wrapper component that renders the appropriate viewer based on content type
 * 
 * This component:
 * - Renders the correct viewer (Video, PDF, RichText, or Exercise) based on content_type
 * - Displays the CompleteButton below the content
 * - Passes completion state and callback to the button
 * 
 * Requirements: 1.1, 4.1, 4.2, 4.3, 4.4
 */
export function ContentViewer({
  content,
  isCompleted,
  onMarkComplete,
  exerciseResponses = {},
  onExerciseSubmit,
}: ContentViewerProps) {
  // Render the appropriate content viewer based on content type
  // Using key prop to force re-initialization when content changes
  const renderContentViewer = () => {
    switch (content.content_type) {
      case "video":
        return <VideoPlayer key={content.id} content={content} />;

      case "pdf":
        return <PDFViewer key={content.id} content={content} />;

      case "rich_text":
        // Handle different rich text content formats
        if (content.rich_text_content) {
          if (typeof content.rich_text_content === "string") {
            // HTML string format
            return <RichTextViewer key={content.id} htmlContent={content.rich_text_content} />;
          } else if (
            typeof content.rich_text_content === "object" &&
            "content" in content.rich_text_content &&
            content.rich_text_content.content
          ) {
            // Object with content property (HTML string)
            return <RichTextViewer key={content.id} htmlContent={content.rich_text_content.content} />;
          } else if (
            typeof content.rich_text_content === "object" &&
            "blocks" in content.rich_text_content
          ) {
            // Object with blocks (legacy format with embedded exercises)
            return (
              <RichTextRenderer
                key={content.id}
                content={content.rich_text_content as RichTextContent}
                onExerciseSubmit={onExerciseSubmit || (() => {})}
                exerciseResponses={exerciseResponses}
              />
            );
          }
        }
        // Fallback for invalid content
        return (
          <div key={content.id} className="bg-muted rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Invalid content format</p>
          </div>
        );

      case "exercise":
        if (content.exercise) {
          return (
            <ExerciseViewer
              key={content.id}
              exerciseId={content.exercise.id}
              embedCode={content.exercise.embed_code}
              formTitle={content.exercise.form_title}
              isCompleted={isCompleted}
            />
          );
        }
        // Fallback for missing exercise data
        return (
          <div key={content.id} className="bg-muted rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Exercise not available</p>
          </div>
        );

      default:
        return (
          <div key={content.id} className="bg-muted rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              Unsupported content type: {content.content_type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Content Viewer */}
      {renderContentViewer()}

      {/* Complete Button */}
      <div className="flex justify-center pt-2">
        <CompleteButton
          contentId={content.id}
          isCompleted={isCompleted}
          onComplete={onMarkComplete}
        />
      </div>
    </div>
  );
}
