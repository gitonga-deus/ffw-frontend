import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchOverallProgress,
  fetchModuleProgress,
  fetchContentProgress,
  updateProgress,
  OverallProgress,
  ContentProgress,
  ProgressUpdateRequest,
} from '@/lib/api/progress';
import { toast } from 'sonner';

interface UseProgressOptions {
  moduleId?: string;
  contentId?: string;
  enabled?: boolean; // Allow disabling queries for non-enrolled users
}

/**
 * Hook for managing progress tracking with React Query
 * Provides queries for overall, module, and content progress
 * Includes optimistic updates with automatic rollback on error
 */
export function useProgress(options: UseProgressOptions = {}) {
  const queryClient = useQueryClient();
  const { moduleId, contentId, enabled = true } = options;

  // Query for overall course progress
  const {
    data: overallProgress,
    isLoading: isLoadingOverall,
    error: overallError,
    refetch: refetchOverall,
  } = useQuery({
    queryKey: ['progress', 'overall'],
    queryFn: fetchOverallProgress,
    enabled: enabled, // Only fetch if enabled
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });

  // Query for module progress (only if moduleId is provided)
  const {
    data: moduleProgress,
    isLoading: isLoadingModule,
    error: moduleError,
    refetch: refetchModule,
  } = useQuery({
    queryKey: ['progress', 'module', moduleId],
    queryFn: () => fetchModuleProgress(moduleId!),
    enabled: !!moduleId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });

  // Query for specific content progress (only if contentId is provided)
  const {
    data: contentProgress,
    isLoading: isLoadingContent,
    error: contentError,
    refetch: refetchContent,
  } = useQuery({
    queryKey: ['progress', 'content', contentId],
    queryFn: () => fetchContentProgress(contentId!),
    enabled: !!contentId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });

  // Mutation for updating progress with optimistic updates
  const updateProgressMutation = useMutation({
    mutationFn: ({
      contentId,
      data,
    }: {
      contentId: string;
      data: ProgressUpdateRequest;
    }) => updateProgress(contentId, data),

    // Optimistic update: immediately update UI before server confirms
    onMutate: async ({ contentId, data }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['progress'] });

      // Snapshot the previous values for rollback
      const previousOverall = queryClient.getQueryData<OverallProgress>([
        'progress',
        'overall',
      ]);
      const previousModule = moduleId
        ? queryClient.getQueryData<ContentProgress[]>([
            'progress',
            'module',
            moduleId,
          ])
        : undefined;
      const previousContent = queryClient.getQueryData<ContentProgress>([
        'progress',
        'content',
        contentId,
      ]);

      // Optimistically update content progress
      if (previousContent) {
        queryClient.setQueryData<ContentProgress>(
          ['progress', 'content', contentId],
          {
            ...previousContent,
            is_completed: data.is_completed,
            time_spent: data.time_spent,
            last_position: data.last_position,
            completed_at: data.is_completed
              ? new Date().toISOString()
              : previousContent.completed_at,
            updated_at: new Date().toISOString(),
          }
        );
      }

      // Optimistically update module progress
      if (previousModule && moduleId) {
        queryClient.setQueryData<ContentProgress[]>(
          ['progress', 'module', moduleId],
          previousModule.map((item) =>
            item.content_id === contentId
              ? {
                  ...item,
                  is_completed: data.is_completed,
                  time_spent: data.time_spent,
                  last_position: data.last_position,
                  completed_at: data.is_completed
                    ? new Date().toISOString()
                    : item.completed_at,
                  updated_at: new Date().toISOString(),
                }
              : item
          )
        );
      }

      // Optimistically update overall progress
      if (previousOverall && data.is_completed) {
        const wasCompleted = previousContent?.is_completed || false;
        const completedDelta = wasCompleted ? 0 : 1;

        queryClient.setQueryData<OverallProgress>(['progress', 'overall'], {
          ...previousOverall,
          completed_content: previousOverall.completed_content + completedDelta,
          progress_percentage:
            previousOverall.total_content > 0
              ? ((previousOverall.completed_content + completedDelta) /
                  previousOverall.total_content) *
                100
              : 0,
          last_accessed_content_id: contentId,
          last_accessed_at: new Date().toISOString(),
        });
      }

      // Return context with previous values for rollback
      return { previousOverall, previousModule, previousContent };
    },

    // Rollback on error
    onError: (error, variables, context) => {
      // Restore previous values
      if (context?.previousOverall) {
        queryClient.setQueryData(
          ['progress', 'overall'],
          context.previousOverall
        );
      }
      if (context?.previousModule && moduleId) {
        queryClient.setQueryData(
          ['progress', 'module', moduleId],
          context.previousModule
        );
      }
      if (context?.previousContent) {
        queryClient.setQueryData(
          ['progress', 'content', variables.contentId],
          context.previousContent
        );
      }

      // Show error notification with more details
      const errorMessage =
        (error as any)?.response?.data?.error?.message ||
        (error as any)?.message ||
        'Failed to update progress. Please try again.';
      
      const isNetworkError = !!(error as any)?.code && (error as any).code === 'NETWORK_ERROR';
      
      toast.error('Progress Update Failed', {
        description: isNetworkError 
          ? 'Network connection lost. Your progress was not saved. Please check your connection and try again.'
          : errorMessage,
        duration: 5000, // Show longer for errors
      });
    },

    // Sync with server response on success
    onSuccess: (data, variables) => {
      // Update content progress with server data
      queryClient.setQueryData(['progress', 'content', variables.contentId], data);

      // Invalidate related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['progress', 'overall'] });
      if (moduleId) {
        queryClient.invalidateQueries({
          queryKey: ['progress', 'module', moduleId],
        });
      }

      // Show success notification only for completion
      if (data.is_completed) {
        toast.success('Content Completed! ✓', {
          description: 'Your progress has been saved.',
          duration: 2000,
        });
      }
    },
  });

  // Helper function to check if content is completed
  const isContentCompleted = (checkContentId: string): boolean => {
    // Check in content progress cache
    const cached = queryClient.getQueryData<ContentProgress>([
      'progress',
      'content',
      checkContentId,
    ]);
    if (cached) {
      return cached.is_completed;
    }

    // Check in module progress cache
    if (moduleId) {
      const moduleData = queryClient.getQueryData<ContentProgress[]>([
        'progress',
        'module',
        moduleId,
      ]);
      const item = moduleData?.find((p) => p.content_id === checkContentId);
      if (item) {
        return item.is_completed;
      }
    }

    return false;
  };

  // Helper function to check if content is accessible (based on sequential access)
  const isContentAccessible = (
    checkContentId: string,
    contentList: Array<{ id: string; order_index: number }>
  ): boolean => {
    // Find the content in the list
    const contentIndex = contentList.findIndex((c) => c.id === checkContentId);
    if (contentIndex === -1) return false;

    // First content is always accessible
    if (contentIndex === 0) return true;

    // Check if previous content is completed
    const previousContent = contentList[contentIndex - 1];
    return isContentCompleted(previousContent.id);
  };

  // Helper function to get module progress summary
  const getModuleProgressSummary = (checkModuleId: string) => {
    const overall = queryClient.getQueryData<OverallProgress>([
      'progress',
      'overall',
    ]);
    return overall?.modules.find((m) => m.module_id === checkModuleId);
  };

  return {
    // Query data
    overallProgress,
    moduleProgress,
    contentProgress,

    // Loading states
    isLoadingOverall,
    isLoadingModule,
    isLoadingContent,
    isLoading: isLoadingOverall || isLoadingModule || isLoadingContent,

    // Errors
    overallError,
    moduleError,
    contentError,

    // Refetch functions
    refetchOverall,
    refetchModule,
    refetchContent,

    // Mutation
    updateProgress: updateProgressMutation.mutate,
    updateProgressAsync: updateProgressMutation.mutateAsync,
    isUpdating: updateProgressMutation.isPending,
    updateError: updateProgressMutation.error,

    // Helper functions
    isContentCompleted,
    isContentAccessible,
    getModuleProgressSummary,
  };
}
