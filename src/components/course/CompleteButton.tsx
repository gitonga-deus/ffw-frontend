"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface CompleteButtonProps {
  contentId: string;
  isCompleted: boolean;
  onComplete: () => Promise<void>;
  disabled?: boolean;
}

type ButtonState = "idle" | "saving" | "completed" | "error";

/**
 * CompleteButton - Unified button component for marking content complete
 *
 * Implements a 4-state machine:
 * - idle: Ready to be clicked (shows "Mark as Complete")
 * - saving: API call in progress (shows "Saving..." with spinner)
 * - completed: Content is complete (shows "Completed ✓", disabled)
 * - error: Save failed (shows "Retry", allows retry)
 *
 * Features:
 * - Prevents double-clicks by disabling during save
 * - Shows loading spinner during API call
 * - Transitions to completed state on success
 * - Shows error state with retry button on failure
 * - Ensures optimistic updates rollback on error
 * - Emits completion event for parent to handle navigation
 */
export function CompleteButton({
  contentId,
  isCompleted,
  onComplete,
  disabled = false,
}: CompleteButtonProps) {
  const [buttonState, setButtonState] = useState<ButtonState>(
    isCompleted ? "completed" : "idle"
  );

  // Update button state when isCompleted prop changes
  // This handles the case where content is already completed on load
  useEffect(() => {
    if (isCompleted && buttonState !== "completed") {
      setButtonState("completed");
    }
  }, [isCompleted, buttonState]);

  const handleClick = async () => {
    // Prevent action if already completed or disabled
    if (buttonState === "completed" || buttonState === "saving" || disabled) {
      return;
    }

    try {
      // Transition to saving state
      setButtonState("saving");

      // Call the onComplete callback (which handles API call)
      await onComplete();

      // Transition to completed state on success
      setButtonState("completed");
    } catch (error) {
      // Transition to error state on failure
      // Error toast with retry button is handled by useProgress hook
      setButtonState("error");
      
      // Auto-revert to idle after 3 seconds to allow manual retry
      setTimeout(() => {
        if (buttonState === "error") {
          setButtonState("idle");
        }
      }, 3000);
    }
  };

  // Determine button content based on state
  const getButtonContent = () => {
    switch (buttonState) {
      case "saving":
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        );
      case "completed":
        return (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Completed ✓
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="h-4 w-4" />
            Retry
          </>
        );
      case "idle":
      default:
        return "Mark as Complete";
    }
  };

  // Determine button variant based on state
  const getButtonVariant = () => {
    if (buttonState === "completed") {
      return "outline" as const;
    }
    if (buttonState === "error") {
      return "destructive" as const;
    }
    return "default" as const;
  };

  return (
    <Button
      onClick={handleClick}
      disabled={
        buttonState === "completed" || buttonState === "saving" || disabled
      }
      variant={getButtonVariant()}
      size="lg"
      className="w-full sm:w-auto rounded-sm h-10 px-4!"
      aria-label={
        buttonState === "completed"
          ? "Content completed"
          : buttonState === "saving"
          ? "Saving progress"
          : buttonState === "error"
          ? "Retry marking content as complete"
          : "Mark content as complete"
      }
      aria-live="polite"
    >
      {getButtonContent()}
    </Button>
  );
}
