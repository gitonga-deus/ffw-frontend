import { useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

/**
 * Hook to automatically refresh access token before it expires
 * Refreshes 5 minutes before expiration
 */
export function useTokenRefresh() {
	const { isAuthenticated, setUser, logout } = useAuthStore();
	const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	useEffect(() => {
		if (!isAuthenticated) {
			// Clear any existing timeout if user logs out
			if (refreshTimeoutRef.current) {
				clearTimeout(refreshTimeoutRef.current);
			}
			return;
		}

		const scheduleTokenRefresh = () => {
			// Clear any existing timeout
			if (refreshTimeoutRef.current) {
				clearTimeout(refreshTimeoutRef.current);
			}

			// Access token expires in 24 hours (1440 minutes)
			// Refresh 5 minutes before expiration = 1435 minutes = 86100000 ms
			const refreshTime = (24 * 60 - 5) * 60 * 1000; // 23 hours 55 minutes

			refreshTimeoutRef.current = setTimeout(async () => {
				try {
					const refreshToken = localStorage.getItem('refresh_token');
					if (!refreshToken) {
						logout();
						return;
					}

					const response = await api.post('/auth/refresh', {}, {
						headers: {
							Authorization: `Bearer ${refreshToken}`,
						},
					});

					const { access_token, refresh_token, user } = response.data;
					localStorage.setItem('access_token', access_token);
					if (refresh_token) {
						localStorage.setItem('refresh_token', refresh_token);
					}
					if (user) {
						setUser(user);
					}

					// Schedule next refresh
					scheduleTokenRefresh();
				} catch (error) {
					console.error('Failed to refresh token:', error);
					logout();
				}
			}, refreshTime);
		};

		scheduleTokenRefresh();

		return () => {
			if (refreshTimeoutRef.current) {
				clearTimeout(refreshTimeoutRef.current);
			}
		};
	}, [isAuthenticated, setUser, logout]);
}
