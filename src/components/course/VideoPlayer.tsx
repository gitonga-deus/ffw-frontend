"use client";

import { useEffect, useRef, useState, useCallback } from"react";
import { Content } from"@/types";
import { Loader2, AlertCircle } from"lucide-react";

interface VideoPlayerProps {
	content: Content;
	onProgress?: (timeSpent: number, lastPosition: number) => void;
	onComplete?: () => void;
	initialPosition?: number;
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

export function VideoPlayer({
	content,
	onProgress,
	onComplete,
	initialPosition = 0
}: VideoPlayerProps) {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [player, setPlayer] = useState<VimeoPlayer | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isCompleted, setIsCompleted] = useState(false);
	const [watchedPercentage, setWatchedPercentage] = useState(0);
	const [scriptLoaded, setScriptLoaded] = useState(false);
	const [isPlayerReady, setIsPlayerReady] = useState(false);

	const startTimeRef = useRef<number>(Date.now());
	const lastPositionRef = useRef<number>(initialPosition);
	const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

	// Calculate and report progress - using ref to avoid recreating
	const onProgressRef = useRef(onProgress);
	const onCompleteRef = useRef(onComplete);

	useEffect(() => {
		onProgressRef.current = onProgress;
		onCompleteRef.current = onComplete;
	}, [onProgress, onComplete]);

	// Calculate and report progress
	const reportProgress = useCallback(() => {
		if (!player || isCompleted) return;

		const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
		onProgressRef.current?.(timeSpent, lastPositionRef.current);
	}, [player, isCompleted]);

	// Handle video completion
	const handleVideoComplete = useCallback(() => {
		if (isCompleted) return;

		setIsCompleted(true);
		const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

		// Report final progress
		onProgressRef.current?.(timeSpent, lastPositionRef.current);
		onCompleteRef.current?.();
	}, [isCompleted]);

	// Load Vimeo Player API
	useEffect(() => {
		if (typeof window === 'undefined') return;

		// Check if script already exists
		const existingScript = document.querySelector('script[src*="player.vimeo.com"]');

		if (existingScript) {
			// Script already exists, check if Vimeo is loaded
			if (hasVimeo(window)) {
				setScriptLoaded(true);
			} else {
				// Wait for it to load
				const checkVimeo = setInterval(() => {
					if (hasVimeo(window)) {
						setScriptLoaded(true);
						clearInterval(checkVimeo);
					}
				}, 100);
				
				return () => clearInterval(checkVimeo);
			}
			return;
		}

		// Create new script
		const script = document.createElement("script");
		script.src ="https://player.vimeo.com/api/player.js";
		script.async = true;

		script.onload = () => {
			setScriptLoaded(true);
		};

		script.onerror = () => {
			setError("Failed to load video player");
		};

		document.body.appendChild(script);

		return () => {
			// Don't remove script on unmount as it may be used by other components
		};
	}, []); // Only run once on mount

	// Initialize Vimeo Player
	useEffect(() => {
		if (!iframeRef.current || typeof window === 'undefined') {
			return;
		}

		// Wait for script to load
		if (!scriptLoaded || !hasVimeo(window)) {
			return;
		}

		let vimeoPlayer: VimeoPlayer | null = null;
		let mounted = true;

		const initPlayer = async () => {
			try {
				setError(null);
				setIsPlayerReady(false);

				if (!hasVimeo(window)) {
					setError("Video player not loaded");
					return;
				}

				vimeoPlayer = new window.Vimeo.Player(iframeRef.current!);

				// Wait for player to be ready
				await vimeoPlayer.ready();

				if (!mounted) {
					await vimeoPlayer.destroy();
					return;
				}

				setPlayer(vimeoPlayer);
				setIsPlayerReady(true);

				// Set initial position if provided
				if (initialPosition > 0) {
					try {
						await vimeoPlayer.setCurrentTime(initialPosition);
					} catch (err) {
						console.warn("Could not set initial position:", err);
					}
				}

				// Track time updates
				vimeoPlayer.on("timeupdate", (data: { seconds: number; percent: number; duration: number }) => {
					lastPositionRef.current = Math.floor(data.seconds);
					setWatchedPercentage(Math.floor(data.percent * 100));
				});

				// Track when video ends
				vimeoPlayer.on("ended", () => {
					handleVideoComplete();
				});

				// Track errors
				vimeoPlayer.on("error", (data: any) => {
					console.error("Vimeo player error:", data);
					setError("Error playing video");
				});

				// Set up periodic progress reporting (every 30 seconds)
				progressIntervalRef.current = setInterval(() => {
					reportProgress();
				}, 30000);

			} catch (err) {
				console.error("Failed to initialize Vimeo player:", err);
				setError("Failed to load video player");
			}
		};

		initPlayer();

		return () => {
			mounted = false;

			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
				progressIntervalRef.current = null;
			}

			if (vimeoPlayer) {
				// Report final progress before cleanup
				reportProgress();

				vimeoPlayer.destroy().catch(err => {
					console.warn("Error destroying Vimeo player:", err);
				});
			}
		};
	}, [content.vimeo_video_id, initialPosition, handleVideoComplete, reportProgress, scriptLoaded]);

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

	if (error) {
		return (
			<div className="aspect-video bg-muted flex items-center justify-center">
				<div className="text-center">
					<AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
					<p className="text-destructive font-medium">{error}</p>
					<p className="text-sm text-muted-foreground mt-1">Please try refreshing the page</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<div className="aspect-video bg-black overflow-hidden relative">
				{!isPlayerReady && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
						<Loader2 className="h-8 w-8 text-white animate-spin" />
					</div>
				)}
				<iframe
					ref={iframeRef}
					src={`https://player.vimeo.com/video/${content.vimeo_video_id}?title=0&byline=0&portrait=0`}
					className="w-full h-full"
					allow="autoplay; fullscreen; picture-in-picture"
					allowFullScreen
					title={content.title}
				/>
			</div>

			<div className={`flex items-center gap-2 text-sm transition-opacity ${
				watchedPercentage > 0 ? 'opacity-100' : 'opacity-0 h-0'
			}`}>
				<div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
					<div
						className="bg-primary h-full transition-all duration-300"
						style={{ width: `${watchedPercentage}%` }}
					/>
				</div>
				<span className="text-xs font-medium text-muted-foreground">{watchedPercentage}%</span>
			</div>
		</div>
	);
}
