import { api } from '@/lib/api';
import { AxiosError } from 'axios';

// Request types
export interface ProgressUpdateRequest {
  is_completed: boolean;
  time_spent: number;
  last_position?: number;
}

// Response types
export interface ContentProgress {
  content_id: string;
  content_title: string;
  content_type: 'video' | 'pdf' | 'rich_text' | 'exercise';
  is_completed: boolean;
  time_spent: number;
  last_position?: number;
  completed_at?: string;
  updated_at: string;
}

export interface ModuleProgress {
  module_id: string;
  module_title: string;
  module_order: number;
  total_content: number;
  completed_content: number;
  progress_percentage: number;
  is_accessible: boolean;
  is_completed: boolean;
}

export interface ContentBreakdown {
  videos: number;
  pdfs: number;
  rich_text: number;
  exercises: number;
}

export interface OverallProgress {
  progress_percentage: number;
  total_modules: number;
  completed_modules: number;
  total_content: number;
  completed_content: number;
  content_breakdown?: ContentBreakdown;
  completed_breakdown?: ContentBreakdown;
  last_accessed_module_id?: string;
  last_accessed_content_id?: string;
  last_accessed_at?: string;
  last_accessed_content?: any;
  modules: ModuleProgress[];
}

// Error types
export interface ProgressApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp?: string;
}

export class ProgressError extends Error {
  code: string;
  statusCode?: number;
  details?: Record<string, unknown>;

  constructor(message: string, code: string, statusCode?: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ProgressError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Parse error response and create a ProgressError
 */
function handleProgressError(error: unknown): never {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const errorData = error.response?.data as any;
    
    // Extract error message and code
    const message = errorData?.error?.message || errorData?.message || error.message;
    const code = errorData?.error?.code || getErrorCodeFromStatus(statusCode);
    const details = errorData?.error?.details || errorData?.details;

    // Handle specific error types
    if (!error.response) {
      // Network error
      throw new ProgressError(
        'Unable to connect to the server. Please check your internet connection.',
        'NETWORK_ERROR',
        undefined,
        { originalError: error.message }
      );
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      // Timeout error
      throw new ProgressError(
        'Request timed out. Please try again.',
        'TIMEOUT_ERROR',
        statusCode,
        { originalError: error.message }
      );
    }

    // Throw with parsed error information
    throw new ProgressError(message, code, statusCode, details);
  }

  // Unknown error type
  if (error instanceof Error) {
    throw new ProgressError(error.message, 'UNKNOWN_ERROR');
  }

  throw new ProgressError('An unexpected error occurred', 'UNKNOWN_ERROR');
}

/**
 * Get error code from HTTP status code
 */
function getErrorCodeFromStatus(statusCode?: number): string {
  switch (statusCode) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 422:
      return 'VALIDATION_ERROR';
    case 429:
      return 'RATE_LIMIT_EXCEEDED';
    case 500:
      return 'INTERNAL_SERVER_ERROR';
    case 503:
      return 'SERVICE_UNAVAILABLE';
    default:
      return 'UNKNOWN_ERROR';
  }
}

/**
 * Update progress for a specific content item
 * 
 * @param contentId - The ID of the content item
 * @param data - Progress update data
 * @returns Updated content progress
 * @throws {ProgressError} When the update fails
 */
export async function updateProgress(
  contentId: string,
  data: ProgressUpdateRequest
): Promise<ContentProgress> {
  try {
    const response = await api.post<ContentProgress>(
      `/progress/${contentId}`,
      data,
      {
        timeout: 10000, // 10 second timeout for progress updates
      }
    );
    return response.data;
  } catch (error) {
    // Log error for debugging
    console.error('Progress update failed:', {
      contentId,
      isCompleted: data.is_completed,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    handleProgressError(error);
  }
}

/**
 * Fetch overall course progress for the current user
 * 
 * @returns Overall progress including all modules
 * @throws {ProgressError} When the fetch fails
 */
export async function fetchOverallProgress(): Promise<OverallProgress> {
  try {
    const response = await api.get<OverallProgress>('/progress');
    return response.data;
  } catch (error) {
    handleProgressError(error);
  }
}

/**
 * Fetch progress for a specific module
 * 
 * @param moduleId - The ID of the module
 * @returns Array of content progress for the module
 * @throws {ProgressError} When the fetch fails
 */
export async function fetchModuleProgress(
  moduleId: string
): Promise<ContentProgress[]> {
  try {
    const response = await api.get<ContentProgress[]>(
      `/progress/module/${moduleId}`
    );
    return response.data;
  } catch (error) {
    handleProgressError(error);
  }
}

/**
 * Fetch progress for a specific content item
 * 
 * @param contentId - The ID of the content item
 * @returns Content progress details
 * @throws {ProgressError} When the fetch fails
 */
export async function fetchContentProgress(
  contentId: string
): Promise<ContentProgress> {
  try {
    const response = await api.get<ContentProgress>(`/progress/content/${contentId}`);
    return response.data;
  } catch (error) {
    handleProgressError(error);
  }
}

/**
 * Track module access for "resume where you left off"
 * 
 * @param moduleId - The ID of the module being accessed
 * @returns Success message
 * @throws {ProgressError} When the tracking fails
 */
export async function trackModuleAccess(
  moduleId: string
): Promise<{ message: string }> {
  try {
    const response = await api.post<{ message: string }>(`/progress/access/${moduleId}`);
    return response.data;
  } catch (error) {
    // Silently fail - this is not critical
    console.warn('Failed to track module access:', error);
    return { message: 'Failed to track' };
  }
}
