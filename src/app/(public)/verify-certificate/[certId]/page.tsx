import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Calendar, Award, User } from "lucide-react";

async function getCertificateDetails(certId: string) {
	// Check for invalid cert IDs
	if (!certId || certId === 'undefined' || certId === 'null' || certId === 'INVALID' || certId === 'NOT_FOUND' || certId === 'ERROR') {
		return null;
	}
	
	try {
		const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
		const response = await fetch(`${API_BASE_URL}/certificates/verify/${certId}`, {
			cache: 'no-store',
		});

		if (!response.ok) {
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching certificate:', error);
		return null;
	}
}

export default async function VerifyCertificatePage({
	params,
}: {
	params: Promise<{ certId: string }>;
}) {
	const { certId } = await params;
	const certificate = await getCertificateDetails(certId);

	return (
		<div className="min-h-screen bg-linear-to-b from-background to-muted/20">
			<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">Certificate Verification</h1>
					<p className="text-muted-foreground">
						Verify the authenticity of a course completion certificate
					</p>
				</div>

				{certificate ? (
					<Card className="shadow-xs rounded-sm">
						<CardHeader className="text-center pb-4 mb-4">
							<div className="flex justify-center mb-4">
								<div className="p-3">
									<CheckCircle2 className="w-12 h-12 text-[#049ad1]" />
								</div>
							</div>
							<CardTitle className="text-2xl font-semibold">Certificate Verified</CardTitle>
							<Badge variant="outline" className="w-fit mx-auto mt-2 border-[#049ad1]/50 text-[#049ad1]">
								Authentic
							</Badge>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4">
								{/* Student Name */}
								<div className="flex items-start gap-3 p-4 rounded bg-muted/50">
									<User className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground mb-1">Student Name</p>
										<p className="font-semibold text-lg">{certificate.student_name}</p>
									</div>
								</div>

								{/* Course Title */}
								<div className="flex items-start gap-3 p-4 rounded bg-muted/50">
									<Award className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground mb-1">Course Title</p>
										<p className="font-semibold text-lg">{certificate.course_title}</p>
									</div>
								</div>

								{/* Issue Date */}
								<div className="flex items-start gap-3 p-4 rounded bg-muted/50">
									<Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground mb-1">Issue Date</p>
										<p className="font-semibold text-lg">
											{new Date(certificate.issued_at).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</p>
									</div>
								</div>

								{/* Certificate ID */}
								<div className="flex items-start gap-3 p-4 rounded bg-muted/50">
									<Award className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground mb-1">Certificate ID</p>
										<p className="font-mono font-medium text-sm break-all">{certificate.certification_id}</p>
									</div>
								</div>
							</div>

							<div className="pt-4 border-t">
								<p className="text-sm text-muted-foreground text-center">
									This certificate has been verified as authentic and was issued by Financially Fit World.
								</p>
							</div>

							<div className="flex gap-4">
								<Button asChild className="flex-1 h-10 rounded bg-[#049ad1] hover:bg-[#049ad1]/80">
									<Link href="/">View Course</Link>
								</Button>
								<Button asChild variant="outline" className="flex-1 rounded h-10">
									<Link href="/register">Enroll Now</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				) : (
					<Card className="border-destructive/50 rounded-sm shadow-xs">
						<CardHeader className="text-center pb-4 mb-4">
							<div className="flex justify-center mb-4">
								<div className="p-3">
									<XCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
								</div>
							</div>
							<CardTitle className="text-2xl">Certificate Not Found</CardTitle>
							<Badge variant="outline" className="w-fit mx-auto mt-2 border-red-600 text-red-600">
								Invalid
							</Badge>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="text-center space-y-4">
								<p className="text-muted-foreground">
									The certificate ID <span className="font-mono font-semibold">{certId}</span> could not be verified. This could mean:
								</p>
			
								<ul className="text-sm text-muted-foreground text-left max-w-xl mx-auto space-y-2">
									<li className="flex gap-2">
										<span>•</span>
										<span>The certificate ID is incorrect or has been mistyped</span>
									</li>
									<li className="flex gap-2">
										<span>•</span>
										<span>The certificate has not been issued yet</span>
									</li>
									<li className="flex gap-2">
										<span>•</span>
										<span>The certificate may have been revoked</span>
									</li>
								</ul>
							</div>

							<div className="pt-4 border-t">
								<p className="text-sm text-muted-foreground text-center mb-4">
									If you believe this is an error, please contact support.
								</p>
								<div className="flex gap-3">
									<Button asChild variant="outline" className="flex-1 h-10 rounded">
										<Link href="/">Go to Home</Link>
									</Button>
									<Button asChild className="flex-1 h-10 rounded bg-[#049ad1] hover:bg-[#049ad1]/80">
										<Link href="/register">Enroll in Course</Link>
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

			</main>
		</div>
	);
}
