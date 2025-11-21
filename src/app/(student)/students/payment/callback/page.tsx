"use client";

import { useEffect, useState } from"react";
import { useRouter, useSearchParams } from"next/navigation";
import { useQuery } from"@tanstack/react-query";
import { api } from"@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from"lucide-react";
import Link from"next/link";
import { EnrollmentStatusResponse } from"@/types";

export default function PaymentCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [checkCount, setCheckCount] = useState(0);

    // Get status from URL params (if iPay sends it)
    const urlStatus = searchParams.get("status");

    // Poll enrollment status to check if payment was processed
    const { data: enrollmentStatus, isLoading } = useQuery<EnrollmentStatusResponse>({
        queryKey: ["enrollment-status", checkCount],
        queryFn: async () => {
            const response = await api.get("/enrollment/status");
            return response.data;
        },
        refetchInterval: (query) => {
            // Stop polling after 10 attempts or if enrolled
            if (checkCount >= 10 || query.state.data?.is_enrolled) {
                return false;
            }
            return 3000; // Poll every 3 seconds
        },
    });

    useEffect(() => {
        if (enrollmentStatus && enrollmentStatus.is_enrolled) {
            // Payment successful, check if signature is needed
            if (!enrollmentStatus.has_signature) {
                // Redirect to signature page after a short delay
                setTimeout(() => {
                    router.push("/students/signature");
                }, 2000);
            }
        }
    }, [enrollmentStatus, router]);

    useEffect(() => {
        // Increment check count for polling
        const interval = setInterval(() => {
            setCheckCount((prev) => prev + 1);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    if (isLoading && checkCount === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md rounded-sm shadow-xs">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                            <h2 className="text-xl font-semibold">Processing Payment...</h2>
                            <p className="text-muted-foreground">
                                Please wait while we verify your payment
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Payment successful
    if (enrollmentStatus?.is_enrolled) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-green-200 rounded-sm shadow-xs">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle className="text-center text-2xl">Payment Successful!</CardTitle>
                        <CardDescription className="text-center">
                            Your enrollment has been confirmed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-center">
                                {enrollmentStatus.has_signature
                                    ?"You're all set! You can now access the course content."
                                    :"Next step: Please provide your digital signature to complete the enrollment process."}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {!enrollmentStatus.has_signature ? (
                                <Button asChild className="w-full">
                                    <Link href="/students/signature">Continue to Signature</Link>
                                </Button>
                            ) : (
                                <Button asChild className="w-full">
                                    <Link href="/students/course">Go to Course</Link>
                                </Button>
                            )}
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/students/dashboard">Go to Dashboard</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Payment failed or pending
    const isFailed =
        urlStatus ==="failed" ||
        (checkCount >= 10 && !enrollmentStatus?.is_enrolled);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-red-200 rounded-sm shadow-xs">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        {isFailed ? (
                            <XCircle className="h-16 w-16 text-red-500" />
                        ) : (
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        )}
                    </div>
                    <CardTitle className="text-center text-2xl">
                        {isFailed ?"Payment Failed" :"Verifying Payment..."}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isFailed
                            ?"We couldn't process your payment"
                            :"Please wait while we confirm your payment"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isFailed ? (
                        <>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-center">
                                    Your payment was not successful. Please try again or contact support
                                    if you believe this is an error.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button asChild className="w-full">
                                    <Link href="/students/dashboard">Try Again</Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/">Back to Home</Link>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                This may take a few moments...
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
