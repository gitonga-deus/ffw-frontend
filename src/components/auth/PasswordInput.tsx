"use client";

import * as React from "react";
import { EyeClosed, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.ComponentProps<"input"> {
	className?: string;
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
	const [showPassword, setShowPassword] = React.useState(false);

	return (
		<div className="relative">
			<Input
				type={showPassword ? "text" : "password"}
				className={cn("pr-10", className)}
				{...props}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
				onClick={() => setShowPassword(!showPassword)}
				tabIndex={-1}
			>
				{showPassword ? (
					<EyeOff className="h-4 w-4 text-muted-foreground" />
				) : (
					<EyeClosed className="h-4 w-4 text-muted-foreground" />
				)}
				<span className="sr-only">
					{showPassword ? "Hide password" : "Show password"}
				</span>
			</Button>
		</div>
	);
}
