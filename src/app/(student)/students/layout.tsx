"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StudentNavbar } from "@/components/navigation/StudentNavbar";
import { PublicFooter } from "@/components/navigation";

export default function StudentLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isAuthenticated, isLoading, logout } = useAuth();
	const router = useRouter();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (mounted && !isLoading && !isAuthenticated) {
			router.push("/login");
		} else if (mounted && !isLoading && user && user.role === "admin") {
			// Redirect admin users to admin dashboard
			router.push("/admin/dashboard");
		}
	}, [isAuthenticated, isLoading, user, router, mounted]);

	if (!mounted || isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated || !user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-background">
			<StudentNavbar />
			<main className="pb-10">{children}</main>
			<PublicFooter />
		</div>
	);
}
