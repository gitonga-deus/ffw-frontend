"use client";

import { Suspense } from"react";
import { useSearchParams } from"next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { XCircle } from"lucide-react";
import Link from"next/link";

function FailedContent() {
	const searchParams = useSearchParams();
	const transactionId = searchParams.get("transaction_id");

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
						<XCircle className="h-10 w-10 text-red-600" />
					</div>
					<CardTitle className="text-2xl">Payment Failed</CardTitle>
					<CardDescription>
						We couldn't process your payment
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="bg-muted p-4 space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Status:</span>
							<span className="font-medium text-red-600">Failed</span>
						</div>
						{transactionId && (
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Transaction ID:</span>
								<span className="font-mono text-xs">{transactionId}</span>
							</div>
						)}
					</div>

					<div className="space-y-2 text-sm text-muted-foreground">
						<p className="font-medium text-foreground">What happened?</p>
						<p>• {" "} Payment was not completed</p>
						<p>• No charges were made to your account</p>
						<p>• You can try again</p>
					</div>

					<div className="pt-4 space-y-2">
						<Button asChild className="w-full rounded h-10">
							<Link href="/enroll">Try Again</Link>
						</Button>
						<Button asChild variant="outline" className="w-full rounded h-10">
							<Link href="/">Go to Home</Link>
						</Button>
					</div>

					<div className="text-center text-sm text-muted-foreground">
						<p>Need help? Contact support</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function EnrollmentFailedPageWrapper() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
			</div>
		}>
			<FailedContent />
		</Suspense>
	);
}
