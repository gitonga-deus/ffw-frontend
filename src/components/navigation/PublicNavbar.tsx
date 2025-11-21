"use client";

import Link from"next/link";
import Image from"next/image";
import { Button } from"@/components/ui/button";

export function PublicNavbar() {
	return (
		<header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
				<Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
					<Image 
						src="/logo/logo.png" 
						alt="Logo" 
						height={80} 
						width={200} 
						className="h-auto w-auto max-h-[50px]" 
						priority
					/>
				</Link>

				<div className="flex items-center gap-3">
					<Button asChild variant="outline" className="h-10 px-6! rounded-xs">
						<Link href="/login">Login</Link>
					</Button>
					<Button asChild className="px-6! h-10 rounded-xs">
						<Link href="/register">Get Started</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
