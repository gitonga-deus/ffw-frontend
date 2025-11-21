"use client";

import { LogOut, User as UserIcon, Settings } from"lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from"@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from"@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from"@/components/ui/sidebar";
import { useAuth } from"@/hooks/use-auth";
import { ChevronUp } from"lucide-react";

export function NavUser() {
	const { isMobile } = useSidebar();
	const { user, logout } = useAuth();

	if (!user) {
		return null;
	}

	// Get user initials for avatar fallback
	const initials = user.full_name
		.split("")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-2"
						>
							<Avatar className="h-10 w-10 rounded-full">
								<AvatarImage src={user.profile_image_url} alt={user.full_name} />
								<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.full_name}</span>
								<span className="truncate text-xs text-muted-foreground">
									{user.email}
								</span>
							</div>
							<ChevronUp className="ml-auto h-4 w-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded ml-2"
						side={isMobile ?"bottom" :"right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-full">
									<AvatarImage src={user.profile_image_url} alt={user.full_name} />
									<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.full_name}</span>
									<span className="truncate text-xs text-muted-foreground">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						{/* <DropdownMenuSeparator /> */}
						{/* <DropdownMenuGroup>
							<DropdownMenuItem>
								<UserIcon className="h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="h-4 w-4" />
								Settings
							</DropdownMenuItem>
						</DropdownMenuGroup> */}
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={logout} variant="destructive" className="h-9 rounded">
							<LogOut className="h-4 w-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
