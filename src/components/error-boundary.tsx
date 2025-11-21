'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('Error caught by boundary:', error, errorInfo);
	}

	reset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError && this.state.error) {
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback;
				return <FallbackComponent error={this.state.error} reset={this.reset} />;
			}

			return <DefaultErrorFallback error={this.state.error} reset={this.reset} />;
		}

		return this.props.children;
	}
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="max-w-lg! w-full rounded-sm shadow-xs">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-destructive" />
						<CardTitle>Something went wrong</CardTitle>
					</div>
					<CardDescription>
						An unexpected error occurred. Please try again.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="bg-muted p-3">
						<p className="text-sm font-mono text-muted-foreground break-all">
							{error.message}
						</p>
					</div>
				</CardContent>
				<CardFooter className="flex! justify-between! items-center! gap-2">
					<Button onClick={reset} variant="default" className='rounded h-10 px-6!'>
						Try again
					</Button>
					<Button onClick={() => window.location.href = '/'} variant="outline" className='rounded h-10 px-6!'>
						Go home
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
