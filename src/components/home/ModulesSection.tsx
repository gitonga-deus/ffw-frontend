'use client';

import { useQuery } from '@tanstack/react-query';
import { homeApi } from '@/lib/api/home';
import { ModuleCard } from './ModuleCard';
import { ModuleCardSkeleton } from './ModuleCardSkeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ModulesSection() {
	const {
		data: modules,
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ['modules'],
		queryFn: homeApi.getModules,
	});

	return (
		<section className="py-16 px-4 sm:px-6 lg:px-8 bg-background" aria-labelledby="modules-heading">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 id="modules-heading" className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
						Course Modules
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Explore our comprehensive financial literacy curriculum designed to empower you with essential money management skills.
					</p>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
						{[...Array(6)].map((_, index) => (
							<ModuleCardSkeleton key={index} />
						))}
					</div>
				)}

				{/* Error State */}
				{isError && (
					<div className="flex flex-col items-center justify-center py-12 px-4">
						<div className="rounded-full bg-destructive/10 p-3 mb-4" aria-hidden="true">
							<AlertCircle className="h-6 w-6 text-destructive" />
						</div>
						<h3 className="text-lg font-semibold mb-2">Failed to Load Modules</h3>
						<p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
							{error instanceof Error ? error.message : 'An error occurred while fetching course modules. Please try again.'}
						</p>
						<Button onClick={() => refetch()} variant="outline" aria-label="Retry loading course modules">
							<RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
							Retry
						</Button>
					</div>
				)}

				{/* Empty State */}
				{!isLoading && !isError && modules && modules.length === 0 && (
					<div className="flex flex-col items-center justify-center py-12 px-4">
						<p className="text-lg text-muted-foreground text-center">
							No modules available at the moment. Check back soon!
						</p>
					</div>
				)}

				{/* Success State - Display Modules */}
				{!isLoading && !isError && modules && modules.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
						{modules.map((module) => (
							<ModuleCard key={module.id} module={module} />
						))}
					</div>
				)}
			</div>
		</section>
	);
}
