"use client";

import { Suspense, useEffect, useState } from"react";
import { useSearchParams } from"next/navigation";
import { useAuth } from"@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { CheckCircle, Loader2, AlertCircle } from"lucide-react";
import Link from"next/link";
import { api } from"@/lib/api";

interface PaymentStatus {
	id: string;
	amount: string;
	currency: string;
	status: string;
	payment_method: string | null;
	ipay_transaction_id: string | null;
	created_at: string;
}

function SuccessContent() {
	const searchParams = useSearchParams();
	const { refetchUser } = useAuth();
	const [loading, setLoading] = useState(true);
	const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
	const [error, setError] = useState<string | null>(null);
	const transactionId = searchParams.get("transaction_id");

	useEffect(() => {
		// Refetch user data and payment status
		const refreshData = async () => {
			try {
				await refetchUser();
				
				// Fetch actual payment status from API
				const response = await api.get<PaymentStatus[]>("/payments/my-history");
				
				// Get the most recent payment (should be the one we just made)
				if (response.data && response.data.length > 0) {
					const latestPayment = response.data[0];
					setPaymentStatus(latestPayment);
				}
				
				// Wait a bit to ensure payment is fully processed
				setTimeout(() => {
					setLoading(false);
				}, 1500);
			} catch (err) {
				console.error("Error fetching payment status:", err);
				setError("Could not verify payment status");
				setLoading(false);
			}
		};

		refreshData();
	}, [refetchUser]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Card className="w-full max-w-md shadow-xs mx-4">
					<CardContent className="pt-6">
						<div className="flex flex-col items-center justify-center py-8">
							<Loader2 className="h-16 w-16 text-green-600 animate-spin mb-4" />
							<p className="text-lg font-medium">Processing your payment...</p>
							<p className="text-sm text-muted-foreground mt-2">Please wait</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
			<Card className="w-full max-w-md shadow-xs">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
						<CheckCircle className="h-10 w-10 text-green-600" />
					</div>
					<CardTitle className="text-2xl">Payment Successful!</CardTitle>
					<CardDescription>
						Your enrollment has been confirmed
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && (
						<div className="bg-yellow-50 border border-yellow-200 p-4 flex items-start gap-2">
							<AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
							<div className="text-sm text-yellow-800">{error}</div>
						</div>
					)}
					
					<div className="bg-muted p-4 space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Status:</span>
							<span className={`font-medium capitalize ${
								paymentStatus?.status === 'completed' ? 'text-green-600' : 
								paymentStatus?.status === 'pending' ? 'text-yellow-600' : 
								'text-red-600'
							}`}>
								{paymentStatus?.status || 'Processing...'}
							</span>
						</div>
						{(transactionId || paymentStatus?.ipay_transaction_id) && (
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Transaction ID:</span>
								<span className="font-mono text-xs">
									{paymentStatus?.ipay_transaction_id || transactionId}
								</span>
							</div>
						)}
						{paymentStatus && (
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Amount:</span>
								<span className="font-medium">
									{paymentStatus.currency} {paymentStatus.amount}
								</span>
							</div>
						)}
					</div>

					<div className="space-y-2 text-sm text-muted-foreground">
						{paymentStatus?.status === 'completed' ? (
							<>
								<p>- Payment processed successfully</p>
								<p>- Enrollment confirmed</p>
								<p className="font-medium text-orange-600 mt-2">Next: Complete your signature</p>
							</>
						) : paymentStatus?.status === 'pending' ? (
							<>
								<p>- Payment is being processed</p>
								<p>- Please wait for confirmation</p>
								<p className="font-medium text-yellow-600 mt-2">This may take a few moments</p>
							</>
						) : (
							<>
								<p>- Payment verification in progress</p>
								<p>- You will receive an email confirmation</p>
							</>
						)}
					</div>

					<div className="pt-4 space-y-2">
						{paymentStatus?.status === 'completed' ? (
							<>
								<Button asChild className="w-full h-10 bg-[#049ad1] hover:bg-[#049ad1]/80 rounded">
									<Link href="/students/signature">Complete Signature</Link>
								</Button>
								<Button asChild variant="outline" className="w-full h-10 rounded">
									<Link href="/students/dashboard">Go to Dashboard</Link>
								</Button>
							</>
						) : (
							<>
								<Button asChild variant="outline" className="w-full h-10 rounded">
									<Link href="/students/dashboard">Go to Dashboard</Link>
								</Button>
								<p className="text-xs text-center text-muted-foreground mt-2">
									Refresh the page to check payment status
								</p>
							</>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function EnrollmentSuccessPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		}>
			<SuccessContent />
		</Suspense>
	);
}
