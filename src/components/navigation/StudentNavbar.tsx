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
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function StudentNavbar() {
	const { user, logout } = useAuth();
	const pathname = usePathname();

	if (!user) return null;

	const isActive = (path: string) => {
		if (path === "/students/dashboard") {
			return pathname === path;
		}
		return pathname?.startsWith(path);
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
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
							className={cn(
								"text-sm font-medium transition-colors relative py-1",
								isActive("/students/dashboard")
									? "text-primary font-semibold bg-muted px-3 py-2 rounded"
									: "text-muted-foreground hover:text-foreground"
							)}
						>
							Dashboard
						</Link>
						{user.is_enrolled && (
							<>
								<Link
									href="/students/course"
									className={cn(
										"text-sm font-medium transition-colors relative py-1",
										isActive("/students/course")
											? "text-primary font-semibold bg-muted px-3 py-2 rounded"
											: "text-muted-foreground hover:text-foreground"
									)}
								>
									Course
								</Link>
								<Link
									href="/students/certificate"
									className={cn(
										"text-sm font-medium transition-colors relative py-1",
										isActive("/students/certificate")
											? "text-primary font-semibold bg-muted px-3 py-2 rounded"
											: "text-muted-foreground hover:text-foreground"
									)}
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
								<AvatarImage 
									src={user.profile_image_url || undefined} 
									alt={user.full_name} 
									className="object-cover" 
								/>
								<AvatarFallback className="bg-primary text-primary-foreground">
									{getInitials(user.full_name)}
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
