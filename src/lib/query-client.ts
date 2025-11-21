import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

// Determine if an error should be retried
function shouldRetry(failureCount: number, error: unknown): boolean {
	// Don't retry if we've already tried 3 times
	if (failureCount >= 3) return false;

	// Don't retry on client errors (4xx) except 408 (timeout) and 429 (rate limit)
	if (axios.isAxiosError(error)) {
		const status = error.response?.status;
		if (status && status >= 400 && status < 500) {
			return status === 408 || status === 429;
		}
	}

	// Retry on network errors and server errors (5xx)
	return true;
}

// Calculate retry delay with exponential backoff
function getRetryDelay(failureCount: number): number {
	return Math.min(1000 * 2 ** failureCount, 30000); // Max 30 seconds
}

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			// Only show error toasts for queries with data
			// This prevents showing errors on initial page load
			if (query.state.data !== undefined) {
				const message = axios.isAxiosError(error)
					? error.response?.data?.error?.message || error.message
					: 'An error occurred while fetching data';

				toast.error('Query Error', {
					description: message,
				});
			}
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => {
			const message = axios.isAxiosError(error)
				? error.response?.data?.error?.message || error.message
				: 'An error occurred while processing your request';

			toast.error('Request Failed', {
				description: message,
			});
		},
	}),
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000, // 1 minute
			refetchOnWindowFocus: false,
			retry: shouldRetry,
			retryDelay: getRetryDelay,
			// Show cached data while refetching
			refetchOnMount: 'always',
			// Prevent unnecessary background refetches
			refetchOnReconnect: true,
		},
		mutations: {
			retry: (failureCount, error) => {
				// Only retry mutations on network errors, not on validation errors
				if (axios.isAxiosError(error)) {
					const status = error.response?.status;
					// Don't retry on client errors
					if (status && status >= 400 && status < 500) {
						return false;
					}
				}
				return failureCount < 2;
			},
			retryDelay: getRetryDelay,
		},
	},
});
