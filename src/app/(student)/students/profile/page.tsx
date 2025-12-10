"use client";

import { useAuth } from"@/hooks/use-auth";
import { useForm } from"react-hook-form";
import { zodResolver } from"@hookform/resolvers/zod";
import * as z from"zod";
import { useMutation, useQueryClient } from"@tanstack/react-query";
import { api } from"@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { PasswordInput } from"@/components/auth/PasswordInput";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from"@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from"@/components/ui/avatar";
import { Separator } from"@/components/ui/separator";
import { toast } from"sonner";
import { Upload, Loader2 } from"lucide-react";
import { useState, useRef } from"react";
import { getInitials } from"@/lib/utils";

// Profile update schema
const profileSchema = z.object({
	full_name: z.string().min(2,"Full name must be at least 2 characters"),
	email: z.email("Invalid email address"),
	phone_number: z.string().min(10,"Phone number must be at least 10 digits"),
	profile_image: z.instanceof(File).optional(),
});

// Password change schema
const passwordSchema = z.object({
	current_password: z.string().min(1,"Current password is required"),
	new_password: z.string().min(8,"Password must be at least 8 characters"),
	confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
	message:"Passwords do not match",
	path: ["confirm_password"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const profileForm = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			full_name: user?.full_name ||"",
			email: user?.email ||"",
			phone_number: user?.phone_number ||"",
		},
	});

	const passwordForm = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			current_password:"",
			new_password:"",
			confirm_password:"",
		},
	});

	// Update profile mutation
	const updateProfileMutation = useMutation({
		mutationFn: async (data: ProfileFormValues) => {
			const formData = new FormData();
			formData.append("full_name", data.full_name);
			formData.append("email", data.email);
			formData.append("phone_number", data.phone_number);

			if (data.profile_image) {
				formData.append("profile_image", data.profile_image);
			}

			const response = await api.put("/auth/profile", formData, {
				headers: {"Content-Type":"multipart/form-data",
				},
			});
			return response.data;
		},
		onSuccess: () => {
			toast.success("Profile updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["currentUser"] });
			setPreviewUrl(null);
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.error?.message ||"Failed to update profile");
		},
	});

	// Change password mutation
	const changePasswordMutation = useMutation({
		mutationFn: async (data: PasswordFormValues) => {
			const formData = new FormData();
			formData.append("current_password", data.current_password);
			formData.append("new_password", data.new_password);

			const response = await api.put("/auth/change-password", formData, {
				headers: {"Content-Type":"multipart/form-data",
				},
			});
			return response.data;
		},
		onSuccess: () => {
			toast.success("Password changed successfully!");
			passwordForm.reset();
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.error?.message ||"Failed to change password");
		},
	});

	const onProfileSubmit = (data: ProfileFormValues) => {
		updateProfileMutation.mutate(data);
	};

	const onPasswordSubmit = (data: PasswordFormValues) => {
		changePasswordMutation.mutate(data);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			profileForm.setValue("profile_image", file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	if (!user) {
		return null;
	}

	return (
		<div className="py-8">
			<div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto space-y-8">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold">Profile Settings</h1>
					<p className="text-muted-foreground mt-2">
						Manage your account information and preferences
					</p>
				</div>

				{/* Profile Information Card */}
				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle>Profile Information</CardTitle>
						<CardDescription>
							Update your personal details and profile picture
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...profileForm}>
							<form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
								{/* Profile Image */}
								<div className="flex items-center gap-6">
									<Avatar className="h-20 w-20 rounded-lg">
										<AvatarImage
											src={previewUrl || user.profile_image_url}
											alt={user.full_name}
											className="object-cover object-center"
										/>
										<AvatarFallback className="text-3xl bg-primary text-white font-semibold">
											{getInitials(user.full_name)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<FormField
											control={profileForm.control}
											name="profile_image"
											render={({ field: { value, onChange, ref, ...field } }) => (
												<FormItem>
													<FormLabel>Profile Picture</FormLabel>
													<FormControl>
														<div className="flex items-center gap-4">
															<input
																type="file"
																accept="image/*"
																ref={fileInputRef}
																onChange={handleFileChange}
																className="hidden"
																{...field}
															/>
															<Button
																type="button"
																variant="outline"
																className="px-4! h-10 rounded-sm"
																onClick={() => fileInputRef.current?.click()}
															>
																<Upload className="mr-2 h-4 w-4" />
																Change Picture
															</Button>
															{previewUrl && (
																<span className="text-sm text-muted-foreground">
																	New image selected
																</span>
															)}
														</div>
													</FormControl>
													<FormDescription>
														Upload a new profile picture (max 5MB)
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<Separator />

								{/* Full Name */}
								<FormField
									control={profileForm.control}
									name="full_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Full Name</FormLabel>
											<FormControl>
												<Input placeholder="John Doe" className="h-10" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Email */}
								<FormField
									control={profileForm.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input type="email" placeholder="john.doe@example.com" className="h-10" {...field} />
											</FormControl>
											<FormDescription>
												Changing your email will require verification
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Phone Number */}
								<FormField
									control={profileForm.control}
									name="phone_number"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone Number</FormLabel>
											<FormControl>
												<Input type="tel" placeholder="+254712345678" className="h-10" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									disabled={updateProfileMutation.isPending}
									className="w-full sm:w-auto h-10 bg-[#049ad1] px-8! rounded-sm"
								>
									{updateProfileMutation.isPending && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Save Changes
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>

				{/* Change Password Card */}
				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle>Change Password</CardTitle>
						<CardDescription>
							Update your password to keep your account secure
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...passwordForm}>
							<form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
								<FormField
									control={passwordForm.control}
									name="current_password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Current Password</FormLabel>
											<FormControl>
												<PasswordInput placeholder="Enter current password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={passwordForm.control}
									name="new_password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>New Password</FormLabel>
											<FormControl>
												<PasswordInput placeholder="Enter new password" {...field} />
											</FormControl>
											<FormDescription>
												Password must be at least 8 characters
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={passwordForm.control}
									name="confirm_password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirm New Password</FormLabel>
											<FormControl>
												<PasswordInput placeholder="Confirm new password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									disabled={changePasswordMutation.isPending}
									className="w-full sm:w-auto px-8! bg-[#049ad1] h-10 rounded-sm"
								>
									{changePasswordMutation.isPending && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Change Password
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>

				{/* Account Information */}
				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle>Account Information</CardTitle>
						<CardDescription>
							View your account details and status
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Account Status</p>
								<p className="text-sm font-semibold">
									{user.is_verified ?"Verified" :"Not Verified"}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">Enrollment Status</p>
								<p className="text-sm font-semibold">
									{user.is_enrolled ?"Enrolled" :"Not Enrolled"}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">Account Type</p>
								<p className="text-sm font-semibold capitalize">{user.role}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">Member Since</p>
								<p className="text-sm font-semibold">
									{new Date(user.created_at).toLocaleDateString()}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
