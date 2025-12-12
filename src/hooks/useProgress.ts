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
    
    // Retry failed mutations (except for validation errors)
    retry: (failureCount, error) => {
      // Don't retry validation errors (4xx except 429)
      const statusCode = (error as any)?.response?.status;
      if (statusCode && statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
        return false;
      }
      // Retry up to 2 times for network/server errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff

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
      // Restore previous values (rollback optimistic updates)
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

      // Determine error type and message
      const errorCode = (error as any)?.code;
      const statusCode = (error as any)?.statusCode || (error as any)?.response?.status;
      const errorMessage = (error as any)?.message || 'Failed to save progress. Please try again.';
      
      let title = 'Progress Update Failed';
      let description = errorMessage;
      
      // Network errors
      if (errorCode === 'NETWORK_ERROR' || !statusCode) {
        title = 'No Internet Connection';
        description = 'Your progress was not saved. Please check your connection and try again.';
      }
      // Timeout errors
      else if (errorCode === 'TIMEOUT_ERROR' || errorCode === 'ECONNABORTED') {
        title = 'Request Timed Out';
        description = 'The server took too long to respond. Please try again.';
      }
      // Server errors (5xx)
      else if (statusCode >= 500) {
        title = 'Server Error';
        description = 'The server encountered an error. Please try again in a moment.';
      }
      // Validation errors (4xx)
      else if (statusCode >= 400 && statusCode < 500) {
        title = 'Invalid Request';
        description = errorMessage;
      }
      
      toast.error(title, {
        description,
        duration: 5000, // Show longer for errors
        action: {
          label: 'Retry',
          onClick: () => {
            // Retry the mutation
            updateProgressMutation.mutate({
              contentId: variables.contentId,
              data: variables.data,
            });
          },
        },
      });
    },

    // Sync with server response on success
    onSuccess: (data, variables) => {
      // CRITICAL: Update all caches SYNCHRONOUSLY with server data
      // This ensures isContentCompleted reads the correct state immediately
      
      // 1. Update content progress cache for the completed content
      queryClient.setQueryData(['progress', 'content', variables.contentId], data);

      // 2. Update module progress cache with server data
      // This is critical for sequential access checks
      if (moduleId) {
        const moduleData = queryClient.getQueryData<ContentProgress[]>([
          'progress',
          'module',
          moduleId,
        ]);
        
        if (moduleData) {
          // Update the specific item in the module progress array
          const updatedModuleData = moduleData.map((item) =>
            item.content_id === variables.contentId ? data : item
          );
          
          // Set the updated data synchronously
          queryClient.setQueryData<ContentProgress[]>(
            ['progress', 'module', moduleId],
            updatedModuleData
          );
        }
      }

      // 3. Update overall progress cache synchronously for completion
      // This ensures progress bars and percentages update immediately
      if (data.is_completed) {
        const overallData = queryClient.getQueryData<OverallProgress>([
          'progress',
          'overall',
        ]);
        
        if (overallData) {
          // Find the module this content belongs to
          const moduleData = queryClient.getQueryData<ContentProgress[]>([
            'progress',
            'module',
            moduleId,
          ]);
          
          if (moduleData) {
            // Calculate new module progress
            const completedInModule = moduleData.filter(item => item.is_completed).length;
            const totalInModule = moduleData.length;
            const moduleProgressPercentage = (completedInModule / totalInModule) * 100;
            
            // Update the module progress in overall progress
            const updatedModules = overallData.modules.map(m => 
              m.module_id === moduleId
                ? {
                    ...m,
                    completed_content: completedInModule,
                    total_content: totalInModule,
                    progress_percentage: moduleProgressPercentage,
                  }
                : m
            );
            
            // Calculate new overall progress
            const totalCompleted = updatedModules.reduce((sum, m) => sum + m.completed_content, 0);
            const totalContent = updatedModules.reduce((sum, m) => sum + m.total_content, 0);
            const overallProgressPercentage = totalContent > 0 ? (totalCompleted / totalContent) * 100 : 0;
            
            // Update overall progress cache synchronously
            queryClient.setQueryData<OverallProgress>(
              ['progress', 'overall'],
              {
                ...overallData,
                completed_content: totalCompleted,
                total_content: totalContent,
                progress_percentage: overallProgressPercentage,
                modules: updatedModules,
                last_accessed_content_id: variables.contentId,
                last_accessed_at: new Date().toISOString(),
              }
            );
          }
        }
        
        // Also invalidate to ensure server data is fetched in background
        // This will update within 1 second as a backup
        queryClient.invalidateQueries({ 
          queryKey: ['progress', 'overall'],
          refetchType: 'active'
        });
      } else {
        // For partial progress, just invalidate (will refetch on next access)
        queryClient.invalidateQueries({ queryKey: ['progress', 'overall'] });
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
    // First check in module progress cache (most reliable for sequential access)
    if (moduleId) {
      const moduleData = queryClient.getQueryData<ContentProgress[]>([
        'progress',
        'module',
        moduleId,
      ]);
      const item = moduleData?.find((p) => p.content_id === checkContentId);
      if (item !== undefined) {
        return item.is_completed;
      }
    }

    // Fallback to content progress cache
    const cached = queryClient.getQueryData<ContentProgress>([
      'progress',
      'content',
      checkContentId,
    ]);
    if (cached) {
      return cached.is_completed;
    }

    // Final fallback: check overall progress modules
    const overall = queryClient.getQueryData<OverallProgress>([
      'progress',
      'overall',
    ]);
    
    // This is a last resort and less reliable, but prevents false negatives
    // Note: This doesn't have content-level detail, so we can't use it directly
    // Just return false if we have no data
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

  // Helper function to force refresh all progress data
  const refreshAllProgress = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['progress', 'overall'] }),
      moduleId ? queryClient.invalidateQueries({ queryKey: ['progress', 'module', moduleId] }) : Promise.resolve(),
      contentId ? queryClient.invalidateQueries({ queryKey: ['progress', 'content', contentId] }) : Promise.resolve(),
    ]);
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
    refreshAllProgress,

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
