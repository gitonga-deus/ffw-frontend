"use client";

import * as React from"react";
import { useForm } from"react-hook-form";
import { zodResolver } from"@hookform/resolvers/zod";
import * as z from"zod";
import { useAuth } from"@/hooks/use-auth";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { PasswordInput } from"./PasswordInput";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from"@/components/ui/form";
import { Upload } from"lucide-react";

const registerSchema = z.object({
	full_name: z.string().min(2,"Full name must be at least 2 characters"),
	email: z.email("Invalid email address"),
	phone_number: z.string().min(10,"Phone number must be at least 10 digits"),
	password: z.string().min(8,"Password must be at least 8 characters"),
	confirm_password: z.string(),
	profile_image: z.instanceof(File).optional(),
}).refine((data) => data.password === data.confirm_password, {
	message:"Passwords do not match",
	path: ["confirm_password"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
	const { register, isRegisterLoading } = useAuth();
	const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			full_name:"",
			email:"",
			phone_number:"",
			password:"",
			confirm_password:"",
		},
	});

	const onSubmit = (data: RegisterFormValues) => {
		register(data);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setValue("profile_image", file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="full_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input placeholder="John Doe" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="john.doe@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="phone_number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone Number</FormLabel>
							<FormControl>
								<Input type="tel" placeholder="+254712345678" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="profile_image"
					render={({ field: { value, onChange, ref, ...field } }) => (
						<FormItem>
							<FormLabel>Profile Image (Optional)</FormLabel>
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
										className="rounded"
										onClick={() => fileInputRef.current?.click()}
									>
										<Upload className="mr-2 h-4 w-4" />
										Upload Image
									</Button>
									{previewUrl && (
										<img
											src={previewUrl}
											alt="Preview"
											className="h-12 w-12 rounded-full object-cover"
										/>
									)}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<PasswordInput placeholder="Enter your password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="confirm_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<PasswordInput placeholder="Confirm your password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full h-10 rounded" disabled={isRegisterLoading}>
					{isRegisterLoading ?"Creating account..." :"Create Account"}
				</Button>
			</form>
		</Form>
	);
}
