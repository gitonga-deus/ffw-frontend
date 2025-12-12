"use client";

import { useEffect, useRef, useState } from"react";
import { Content } from"@/types";
import { Loader2, AlertCircle, RefreshCw } from"lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
	content: Content;
}

interface VimeoPlayer {
	on: (event: string, callback: (data: any) => void) => void;
	off: (event: string, callback?: (data: any) => void) => void;
	setCurrentTime: (seconds: number) => Promise<number>;
	getDuration: () => Promise<number>;
	getCurrentTime: () => Promise<number>;
	getPaused: () => Promise<boolean>;
	destroy: () => Promise<void>;
	ready: () => Promise<void>;
}

declare global {
	interface Window {
		Vimeo?: {
			Player: new (element: HTMLIFrameElement) => VimeoPlayer;
		};
	}
}

// Type guard for Vimeo
function hasVimeo(win: Window): win is Window & { Vimeo: { Player: new (element: HTMLIFrameElement) => VimeoPlayer } } {
	return 'Vimeo' in win && win.Vimeo !== undefined;
}

export function VideoPlayer({ content }: VideoPlayerProps) {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [retryKey, setRetryKey] = useState(0);

	const playerRef = useRef<VimeoPlayer | null>(null);

	// Simple: Load script and initialize player in one effect
	useEffect(() => {
		if (typeof window === 'undefined' || !iframeRef.current) return;

		let mounted = true;
		let vimeoPlayer: VimeoPlayer | null = null;

		const loadAndInit = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Load Vimeo script if not already loaded
				if (!hasVimeo(window)) {
					const existingScript = document.querySelector('script[src*="player.vimeo.com"]');
					
					if (!existingScript) {
						const script = document.createElement("script");
						script.src = "https://player.vimeo.com/api/player.js";
						document.body.appendChild(script);
						
						await new Promise((resolve, reject) => {
							script.onload = resolve;
							script.onerror = reject;
						});
					} else {
						// Wait for existing script to load
						await new Promise<void>((resolve) => {
							const check = setInterval(() => {
								if (hasVimeo(window)) {
									clearInterval(check);
									resolve();
								}
							}, 50);
						});
					}
				}

				if (!mounted || !hasVimeo(window)) return;

				// Initialize player
				vimeoPlayer = new window.Vimeo.Player(iframeRef.current!);
				playerRef.current = vimeoPlayer;

				await vimeoPlayer.ready();

				if (!mounted) {
					await vimeoPlayer.destroy();
					return;
				}

				setIsLoading(false);

				// Track errors
				vimeoPlayer.on("error", (data: any) => {
					console.error("Vimeo error:", data);
					setError("Error playing video");
				});

			} catch (err) {
				console.error("Failed to load video:", err);
				if (mounted) {
					setError("Failed to load video player");
					setIsLoading(false);
				}
			}
		};

		loadAndInit();

		return () => {
			mounted = false;

			if (vimeoPlayer) {
				vimeoPlayer.destroy().catch(() => {});
			}
			
			playerRef.current = null;
		};
	}, [content.vimeo_video_id, retryKey]);

	if (!content.vimeo_video_id) {
		return (
			<div className="aspect-video bg-muted flex items-center justify-center">
				<div className="text-center">
					<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
					<p className="text-muted-foreground">Video not available</p>
				</div>
			</div>
		);
	}

	const handleRetry = () => {
		setError(null);
		setIsLoading(true);
		setRetryKey(prev => prev + 1);
	};

	if (error) {
		return (
			<div className="aspect-video bg-muted flex items-center justify-center">
				<div className="text-center space-y-4">
					<AlertCircle className="h-12 w-12 text-destructive mx-auto" />
					<div>
						<p className="text-destructive font-medium">{error}</p>
						<p className="text-sm text-muted-foreground mt-1">Please try again or refresh the page</p>
					</div>
					<Button onClick={handleRetry} variant="outline">
						<RefreshCw className="mr-2 h-4 w-4" />
						Retry
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<div className="aspect-video bg-black overflow-hidden relative">
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
						<Loader2 className="h-8 w-8 text-white animate-spin" />
					</div>
				)}
				<iframe
					key={content.vimeo_video_id}
					ref={iframeRef}
					src={`https://player.vimeo.com/video/${content.vimeo_video_id}?title=0&byline=0&portrait=0`}
					className="w-full h-full"
					allow="autoplay; fullscreen; picture-in-picture"
					allowFullScreen
					title={content.title}
				/>
			</div>
		</div>
	);
}
