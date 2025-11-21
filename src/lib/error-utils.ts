import { AxiosError } from 'axios';
import { UseFormSetError } from 'react-hook-form';

interface ValidationError {
    field: string;
    message: string;
}

interface ApiErrorResponse {
    error?: {
        code?: string;
        message?: string;
        details?: Record<string, string[]> | ValidationError[];
    };
    message?: string;
    detail?: string;
}

/**
 * Handle API errors and set form field errors
 */
export function handleFormError(
    error: unknown,
    setError: UseFormSetError<any>
): string {
    if (error instanceof AxiosError) {
        const data = error.response?.data as ApiErrorResponse;

        // Handle validation errors with field-specific messages
        if (data?.error?.details) {
            const details = data.error.details;

            // Handle object format: { field: ["error1", "error2"] }
            if (!Array.isArray(details)) {
                Object.entries(details).forEach(([field, messages]) => {
                    if (Array.isArray(messages) && messages.length > 0) {
                        setError(field as any, {
                            type: 'manual',
                            message: messages[0],
                        });
                    }
                });
                return data.error.message || 'Validation failed';
            }

            // Handle array format: [{ field: "email", message: "Invalid email" }]
            if (Array.isArray(details)) {
                details.forEach((detail: ValidationError) => {
                    setError(detail.field as any, {
                        type: 'manual',
                        message: detail.message,
                    });
                });
                return data.error.message || 'Validation failed';
            }
        }

        // Return general error message
        return (
            data?.error?.message ||
            data?.message ||
            data?.detail ||
            error.message ||
            'An error occurred'
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred';
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        const data = error.response?.data as ApiErrorResponse;
        return (
            data?.error?.message ||
            data?.message ||
            data?.detail ||
            error.message ||
            'An error occurred'
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred';
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
    if (error instanceof AxiosError) {
        return !error.response && error.code === 'ERR_NETWORK';
    }
    return false;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
    if (error instanceof AxiosError) {
        return error.response?.status === 401;
    }
    return false;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
    if (error instanceof AxiosError) {
        return error.response?.status === 422 || error.response?.status === 400;
    }
    return false;
}

/**
 * Get error status code
 */
export function getErrorStatus(error: unknown): number | null {
    if (error instanceof AxiosError) {
        return error.response?.status || null;
    }
    return null;
}
