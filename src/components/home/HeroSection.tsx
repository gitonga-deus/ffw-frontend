'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import VideoEmbed from './VideoEmbed';

export default function HeroSection() {
	return (
		<section className="relative min-h-[700px] flex items-center justify-center overflow-hidden " aria-label="Hero section">
			<div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
				<div className="max-w-6xl mx-auto text-center space-y-8">
					<div className="relative h-full w-full bg-white"><div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div></div>
					{/* Headline */}
					<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#049ad1] dark:text-[#049ad1] tracking-tight">
						Financially Fit World
					</h1>

					{/* Value Proposition */}
					<p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed text-balance">
						Master your financial future with our comprehensive financial literacy course.
						Learn essential money management skills, investing strategies, and achieve your financial goals.
					</p>

					{/* Primary CTA */}
					<div className="pt-6">
						<Button asChild size="lg" className="text-lg px-8 py-4 h-auto bg-[#049ad1] hover:bg-[#037ba8] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
							<Link href="/register">
								Get Started Today
							</Link>
						</Button>
					</div>

					{/* Video Embed */}
					<div className="pt-12 max-w-4xl mx-auto">
						<div className="rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700">
							<VideoEmbed
								url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
								title="Financial Literacy Course Introduction"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
