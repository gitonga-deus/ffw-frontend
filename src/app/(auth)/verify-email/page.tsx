"use client";

import * as React from"react";
import { Suspense } from"react";
import { useSearchParams, useRouter } from"next/navigation";
import Image from"next/image";
import { api } from"@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from"lucide-react";
import Link from"next/link";
import { Skeleton } from"@/components/ui/skeleton";

function VerifyEmailContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [status, setStatus] = React.useState<"loading" |"success" |"error">("loading");
	const [message, setMessage] = React.useState("");

	React.useEffect(() => {
		const token = searchParams.get("token");

		if (!token) {
			setStatus("error");
			setMessage("Verification token is missing. Please check your email link.");
			return;
		}

		const verifyEmail = async () => {
			try {
				const response = await api.post("/auth/verify-email", { token });
				setStatus("success");
				setMessage(response.data.message ||"Your email has been verified successfully!");

				// Redirect to login after 3 seconds
				setTimeout(() => {
					router.push("/login");
				}, 3000);
			} catch (error: any) {
				setStatus("error");
				setMessage(
					error.response?.data?.error?.message ||"Failed to verify email. The link may be expired or invalid."
				);
			}
		};

		verifyEmail();
	}, [searchParams, router]);

	return (
		<Card className="w-full max-w-lg rounded-md">
			<CardHeader className="space-y-1">
				<div className="flex justify-center mb-4">
					<Link href="/" className="hover:opacity-80 transition-opacity">
						<Image 
							src="/logo/logo.png" 
							alt="Logo" 
							height={80} 
							width={200} 
							className="h-auto w-auto max-h-[60px]" 
							priority
						/>
					</Link>
				</div>
				<CardDescription className="text-center">
					{status ==="loading" &&"Verifying your email address..."}
					{status ==="success" &&"Your account is now active"}
					{status ==="error" &&"Verification failed"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center justify-center space-y-4 py-4">
					{status ==="loading" && (
						<Loader2 className="h-16 w-16 text-primary animate-spin" />
					)}
					{status ==="success" && (
						<CheckCircle2 className="h-16 w-16 text-green-500" />
					)}
					{status ==="error" && (
						<XCircle className="h-16 w-16 text-destructive" />
					)}

					<p className="text-center text-muted-foreground">{message}</p>

					{status ==="success" && (
						<p className="text-sm text-muted-foreground">
							Redirecting to login page...
						</p>
					)}

					{status ==="error" && (
						<div className="flex flex-col gap-2 w-full">
							<Button asChild className="w-full h-10 rounded">
								<Link href="/login">Go to Login</Link>
							</Button>
							<Button asChild variant="outline" className="w-full h-10 rounded">
								<Link href="/register">Register Again</Link>
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export default function VerifyEmailPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
			<Suspense fallback={
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1">
						<Skeleton className="h-8 w-48 mx-auto" />
						<Skeleton className="h-4 w-64 mx-auto" />
					</CardHeader>
					<CardContent>
						<div className="flex flex-col items-center justify-center space-y-4 py-6">
							<Loader2 className="h-16 w-16 text-primary animate-spin" />
						</div>
					</CardContent>
				</Card>
			}>
				<VerifyEmailContent />
			</Suspense>
		</div>
	);
}
