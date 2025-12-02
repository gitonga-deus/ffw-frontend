"use client";

import { useEffect, useState } from"react";
import { useRouter } from"next/navigation";
import Image from"next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Mail, ArrowRight, CheckCircle } from"lucide-react";
import Link from"next/link";

export default function CheckEmailPage() {
	const router = useRouter();
	const [countdown, setCountdown] = useState(5);

	useEffect(() => {
		// Countdown timer
		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// Separate effect for navigation
	useEffect(() => {
		if (countdown <= 0) {
			router.push("/login");
		}
	}, [countdown, router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
			<Card className="w-full max-w-lg! shadow-xs">
				<CardHeader className="text-center mt-6">
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
					<CardTitle className="text-2xl">Check Your Email</CardTitle>
					<CardDescription>
						We've sent you a verification link
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<div className="flex items-start gap-4 text-sm">
							<CheckCircle className="h-5 w-5 text-green-600 mt-1 shrink-0" />
							<div>
								<p className="font-medium">Registration successful!</p>
								<p className="text-muted-foreground">Your account has been created.</p>
							</div>
						</div>

						<div className="flex items-start gap-4 text-sm">
							<Mail className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
							<div className="space-y-1">
								<p className="font-medium">Verification email sent</p>
								<p className="text-muted-foreground">
									Check your inbox and click the verification link to activate your account.
								</p>
							</div>
						</div>
					</div>

					<div className="text-center text-sm text-muted-foreground">
						<p>Redirecting to login in {countdown} seconds...</p>
					</div>

					<div className="space-y-4">
						<Button asChild className="w-full h-10 rounded bg-[#049ad1] hover:bg-[#049ad1]/80">
							<Link href="/login">
								Go to Login
							</Link>
						</Button>
						<Button asChild variant="outline" className="w-full h-10 rounded">
							<Link href="/">Go to Home</Link>
						</Button>
					</div>

					<div className="text-center text-sm text-muted-foreground">
						<p>Didn't receive the email?</p>
						<p className="mt-2">Check your spam folder or contact support</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
