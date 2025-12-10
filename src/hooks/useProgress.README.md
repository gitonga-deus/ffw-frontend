# useProgress Hook

A comprehensive React hook for managing progress tracking in the LMS with React Query.

## Features

### ✅ Task 4.1: Create useProgress hook
- **Overall progress query**: Fetches complete course progress with module breakdown
- **Module progress query**: Fetches all content progress for a specific module
- **Content progress query**: Fetches progress for a single content item
- **React Query configuration**: Proper cache settings (1 min stale time, 5 min gc time)
- **Automatic refetching**: Refetches on window focus and reconnect

### ✅ Task 4.2: Implement progress update mutation
- **Optimistic updates**: UI updates immediately before server confirmation
- **Rollback on error**: Automatically reverts changes if update fails
- **Context storage**: Stores previous state for rollback
- **Query invalidation**: Refreshes related queries on success
- **Error notifications**: Shows toast messages for failures

### ✅ Task 4.3: Implement helper functions
- **isContentCompleted()**: Checks if content is completed using cached data
- **isContentAccessible()**: Validates sequential access rules
- **getModuleProgressSummary()**: Gets module progress from cache

## API

### Hook Options
```typescript
interface UseProgressOptions {
  moduleId?: string;  // Optional: enables module progress query
  contentId?: string; // Optional: enables content progress query
}
```

### Return Values
```typescript
{
  // Query data
  overallProgress: OverallProgress | undefined;
  moduleProgress: ContentProgress[] | undefined;
  contentProgress: ContentProgress | undefined;

  // Loading states
  isLoadingOverall: boolean;
  isLoadingModule: boolean;
  isLoadingContent: boolean;
  isLoading: boolean;

  // Errors
  overallError: Error | null;
  moduleError: Error | null;
  contentError: Error | null;

  // Refetch functions
  refetchOverall: () => void;
  refetchModule: () => void;
  refetchContent: () => void;

  // Mutation
  updateProgress: (params: UpdateParams) => void;
  updateProgressAsync: (params: UpdateParams) => Promise<ContentProgress>;
  isUpdating: boolean;
  updateError: Error | null;

  // Helper functions
  isContentCompleted: (contentId: string) => boolean;
  isContentAccessible: (contentId: string, contentList: Content[]) => boolean;
  getModuleProgressSummary: (moduleId: string) => ModuleProgress | undefined;
}
```

## Usage Examples

See `useProgress.example.ts` for comprehensive examples including:
1. Overall progress display
2. Module progress tracking
3. Content completion with optimistic updates
4. Sequential access validation
5. Module progress summaries
6. Video player with position tracking
7. Error handling patterns

## Requirements Validation

### Requirement 4.1 (Optimistic Updates)
✅ UI updates immediately via `onMutate` callback
✅ Changes reflected before server confirmation

### Requirement 4.2 (Server Synchronization)
✅ Server response syncs with local state in `onSuccess`
✅ Query invalidation ensures fresh data

### Requirement 4.3 (Error Rollback)
✅ Automatic rollback in `onError` callback
✅ Toast notifications for user feedback

### Requirement 4.4 (Cached Data)
✅ Helper functions use `queryClient.getQueryData()`
✅ No loading delays for instant checks

### Requirement 9.3 (Clean Separation)
✅ All progress logic in dedicated hook
✅ Components only handle UI concerns
✅ Backend is source of truth

## Implementation Details

### Optimistic Update Flow
1. User action triggers `updateProgress()`
2. `onMutate` cancels in-flight queries
3. Previous state captured for rollback
4. Cache updated optimistically
5. Server request sent
6. On success: invalidate queries, sync with server
7. On error: restore previous state, show notification

### Cache Management
- **Stale time**: 1 minute (data considered fresh)
- **GC time**: 5 minutes (unused data cleanup)
- **Refetch on focus**: Enabled (fresh data on tab switch)
- **Retry**: 2 attempts on failure

### Sequential Access Logic
- First content always accessible
- Subsequent content requires previous completion
- Checks cached progress data for instant validation
- No server round-trip needed

## Files

### Core Implementation
1. `frontend/src/hooks/useProgress.ts` - Main hook implementation
2. `frontend/src/lib/api/progress.ts` - API client functions
3. `frontend/src/hooks/useProgress.README.md` - This documentation

### Cleanup Completed
- Removed unused `UserProgress` and `ProgressOverview` types from `frontend/src/types/index.ts`
- Removed unused `useQueryClient` import from module content page
- All components now use the new progress system exclusively
