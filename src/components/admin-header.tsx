"use client";

import { usePathname } from"next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from"@/components/ui/breadcrumb"
import { Separator } from"@/components/ui/separator"
import { SidebarTrigger } from"@/components/ui/sidebar"
import { Button } from"@/components/ui/button"
import { ExternalLink } from"lucide-react"
import Link from"next/link"

// Map route segments to readable labels
const routeLabels: Record<string, string> = {
    admin:"Admin",
    dashboard:"Dashboard",
    users:"Users",
    content:"Content",
    reviews:"Reviews",
    announcements:"Announcements",
    settings:"Settings",
}

export function AdminHeader() {
    const pathname = usePathname()
    
    // Generate breadcrumbs from pathname
    const generateBreadcrumbs = () => {
        const segments = pathname.split("/").filter(Boolean)
        const breadcrumbs = []
        
        // Build breadcrumbs from segments
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i]
            let href = "/" + segments.slice(0, i + 1).join("/")
            
            // Fix: Redirect /admin to /admin/dashboard
            if (href === "/admin") {
                href = "/admin/dashboard"
            }
            
            const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
            
            // Use index as part of key to ensure uniqueness
            breadcrumbs.push({ label, href, key: `${href}-${i}` })
        }
        
        return breadcrumbs
    }
    
    const breadcrumbs = generateBreadcrumbs()
    
    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
                <BreadcrumbList className="">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={crumb.key} className="flex items-center">
                            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                            <BreadcrumbItem className="hidden md:block pl-4 items-center!">
                                {index === breadcrumbs.length - 1 ? (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={crumb.href}>
                                        {crumb.label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </div>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto pr-2">
                <Button asChild variant="outline" size="sm" className="h-9">
                    <Link href="/">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Site
                    </Link>
                </Button>
            </div>
        </header>
    )
}
