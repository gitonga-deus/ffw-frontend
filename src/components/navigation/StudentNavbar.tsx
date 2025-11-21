"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut } from "lucide-react";

export function StudentNavbar() {
	const { user, logout } = useAuth();

	if (!user) return null;

	return (
		<header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
				<div className="flex items-center gap-6 divide-x">
					{/* Logo */}
					<Link href="/students/dashboard" className="flex items-center gap-2 pr-6">
						<Image 
							src="/logo/logo.png" 
							alt="Logo" 
							height={80} 
							width={200} 
							className="h-auto w-auto max-h-[50px]" 
							priority
						/>
					</Link>

					{/* Nav Links */}
					<nav className="hidden md:flex items-center gap-4">
						<Link
							href="/students/dashboard"
							className="text-sm font-medium hover:text-primary transition-colors"
						>
							Dashboard
						</Link>
						{user.is_enrolled && (
							<>
								<Link
									href="/students/course"
									className="text-sm font-medium hover:text-primary transition-colors"
								>
									Course
								</Link>
								<Link
									href="/students/certificate"
									className="text-sm font-medium hover:text-primary transition-colors"
								>
									Certificate
								</Link>
							</>
						)}
					</nav>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="relative h-10 w-10 rounded-full">
							<Avatar className="rounded-lg w-10 h-10">
								<AvatarImage src={user.profile_image_url} alt={user.full_name} className="object-cover" />
								<AvatarFallback>
									{user.full_name.split("").map((n) => n[0]).join("")}
								</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56 mt-3.5">
						<DropdownMenuLabel>
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium">{user.full_name}</p>
								<p className="text-xs text-muted-foreground">{user.email}</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/students/profile" className="cursor-pointer">
								<User className="mr-2 h-4 w-4" />
								Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
							<LogOut className="mr-2 h-4 w-4" />
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header >
	);
}
