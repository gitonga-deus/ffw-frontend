"use client";

import { useState, useEffect } from"react";
import { useMutation, useQuery } from"@tanstack/react-query";
import { api } from"@/lib/api";
import { Button } from"@/components/ui/button";
import { PaymentInitiateResponse } from"@/types";
import { toast } from"sonner";
import { CreditCard, Loader2 } from"lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from"@/components/ui/dialog";

interface PaymentButtonProps {
	className?: string;
}

interface CourseInfo {
	price: number;
	currency: string;
	title: string;
}

export function PaymentButton({ className }: PaymentButtonProps) {
	const [showDialog, setShowDialog] = useState(false);

	// Fetch course price from backend
	const { data: courseInfo, isLoading: loadingPrice } = useQuery<CourseInfo>({
		queryKey: ["course-price"],
		queryFn: async () => {
			const response = await api.get("/course");
			return {
				price: response.data.price,
				currency: response.data.currency,
				title: response.data.title,
			};
		},
	});

	const amount = courseInfo?.price || 1000;
	const currency = courseInfo?.currency || "KES";

	const initiatePaymentMutation = useMutation({
		mutationFn: async () => {
			const response = await api.post<PaymentInitiateResponse>("/enrollment/initiate");
			return response.data;
		},
		onSuccess: (data) => {
			// Redirect to iPay Africa payment gateway
			window.location.href = data.payment_url;
		},
		onError: (error: any) => {
			const errorMessage =
				error.response?.data?.error?.message ||
				error.response?.data?.detail ||"Failed to initiate payment";
			toast.error(errorMessage);
		},
	});

	const handlePayment = () => {
		setShowDialog(true);
	};

	const confirmPayment = () => {
		setShowDialog(false);
		initiatePaymentMutation.mutate();
	};

	return (
		<>
			<Button
				onClick={handlePayment}
				disabled={initiatePaymentMutation.isPending || loadingPrice}
				className={`${className} rounded px-6!`}
				size="lg"
			>
				{initiatePaymentMutation.isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Processing...
					</>
				) : loadingPrice ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Loading...
					</>
				) : (
					<>
						<CreditCard className="mr-2 h-4 w-4" />
						Enroll Now - {currency} {amount.toLocaleString()}
					</>
				)}
			</Button>

			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent className="rounded-sm! max-w-xl!">
					<DialogHeader>
						<DialogTitle>Confirm Enrollment</DialogTitle>
						<DialogDescription>
							You will be redirected to iPay Africa to complete your payment of{" "}
							<span className="font-semibold">
								{currency} {amount.toLocaleString()}
							</span>
							.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="bg-muted p-4 space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Course Fee:</span>
								<span className="font-medium">
									{currency} {amount.toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between text-sm font-semibold">
								<span>Total:</span>
								<span>
									{currency} {amount.toLocaleString()}
								</span>
							</div>
						</div>
						<p className="text-sm text-muted-foreground">
							After successful payment, you&apos;ll be asked to provide your digital
							signature to complete the enrollment process.
						</p>
						<div className="flex items-center justify-between gap-4">
							<Button
								variant="outline"
								onClick={() => setShowDialog(false)}
								className="h-10 rounded px-6!"
							>
								Cancel
							</Button>
							<Button
								onClick={confirmPayment}
								disabled={initiatePaymentMutation.isPending}
								className="bg-[#049ad1] hover:bg-[#049ad1]/80 h-10 px-6! rounded"
							>
								{initiatePaymentMutation.isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Processing...
									</>
								) : ("Proceed to Payment"
								)}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
