"use client";

import * as React from"react";
import { useForm } from"react-hook-form";
import { zodResolver } from"@hookform/resolvers/zod";
import * as z from"zod";
import { api } from"@/lib/api";
import { Button } from"@/components/ui/button";
import { PasswordInput } from"./PasswordInput";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from"@/components/ui/form";
import { toast } from"sonner";
import { useRouter } from"next/navigation";
import { CheckCircle2 } from"lucide-react";

const resetPasswordSchema = z.object({
	password: z.string().min(8,"Password must be at least 8 characters"),
	confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
	message:"Passwords do not match",
	path: ["confirm_password"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
	token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isSuccess, setIsSuccess] = React.useState(false);

	const form = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password:"",
			confirm_password:"",
		},
	});

	const onSubmit = async (data: ResetPasswordFormValues) => {
		setIsLoading(true);
		try {
			await api.post("/auth/reset-password", {
				token,
				new_password: data.password,
				confirm_password: data.confirm_password,
			});
			setIsSuccess(true);
			toast.success("Password reset successful!");

			// Redirect to login after 2 seconds
			setTimeout(() => {
				router.push("/login");
			}, 2000);
		} catch (error: any) {
			toast.error(
				error.response?.data?.error?.message ||"Failed to reset password. The link may be expired."
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (isSuccess) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 py-6">
				<CheckCircle2 className="h-16 w-16 text-green-500" />
				<div className="text-center space-y-2">
					<p className="font-medium">Password reset successful!</p>
					<p className="text-sm text-muted-foreground">
						Redirecting to login page...
					</p>
				</div>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<PasswordInput placeholder="Enter your new password" {...field} />
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
							<FormLabel>Confirm New Password</FormLabel>
							<FormControl>
								<PasswordInput placeholder="Confirm your new password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full h-10 rounded mb-4" disabled={isLoading}>
					{isLoading ?"Resetting..." :"Reset Password"}
				</Button>
			</form>
		</Form>
	);
}
