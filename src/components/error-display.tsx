import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorDisplayProps {
	title?: string;
	message?: string;
	onRetry?: () => void;
	showHomeButton?: boolean;
}

export function ErrorDisplay({
	title = 'Something went wrong',
	message = 'An error occurred while loading this content. Please try again.',
	onRetry,
	showHomeButton = true,
}: ErrorDisplayProps) {
	return (
		<div className="flex items-center justify-center min-h-[400px] p-4">
			<Card className="max-w-md w-full">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-destructive" />
						<CardTitle>{title}</CardTitle>
					</div>
					<CardDescription>{message}</CardDescription>
				</CardHeader>
				<CardFooter className="flex justify-between gap-2">
					{onRetry && (
						<Button onClick={onRetry} variant="default">
							<RefreshCw className="mr-2 h-4 w-4" />
							Try again
						</Button>
					)}
					{showHomeButton && (
						<Button onClick={() => (window.location.href = '/')} variant="outline" className='rouned'>
							<Home className="mr-2 h-4 w-4" />
							Go home
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}

export function InlineError({
	message,
	onRetry,
}: {
	message: string;
	onRetry?: () => void;
}) {
	return (
		<div className="flex items-center justify-center p-8 border border-destructive/20 rounded-lg bg-destructive/5">
			<div className="text-center space-y-3">
				<div className="flex items-center justify-center gap-2 text-destructive">
					<AlertTriangle className="h-5 w-5" />
					<p className="font-medium">{message}</p>
				</div>
				{onRetry && (
					<Button onClick={onRetry} variant="outline" className="rounded px-6!">
						<RefreshCw className="mr-2 h-4 w-4" />
						Retry
					</Button>
				)}
			</div>
		</div>
	);
}

export function EmptyState({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
			<div className="space-y-3">
				<h3 className="text-lg font-semibold">{title}</h3>
				{description && (
					<p className="text-sm text-muted-foreground max-w-md">{description}</p>
				)}
				{action && <div className="pt-4">{action}</div>}
			</div>
		</div>
	);
}
