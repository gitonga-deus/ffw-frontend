"use client";

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

const loginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(1,"Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
	const { login, isLoginLoading } = useAuth();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email:"",
			password:"",
		},
	});

	const onSubmit = (data: LoginFormValues) => {
		login(data);
	};

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

				<Button type="submit" className="w-full h-10 rounded" disabled={isLoginLoading}>
					{isLoginLoading ?"Signing in..." :"Sign In"}
				</Button>
			</form>
		</Form>
	);
}
