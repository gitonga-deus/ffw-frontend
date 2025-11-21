"use client";

import Link from"next/link";
import { usePathname } from"next/navigation";
import {
	LayoutDashboard,
	BarChart3,
	Users,
	FileText,
	MessageSquare,
	Megaphone,
	Settings,
	type LucideIcon,
} from"lucide-react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from"@/components/ui/sidebar";

interface NavItem {
	title: string;
	url: string;
	icon: LucideIcon;
}

const navItems: NavItem[] = [
	{
		title:"Dashboard",
		url:"/admin/dashboard",
		icon: LayoutDashboard,
	},
	{
		title:"Analytics",
		url:"/admin/analytics",
		icon: BarChart3,
	},
	{
		title:"Users",
		url:"/admin/users",
		icon: Users,
	},
	{
		title:"Content",
		url:"/admin/content",
		icon: FileText,
	},
	{
		title:"Reviews",
		url:"/admin/reviews",
		icon: MessageSquare,
	},
	{
		title:"Announcements",
		url:"/admin/announcements",
		icon: Megaphone,
	},
	{
		title:"Settings",
		url:"/admin/settings",
		icon: Settings,
	},
];

export function NavMain() {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{navItems.map((item) => {
						const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
									<Link href={item.url}>
										<item.icon className="h-4 w-4" />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
