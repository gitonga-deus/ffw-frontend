"use client";

import * as React from"react";
import { useForm } from"react-hook-form";
import { zodResolver } from"@hookform/resolvers/zod";
import * as z from"zod";
import { api } from"@/lib/api";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from"@/components/ui/form";
import { toast } from"sonner";
import Link from"next/link";
import { CheckCircle2 } from"lucide-react";

const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
	const [isLoading, setIsLoading] = React.useState(false);
	const [isSuccess, setIsSuccess] = React.useState(false);

	const form = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email:"",
		},
	});

	const onSubmit = async (data: ForgotPasswordFormValues) => {
		setIsLoading(true);
		try {
			await api.post("/auth/forgot-password", data);
			setIsSuccess(true);
			toast.success("Password reset link sent! Check your email.");
		} catch (error: any) {
			toast.error(
				error.response?.data?.error?.message ||"Failed to send reset link. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (isSuccess) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 py-6">
				<CheckCircle2 className="h-12 w-12 text-green-500" />
				<div className="text-center space-y-2">
					<p className="font-medium">Check your email</p>
					<p className="text-sm text-muted-foreground">
						We&apos;ve sent a password reset link to your email address.
					</p>
				</div>
				<Button asChild variant="outline" className="w-full">
					<Link href="/login">Back to Login</Link>
				</Button>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

				<Button type="submit" className="w-full h-10 rounded" disabled={isLoading}>
					{isLoading ?"Sending..." :"Send Reset Link"}
				</Button>

				<div className="text-center text-sm">
					<Link href="/login" className="text-muted-foreground hover:text-primary hover:underline hover:underline-offset-4">
						Back to Login
					</Link>
				</div>
			</form>
		</Form>
	);
}
