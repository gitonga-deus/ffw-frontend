import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api';

interface UseAsyncOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: unknown) => void;
	successMessage?: string;
	errorMessage?: string;
}

export function useAsync<T = any>(
	asyncFunction: (...args: any[]) => Promise<T>,
	options: UseAsyncOptions = {}
) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [data, setData] = useState<T | null>(null);

	const execute = useCallback(
		async (...args: any[]) => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await asyncFunction(...args);
				setData(result);

				if (options.successMessage) {
					toast.success(options.successMessage);
				}

				if (options.onSuccess) {
					options.onSuccess(result);
				}

				return result;
			} catch (err) {
				const error = err instanceof Error ? err : new Error('An error occurred');
				setError(error);

				if (options.errorMessage) {
					toast.error(options.errorMessage, {
						description: getErrorMessage(err),
					});
				}

				if (options.onError) {
					options.onError(err);
				}

				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[asyncFunction, options]
	);

	const reset = useCallback(() => {
		setIsLoading(false);
		setError(null);
		setData(null);
	}, []);

	return {
		execute,
		isLoading,
		error,
		data,
		reset,
	};
}
