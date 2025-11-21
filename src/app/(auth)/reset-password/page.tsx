"use client";

import * as React from"react";
import { Suspense } from"react";
import { useSearchParams } from"next/navigation";
import { ForgotPasswordForm } from"@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from"@/components/auth/ResetPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Skeleton } from"@/components/ui/skeleton";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    return (
        <Card className="w-full max-w-lg rounded-sm shadow-xs">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                    {token ?"Reset Your Password" :"Forgot Password"}
                </CardTitle>
                <CardDescription className="text-center">
                    {token
                        ?"Enter your new password below"
                        :"Enter your email to receive a password reset link"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {token ? <ResetPasswordForm token={token} /> : <ForgotPasswordForm />}
            </CardContent>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
            <Suspense fallback={
                <Card className="w-full max-w-lg rounded-sm shadow-xs">
                    <CardHeader className="space-y-1">
                        <Skeleton className="h-8 w-48 mx-auto" />
                        <Skeleton className="h-4 w-64 mx-auto" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            }>
                <ResetPasswordContent />
            </Suspense>
        </div>
    );
}
