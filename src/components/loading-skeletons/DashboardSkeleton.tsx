import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function DashboardSkeleton() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
				{/* Welcome Section Skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-9 w-72" />
					<Skeleton className="h-5 w-64" />
				</div>

				{/* Status Banner Skeleton */}
				<Card className="shadow-xs animate-pulse">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-12 h-12">
								<Skeleton className="w-12 h-12 rounded-full" />
							</div>
							<div className="flex-1 space-y-2">
								<Skeleton className="h-6 w-56" />
								<Skeleton className="h-4 w-full max-w-md" />
							</div>
						</div>
					</CardHeader>
				</Card>

				{/* Stats Cards Skeleton */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
					{[...Array(4)].map((_, i) => (
						<Card key={i} className="shadow-xs animate-pulse">
							<CardHeader className="pb-3">
								<Skeleton className="h-4 w-32" />
							</CardHeader>
							<CardContent className="space-y-2">
								<Skeleton className="h-8 w-28" />
								<Skeleton className="h-2 w-full" />
								<Skeleton className="h-3 w-40" />
							</CardContent>
						</Card>
					))}
				</div>

				{/* Quick Actions Skeleton */}
				<Card className="shadow-xs animate-pulse">
					<CardHeader>
						<Skeleton className="h-6 w-36 mb-2" />
						<Skeleton className="h-4 w-72" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{/* Action Buttons Skeleton */}
							<div className="flex flex-wrap gap-4">
								<Skeleton className="h-10 w-44" />
								<Skeleton className="h-10 w-52" />
							</div>

							{/* Progress Display Skeleton */}
							<div className="pt-4 border-t space-y-2">
								<div className="flex items-center justify-between">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-12" />
								</div>
								<Skeleton className="h-2 w-full" />
								<Skeleton className="h-3 w-48" />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Announcements Skeleton */}
				<Card className="shadow-xs animate-pulse">
					<CardHeader>
						<Skeleton className="h-6 w-40 mb-2" />
						<Skeleton className="h-4 w-60" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{[...Array(3)].map((_, i) => (
								<div key={i}>
									{i > 0 && <Separator className="my-4" />}
									<div className="space-y-2">
										<div className="flex items-start justify-between gap-4">
											<Skeleton className="h-5 w-56 flex-1" />
											<Skeleton className="h-4 w-24" />
										</div>
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-5/6" />
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
