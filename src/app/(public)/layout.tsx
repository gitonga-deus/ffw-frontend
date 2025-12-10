import { PublicFooter } from "@/components/navigation";
import { PublicNavbar } from "@/components/navigation/PublicNavbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://financiallyfitworld.com'),
	title: "Home | The Fast Track to Financial Health and Wealth",
	description: "Master your financial future with our comprehensive financial literacy course. Learn essential money management skills, investing strategies, budgeting techniques, and achieve your financial goals through interactive modules and expert guidance.",
	keywords: ["financial literacy", "money management", "investing", "budgeting", "personal finance", "financial education", "financial planning", "wealth building"],
	authors: [{ name: "Financially Fit World" }],
	openGraph: {
		title: "Home | The Fast Track to Financial Health and Wealth",
		description: "Master your financial future with our comprehensive financial literacy course. Learn essential money management skills, investing strategies, and achieve your financial goals.",
		url: "https://financiallyfitworld.com",
		siteName: "Financially Fit World",
		images: [
			{
				url: "/logo/logo.png",
				width: 1200,
				height: 630,
				alt: "Financially Fit World - Financial Literacy Course",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Home | The Fast Track to Financial Health and Wealth",
		description: "Master your financial future with our comprehensive financial literacy course. Learn essential money management skills and achieve your financial goals.",
		images: ["/logo/logo.png"],
		creator: "@financiallyfitworld",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: "google-site-verification-code",
	},
};

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-background">
			<PublicNavbar />
			<main>{children}</main>
			<PublicFooter />
		</div>
	);
}
