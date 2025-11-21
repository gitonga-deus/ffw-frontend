"use client";

import { Progress } from"@/components/ui/progress";
import { Card, CardContent } from"@/components/ui/card";
import { CheckCircle2, Clock } from"lucide-react";

interface ProgressBarProps {
	progressPercentage: number;
	completedModules: number;
	totalModules: number;
	timeSpent?: number;
	showDetails?: boolean;
}

export function ProgressBar({
	progressPercentage,
	completedModules,
	totalModules,
	timeSpent,
	showDetails = true,
}: ProgressBarProps) {
	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	};

	return (
		<Card className="shadow-xs">
			<CardContent className="pt-6">
				<div className="space-y-4">
					{/* Progress Bar */}
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium">Course Progress</span>
							<span className="text-2xl font-bold">{progressPercentage}%</span>
						</div>
						<Progress value={progressPercentage} className="h-3" />
					</div>

					{/* Details */}
					{/* {showDetails && (
						<div className="grid grid-cols-2 gap-4 pt-2">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-green-500" />
								<div>
									<div className="text-sm font-medium">
										{completedModules}/{totalModules}
									</div>
									<div className="text-xs text-muted-foreground">Modules</div>
								</div>
							</div>

							{timeSpent !== undefined && (
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-blue-500" />
									<div>
										<div className="text-sm font-medium">{formatTime(timeSpent)}</div>
										<div className="text-xs text-muted-foreground">Time Spent</div>
									</div>
								</div>
							)}
						</div>
					)} */}
				</div>
			</CardContent>
		</Card>
	);
}
