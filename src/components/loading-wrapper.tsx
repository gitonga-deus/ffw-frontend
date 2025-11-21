import { ReactNode } from 'react';
import { ErrorDisplay, InlineError } from '@/components/error-display';
import { Loader2 } from 'lucide-react';

interface LoadingWrapperProps {
  isLoading: boolean;
  error?: Error | null;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  onRetry?: () => void;
  children: ReactNode;
  inline?: boolean;
}

export function LoadingWrapper({
  isLoading,
  error,
  loadingComponent,
  errorComponent,
  onRetry,
  children,
  inline = false,
}: LoadingWrapperProps) {
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    
    if (inline) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    if (inline) {
      return <InlineError message={error.message} onRetry={onRetry} />;
    }

    return <ErrorDisplay message={error.message} onRetry={onRetry} />;
  }

  return <>{children}</>;
}

interface QueryWrapperProps<T> {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  data: T | undefined;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  emptyComponent?: ReactNode;
  onRetry?: () => void;
  children: (data: T) => ReactNode;
  inline?: boolean;
}

export function QueryWrapper<T>({
  isLoading,
  isError,
  error,
  data,
  loadingComponent,
  errorComponent,
  emptyComponent,
  onRetry,
  children,
  inline = false,
}: QueryWrapperProps<T>) {
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    if (inline) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError && error) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    if (inline) {
      return <InlineError message={error.message} onRetry={onRetry} />;
    }

    return <ErrorDisplay message={error.message} onRetry={onRetry} />;
  }

  if (!data) {
    if (emptyComponent) {
      return <>{emptyComponent}</>;
    }
    return null;
  }

  return <>{children(data)}</>;
}
