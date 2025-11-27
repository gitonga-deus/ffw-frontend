import type { Metadata } from"next";
import {  Geist } from"next/font/google";
import"./globals.css";
import { Providers } from"@/components/providers";

const geist = Geist({
	subsets: ["latin"],
	variable:"--font-geist",
});

export const metadata: Metadata = {
	title:"Financially Fit World - Learn and Grow",
	description:"Professional Learning Management System",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geist.variable} font-geist antialiased`} style={{ fontFamily: 'var(--font-geist)' }}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
