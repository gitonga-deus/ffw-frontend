'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName: string;
  fallback?: React.ComponentType<{ error: Error; reset: () => void; sectionName: string }>;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends React.Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.sectionName}:`, error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            reset={this.reset}
            sectionName={this.props.sectionName}
          />
        );
      }

      return (
        <SectionErrorFallback
          error={this.state.error}
          reset={this.reset}
          sectionName={this.props.sectionName}
        />
      );
    }

    return this.props.children;
  }
}

function SectionErrorFallback({
  error,
  reset,
  sectionName,
}: {
  error: Error;
  reset: () => void;
  sectionName: string;
}) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="rounded-full bg-destructive/10 p-3 mb-4" aria-hidden="true">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Error Loading {sectionName}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <Button onClick={reset} variant="outline" aria-label={`Retry loading ${sectionName}`}>
            Try Again
          </Button>
        </div>
      </div>
    </section>
  );
}
