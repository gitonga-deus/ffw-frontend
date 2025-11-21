"use client";

import * as React from"react"
import Link from"next/link"
import Image from"next/image"
import { usePathname } from"next/navigation"
import {
	LayoutDashboard,
	Users,
	Star,
	Megaphone,
	Settings,
	NotebookPen,
} from"lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from"@/components/ui/sidebar"
import { NavUser } from"@/components/nav-user"

// Navigation items for the admin dashboard
const navigationItems = [
	{
		title:"Dashboard",
		url:"/admin/dashboard",
		icon: LayoutDashboard,
	},
	{
		title:"Users",
		url:"/admin/users",
		icon: Users,
	},
	{
		title:"Content",
		url:"/admin/content",
		icon: NotebookPen,
	},
	{
		title:"Reviews",
		url:"/admin/reviews",
		icon: Star,
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
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname()

	return (
		<Sidebar {...props}>
			<SidebarHeader className="h-16 items-center py-4 px-4 border-b">
				<Link href="/admin/dashboard" className="flex items-center justify-center">
					<Image 
						src="/logo/logo.png" 
						alt="Logo" 
						height={80} 
						width={200} 
						className="h-auto w-auto max-h-[40px]" 
						priority
					/>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu className="mt-2 space-y-1">
							{navigationItems.map((item) => {
								const isActive = pathname === item.url || pathname.startsWith(item.url +"/")
								
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={isActive} className="h-9! rounded! px-2!">
											<Link 
												href={item.url}
												className={isActive ? "bg-[#049ad1]! text-white! hover:bg-[#049ad1]/90 hover:text-white" : ""}
											>
												<item.icon className="h-4 w-4" />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="border-t">
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
