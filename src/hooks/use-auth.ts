import { useAuthStore } from '@/store/auth-store';
import { api } from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useAuth() {
	const { user, isAuthenticated, setUser, logout: storeLogout } = useAuthStore();
	const router = useRouter();

	const loginMutation = useMutation({
		mutationFn: async (data: LoginRequest) => {
			const response = await api.post<AuthResponse>('/auth/login', data);
			return response.data;
		},
		onSuccess: (data) => {
			if (!data.user) {
				toast.error('Login failed: Invalid response from server');
				return;
			}

			localStorage.setItem('access_token', data.access_token);
			localStorage.setItem('refresh_token', data.refresh_token);
			setUser(data.user);
			toast.success('Login successful!');

			if (data.user.role === 'admin') {
				router.push('/admin/dashboard');
			} else {
				router.push('/students/dashboard');
			}
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.error?.message || 'Login failed');
		},
	});

	const registerMutation = useMutation({
		mutationFn: async (data: RegisterRequest) => {
			const formData = new FormData();
			formData.append('email', data.email);
			formData.append('phone_number', data.phone_number);
			formData.append('full_name', data.full_name);
			formData.append('password', data.password);
			formData.append('confirm_password', data.confirm_password);

			if (data.profile_image) {
				formData.append('profile_image', data.profile_image);
			}

			const response = await api.post('/auth/register', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response.data;
		},
		onSuccess: (data) => {
			toast.success('Registration successful! Please check your email to verify your account.');
			// Redirect to a "check your email" page instead of verify-email
			router.push('/check-email');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.error?.message || 'Registration failed');
		},
	});

	const { data: currentUser, isLoading: isLoadingUser, refetch: refetchUser } = useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const response = await api.get<User>('/auth/me');
			return response.data;
		},
		enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
		retry: false,
		staleTime: 1 * 60 * 1000, // 1 minute - shorter to catch enrollment changes faster
		gcTime: 5 * 60 * 1000, // 5 minutes
	});

	// Sync fetched user data with store
	useEffect(() => {
		if (currentUser) {
			setUser(currentUser);
		}
	}, [currentUser, setUser]);

	const logout = () => {
		storeLogout();
		router.push('/login');
		toast.success('Logged out successfully');
	};

	return {
		user: currentUser || user,
		isAuthenticated: isAuthenticated || !!currentUser,
		isLoading: isLoadingUser,
		login: loginMutation.mutate,
		register: registerMutation.mutate,
		logout,
		refetchUser,
		isLoginLoading: loginMutation.isPending,
		isRegisterLoading: registerMutation.isPending,
	};
}
