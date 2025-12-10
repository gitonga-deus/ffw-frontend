import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
	timeout: 30000, // 30 seconds
});

// Request interceptor for adding auth token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('access_token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for handling errors
api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

		// Handle network errors
		if (!error.response) {
			toast.error('Network Error', {
				description: 'Unable to connect to the server. Please check your internet connection.',
			});
			return Promise.reject(error);
		}

		const status = error.response.status;

		// Handle 401 Unauthorized - try to refresh token
		if (status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			const refreshToken = localStorage.getItem('refresh_token');
			if (refreshToken) {
				try {
					// Create a new axios instance to avoid interceptor loops
					// The backend expects the refresh token in the Authorization header
					const refreshResponse = await axios.post(
						`${API_BASE_URL}/auth/refresh`,
						{},
						{
							headers: {
								Authorization: `Bearer ${refreshToken}`,
							},
						}
					);
					
					const { access_token, refresh_token } = refreshResponse.data;
					localStorage.setItem('access_token', access_token);
					if (refresh_token) {
						localStorage.setItem('refresh_token', refresh_token);
					}

					// Retry original request with new access token
					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${access_token}`;
					}
					return api(originalRequest);
				} catch (refreshError) {
					// Refresh failed (token expired or invalid), clear everything and redirect
					console.error('Token refresh failed:', refreshError);
					localStorage.removeItem('access_token');
					localStorage.removeItem('refresh_token');
					localStorage.removeItem('auth-storage');
					if (typeof window !== 'undefined') {
						window.location.href = '/login';
					}
					return Promise.reject(refreshError);
				}
			} else {
				// No refresh token available, redirect to login
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
				localStorage.removeItem('auth-storage');
				if (typeof window !== 'undefined') {
					window.location.href = '/login';
				}
			}
		}

		// Handle other error statuses
		const errorData = error.response.data as any;
		const errorMessage = errorData?.error?.message || errorData?.message || getDefaultErrorMessage(status);

		// Don't show toast for certain endpoints (to allow custom handling)
		const silentEndpoints = ['/auth/login', '/auth/register', '/certificates/mine', '/auth/me'];
		const isSilent = silentEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

		if (!isSilent) {
			toast.error(getErrorTitle(status), {
				description: errorMessage,
			});
		}

		return Promise.reject(error);
	}
);

function getErrorTitle(status: number): string {
	switch (status) {
		case 400:
			return 'Bad Request';
		case 401:
			return 'Unauthorized';
		case 403:
			return 'Forbidden';
		case 404:
			return 'Not Found';
		case 409:
			return 'Conflict';
		case 422:
			return 'Validation Error';
		case 429:
			return 'Too Many Requests';
		case 500:
			return 'Server Error';
		case 503:
			return 'Service Unavailable';
		default:
			return 'Error';
	}
}

function getDefaultErrorMessage(status: number): string {
	switch (status) {
		case 400:
			return 'The request was invalid. Please check your input.';
		case 401:
			return 'You need to be logged in to access this resource.';
		case 403:
			return 'You do not have permission to access this resource.';
		case 404:
			return 'The requested resource was not found.';
		case 409:
			return 'This action conflicts with existing data.';
		case 422:
			return 'The provided data is invalid.';
		case 429:
			return 'Too many requests. Please try again later.';
		case 500:
			return 'An internal server error occurred. Please try again later.';
		case 503:
			return 'The service is temporarily unavailable. Please try again later.';
		default:
			return 'An unexpected error occurred. Please try again.';
	}
}

// Helper function to extract error message from API response
export function getErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const errorData = error.response?.data as any;
		return errorData?.error?.message || errorData?.message || error.message;
	}
	if (error instanceof Error) {
		return error.message;
	}
	return 'An unexpected error occurred';
}
