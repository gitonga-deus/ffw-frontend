'use client';

import { useMemo } from 'react';
import { VideoProvider, ParsedVideo } from '@/types/home';

interface VideoEmbedProps {
	url: string;
	title?: string;
}

/**
 * Parse a video URL and extract provider and video ID
 */
function parseVideoUrl(url: string): ParsedVideo | null {
	try {
		const urlObj = new URL(url);

		// YouTube patterns
		if (urlObj.hostname.includes('youtube.com')) {
			const videoId = urlObj.searchParams.get('v');
			if (videoId) {
				return {
					provider: 'youtube',
					videoId,
					embedUrl: `https://www.youtube.com/embed/${videoId}`,
				};
			}
		}

		// YouTube short URL pattern (youtu.be)
		if (urlObj.hostname === 'youtu.be') {
			const videoId = urlObj.pathname.slice(1); // Remove leading slash
			if (videoId) {
				return {
					provider: 'youtube',
					videoId,
					embedUrl: `https://www.youtube.com/embed/${videoId}`,
				};
			}
		}

		// Vimeo pattern
		if (urlObj.hostname.includes('vimeo.com')) {
			const videoId = urlObj.pathname.slice(1); // Remove leading slash
			if (videoId) {
				return {
					provider: 'vimeo',
					videoId,
					embedUrl: `https://player.vimeo.com/video/${videoId}`,
				};
			}
		}

		return null;
	} catch (error) {
		// Invalid URL format
		return null;
	}
}

export default function VideoEmbed({ url, title = 'Video' }: VideoEmbedProps) {
	const parsedVideo = useMemo(() => parseVideoUrl(url), [url]);

	if (!parsedVideo) {
		return (
			<div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
				<div className="text-center p-6">
					<p className="text-gray-600 dark:text-gray-400 font-medium">
						Invalid video URL
					</p>
					<p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
						Please provide a valid YouTube or Vimeo URL
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full aspect-video rounded overflow-hidden shadow-lg">
			<iframe
				src={parsedVideo.embedUrl}
				title={title}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				className="w-full h-full border-0"
			/>
		</div>
	);
}

// Export the parsing function for testing
export { parseVideoUrl };
