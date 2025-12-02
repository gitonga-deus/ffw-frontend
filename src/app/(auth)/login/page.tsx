import Link from"next/link";
import Image from"next/image";
import { LoginForm } from"@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader } from"@/components/ui/card";

export default function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background to-muted/60">
			<Card className="w-full max-w-lg">
				<CardHeader className="space-y-1">
					<div className="flex justify-center mb-4 pt-6">
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
						Sign in to your account to continue learning
					</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginForm />
					<div className="mt-4 space-y-2 text-center text-sm">
						<Link
							href="/reset-password"
							className="text-muted-foreground hover:text-primary hover:underline hover:underline-offset-4 block"
						>
							Forgot your password?
						</Link>
						<div>
							Don&apos;t have an account?{" "}
							<Link href="/register" className="text-primary hover:underline hover:underline-offset-4 font-semibold">
								Sign up
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
