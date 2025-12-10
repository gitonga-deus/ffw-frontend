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
				toast.error('Login Failed', {
					description: 'Invalid response from server. Please try again.',
					duration: 5000,
				});
				return;
			}

			localStorage.setItem('access_token', data.access_token);
			localStorage.setItem('refresh_token', data.refresh_token);
			setUser(data.user);
			toast.success('Welcome Back!', {
				description: `Logged in as ${data.user.full_name}`,
				duration: 3000,
			});

			if (data.user.role === 'admin') {
				router.push('/admin/dashboard');
			} else {
				router.push('/students/dashboard');
			}
		},
		onError: (error: any) => {
			const errorDetail = error.response?.data?.detail || error.response?.data?.error?.message;
			
			// Make error messages more user-friendly
			let title = 'Login Failed';
			let description = 'Please check your credentials and try again.';
			
			if (errorDetail) {
				if (errorDetail.includes('Invalid email or password')) {
					title = 'Incorrect Credentials';
					description = 'The email or password you entered is incorrect. Please try again.';
				} else if (errorDetail.includes('verify your email')) {
					title = 'Email Not Verified';
					description = 'Please check your email and verify your account before logging in.';
				} else if (errorDetail.includes('not found')) {
					title = 'Account Not Found';
					description = 'No account exists with this email address. Please register first.';
				} else {
					description = errorDetail;
				}
			}
			
			toast.error(title, {
				description: description,
				duration: 6000, // 6 seconds for errors
			});
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
			toast.success('Registration Successful!', {
				description: 'Please check your email to verify your account.',
				duration: 5000,
			});
			// Redirect to a "check your email" page instead of verify-email
			router.push('/check-email');
		},
		onError: (error: any) => {
			const errorDetail = error.response?.data?.detail || error.response?.data?.error?.message;
			
			let title = 'Registration Failed';
			let description = 'Please check your information and try again.';
			
			if (errorDetail) {
				if (errorDetail.includes('already exists') || errorDetail.includes('already registered')) {
					title = 'Email Already Registered';
					description = 'An account with this email already exists. Please login instead.';
				} else if (errorDetail.includes('password')) {
					title = 'Invalid Password';
					description = errorDetail;
				} else if (errorDetail.includes('phone')) {
					title = 'Invalid Phone Number';
					description = errorDetail;
				} else {
					description = errorDetail;
				}
			}
			
			toast.error(title, {
				description: description,
				duration: 6000,
			});
		},
	});

	const { data: currentUser, isLoading: isLoadingUser, refetch: refetchUser } = useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const token = localStorage.getItem('access_token');
			if (!token) {
				throw new Error('No access token');
			}
			const response = await api.get<User>('/auth/me');
			return response.data;
		},
		enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
		retry: false,
		staleTime: 5 * 60 * 1000, // 5 minutes - balance between freshness and performance
		gcTime: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: false, // Don't refetch on window focus to avoid unnecessary calls
		refetchOnReconnect: false, // Don't refetch on reconnect to avoid unnecessary calls
		refetchOnMount: false, // Don't refetch on mount if data exists
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
		toast.success('Logged Out', {
			description: 'You have been successfully logged out.',
			duration: 3000,
		});
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
