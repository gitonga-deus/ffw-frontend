import Link from"next/link";
import Image from"next/image";
import { RegisterForm } from"@/components/auth/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";

export default function RegisterPage() {
	return (
		<div className="min-h-screen flex items-center justify-center py-24 bg-linear-to-br from-background to-muted/60">
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
						Enter your details to get started with the course
					</CardDescription>
				</CardHeader>
				<CardContent>
					<RegisterForm />
					<div className="mt-4 text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/login" className="text-primary hover:underline hover:underline-offset-4 font-medium">
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
