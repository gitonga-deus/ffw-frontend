"use client";

import * as React from"react";
import { Suspense } from"react";
import { useSearchParams } from"next/navigation";
import Link from"next/link";
import Image from"next/image";
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background to-muted/20">
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
