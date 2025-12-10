import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

export function PublicFooter() {
	return (
		<footer className="bg-[#212A31] text-gray-300 py-10">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 md:px-6">
				<div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-6 mb-8">
					{/* Brand */}
					<div className="col-span-1 md:col-span-3 gap-10">
						<Link href="/" className="flex items-center mb-4">
							<Image
								src="/logo/logo.png"
								alt="Logo"
								width={320}
								height={120}
								className="h-auto w-auto max-h-[80px]"
								priority
							/>
						</Link>
						<p className="text-gray-400 mb-6 max-w-lg leading-relaxed">
							Transform your financial future with our comprehensive online course.
							Master wealth building, financial security, and achieve your goals.
						</p>

						{/* Social Media Icons */}
						<div className="flex items-center space-x-4 mb-4">
							<Link
								href="https://www.facebook.com/financiallyfitworld "
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="Follow us on Facebook"
							>
								<svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
								</svg>
							</Link>
							<Link
								href="https://x.com/finfitworld"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="Follow us on X (Twitter)"
							>
								<svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</Link>
							<Link
								href="https://www.instagram.com/finfitworld?igsh=MWt3dnh5NjRrYWZrOQ%3D%3D"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="Follow us on Instagram"
							>
								<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
									<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
									<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
								</svg>
							</Link>
							<Link
								href="https://www.linkedin.com/company/financially-fit-world/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="Follow us on LinkedIn"
							>
								<svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
								</svg>
							</Link>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/" className="hover:text-muted-foreground transition-colors">
									Home
								</Link>
							</li>
							<li>
								<Link href="/login" className="hover:text-muted-foreground transition-colors">
									Login
								</Link>
							</li>
							<li>
								<Link href="/register" className="hover:text-muted-foreground transition-colors">
									Register
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/privacy" className="hover:text-muted-foreground transition-colors">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="/terms" className="hover:text-muted-foreground transition-colors">
									Terms & Conditions
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Contact Info */}
				<div className="border-t border-gray-800 pt-8">
					<div className="flex flex-col md:flex-row items-center justify-between space-y-2">
						<p className="text-sm text-gray-400">
							© 2022 - {new Date().getFullYear()} Financially Fit World. All rights reserved.
						</p>

						<div className="flex flex-col md:flex-row items-center space-x-6 mb-4 md:mb-0 text-gray-400 divide-x divide-muted-foreground">
							<div className="flex items-center space-x-2 text-sm pr-4">
								<Mail className="h-4 w-4" />
								<span>support@financiallyfitworld.com</span>
							</div>
							<div className="flex items-center space-x-2 text-sm">
								<Phone className="h-4 w-4" />
								<span>+254 745 653782</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
