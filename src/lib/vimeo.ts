/**
 * Vimeo Player utilities and helpers
 */

export interface VimeoPlayerConfig {
	videoId: string;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	controls?: boolean;
	responsive?: boolean;
}

export interface VimeoTimeData {
	seconds: number;
	percent: number;
	duration: number;
}

export interface VimeoPlayerInstance {
	on: (event: string, callback: (data: any) => void) => void;
	off: (event: string, callback?: (data: any) => void) => void;
	setCurrentTime: (seconds: number) => Promise<number>;
	getDuration: () => Promise<number>;
	getCurrentTime: () => Promise<number>;
	getPaused: () => Promise<boolean>;
	getVolume: () => Promise<number>;
	setVolume: (volume: number) => Promise<number>;
	play: () => Promise<void>;
	pause: () => Promise<void>;
	destroy: () => Promise<void>;
	ready: () => Promise<void>;
}

/**
 * Build Vimeo embed URL with configuration options
 */
export function buildVimeoEmbedUrl(config: VimeoPlayerConfig): string {
	const params = new URLSearchParams({
		title: '0',
		byline: '0',
		portrait: '0',
	});

	if (config.autoplay) params.set('autoplay', '1');
	if (config.loop) params.set('loop', '1');
	if (config.muted) params.set('muted', '1');
	if (config.controls === false) params.set('controls', '0');
	if (config.responsive) params.set('responsive', '1');

	return `https://player.vimeo.com/video/${config.videoId}?${params.toString()}`;
}

/**
 * Extract Vimeo video ID from various URL formats
 */
export function extractVimeoId(url: string): string | null {
	// Handle direct ID
	if (/^\d+$/.test(url)) {
		return url;
	}

	// Handle various Vimeo URL formats
	const patterns = [
		/vimeo\.com\/(\d+)/,
		/player\.vimeo\.com\/video\/(\d+)/,
		/vimeo\.com\/channels\/[\w-]+\/(\d+)/,
		/vimeo\.com\/groups\/[\w-]+\/videos\/(\d+)/,
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}

	return null;
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export function formatVideoTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate video completion percentage
 */
export function calculateCompletionPercentage(
	currentTime: number,
	duration: number,
	threshold: number = 0.9
): number {
	if (duration === 0) return 0;

	const percentage = currentTime / duration;
	return Math.min(Math.floor(percentage * 100), 100);
}

/**
 * Check if video is considered "completed" based on watch threshold
 */
export function isVideoCompleted(
	currentTime: number,
	duration: number,
	threshold: number = 0.9
): boolean {
	if (duration === 0) return false;
	return currentTime / duration >= threshold;
}

/**
 * Load Vimeo Player API script
 */
export function loadVimeoPlayerScript(): Promise<void> {
	return new Promise((resolve, reject) => {
		// Check if already loaded
		if (typeof window !== 'undefined' && window.Vimeo) {
			resolve();
			return;
		}

		// Check if script is already in DOM
		const existingScript = document.querySelector('script[src*="player.vimeo.com"]');
		if (existingScript) {
			existingScript.addEventListener('load', () => resolve());
			existingScript.addEventListener('error', () => reject(new Error('Failed to load Vimeo Player API')));
			return;
		}

		// Create and load script
		const script = document.createElement('script');
		script.src = 'https://player.vimeo.com/api/player.js';
		script.async = true;

		script.onload = () => resolve();
		script.onerror = () => reject(new Error('Failed to load Vimeo Player API'));

		document.body.appendChild(script);
	});
}

/**
 * Vimeo Player event types
 */
export const VimeoEvents = {
	PLAY: 'play',
	PAUSE: 'pause',
	ENDED: 'ended',
	TIME_UPDATE: 'timeupdate',
	PROGRESS: 'progress',
	SEEKED: 'seeked',
	TEXT_TRACK_CHANGE: 'texttrackchange',
	CUE_CHANGE: 'cuechange',
	CUE_POINT: 'cuepoint',
	VOLUME_CHANGE: 'volumechange',
	PLAYBACK_RATE_CHANGE: 'playbackratechange',
	BUFFER_START: 'bufferstart',
	BUFFER_END: 'bufferend',
	ERROR: 'error',
	LOADED: 'loaded',
} as const;


