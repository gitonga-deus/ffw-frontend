"use client";

import { useAuth } from"@/hooks/use-auth";
import { useQuery } from"@tanstack/react-query";
import { api } from"@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Badge } from"@/components/ui/badge";
import { Separator } from"@/components/ui/separator";
import { Certificate } from"@/types";
import { Award, Download, ExternalLink, CheckCircle2, AlertCircle } from"lucide-react";
import Link from"next/link";
import { ReviewForm } from"@/components/review/ReviewForm";
import { CertificateViewer } from"@/components/certificate/CertificateViewer";

export default function CertificatePage() {
	const { user } = useAuth();

	// Fetch certificate with retry logic for race condition
	const { data: certificate, isLoading, error } = useQuery<Certificate>({
		queryKey: ["certificate"],
		queryFn: async () => {
			try {
				const response = await api.get("/certificates/mine");
				return response.data;
			} catch (err: any) {
				// If 404, it means course not completed or certificate still being generated
				if (err.response?.status === 404) {
					return null;
				}
				throw err;
			}
		},
		enabled: !!user?.is_enrolled,
		retry: 3, // Retry up to 3 times for race condition
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff: 1s, 2s, 4s
		refetchInterval: (data) => {
			// If no certificate yet, poll every 2 seconds for up to 30 seconds
			if (!data) {
				return 2000;
			}
			return false; // Stop polling once we have the certificate
		},
		refetchIntervalInBackground: false,
	});

	if (!user) {
		return null;
	}

	if (!user.is_enrolled) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<Card className="border-yellow-500/50 shadow-xs">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<AlertCircle className="h-5 w-5 text-yellow-500" />
								Not Enrolled
							</CardTitle>
							<CardDescription>
								You need to enroll in the course to access certificates
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button asChild>
								<Link href="/students/dashboard">Go to Dashboard</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<Card className="shadow-xs">
						<CardContent className="text-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
							<p className="mt-4 text-lg font-medium">Generating your certificate...</p>
							<p className="mt-2 text-sm text-muted-foreground">
								This may take a few moments. Please wait.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (error || !certificate) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<Card className="border-yellow-500/50 shadow-xs">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-xl">
								<AlertCircle className="h-6 w-6 text-yellow-500" />
								Certificate Not Available
							</CardTitle>
							<CardDescription>
								Complete the course to receive your certificate
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm text-muted-foreground">
								Your certificate will be automatically generated once you complete all course modules.
							</p>
							<Button asChild className="h-10 px-6! rounded-sm" variant={"outline"}>
								<Link href="/students/course">Continue Learning</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	const verificationUrl = `${window.location.origin}/verify-certificate/${certificate.certification_id}`;

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto space-y-8">
				{/* Header */}
				<div className="text-left">
					<h1 className="text-3xl font-bold">Congratulations!</h1>
					<p className="text-muted-foreground mt-2">
						You&apos;ve successfully completed the course
					</p>
				</div>

				{/* Certificate Card */}
				<Card className="shadow-xs rounded">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="flex items-center gap-2">
									Course Completion Certificate
								</CardTitle>
								<CardDescription className="mt-2">
									Issued on {new Date(certificate.issued_at).toLocaleDateString("en-US", {
										year:"numeric",
										month:"long",
										day:"numeric",
									})}
								</CardDescription>
							</div>
							<Badge variant="default" className="text-xs px-3 py-1 bg-[#049ad1]">
								Verified
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Certificate Display */}
						{certificate.certificate_url ? (
							<CertificateViewer url={certificate.certificate_url} />
						) : (
							<div className="border rounded-sm p-8 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
								<div className="text-center space-y-4">
									<div>
										<p className="text-sm text-muted-foreground">This certifies that</p>
										<h2 className="text-2xl font-bold mt-2">{certificate.student_name}</h2>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">has successfully completed</p>
										<h3 className="text-xl font-semibold mt-2">{certificate.course_title}</h3>
									</div>
									<div className="pt-4">
										<p className="text-xs text-muted-foreground">Certificate ID</p>
										<p className="text-sm font-mono font-medium">{certificate.certification_id}</p>
									</div>
								</div>
							</div>
						)}

						<Separator />

						{/* Certificate Details */}
						<div className="grid gap-4 sm:grid-cols-2">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Student Name</p>
								<p className="text-base font-medium mt-1">{certificate.student_name}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">Course Title</p>
								<p className="text-base font-medium mt-1">{certificate.course_title}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">Issue Date</p>
								<p className="text-base font-medium mt-1">
									{new Date(certificate.issued_at).toLocaleDateString()}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">Certification ID</p>
								<p className="text-base font-mono font-medium mt-1">{certificate.certification_id}</p>
							</div>
						</div>

						<Separator />

						{/* Actions */}
						<div className="flex flex-col sm:flex-row gap-4">
							<Button asChild className="flex-1 h-10 rounded bg-[#049ad1] hover:bg-[#049ad1]/80">
								<a href={certificate.certificate_url} download target="_blank" rel="noopener noreferrer">
									<Download className="mr-2 h-4 w-4" />
									Download Certificate
								</a>
							</Button>
							<Button asChild variant="outline" className="flex-1 h-10 rounded">
								<a href={verificationUrl} target="_blank" rel="noopener noreferrer">
									<ExternalLink className="mr-2 h-4 w-4" />
									Verify Certificate
								</a>
							</Button>
						</div>

						{/* Verification URL */}
						<div className="bg-muted p-4">
							<p className="text-sm font-medium mb-2">Verification URL</p>
							<div className="flex items-center gap-2">
								<code className="flex-1 text-xs bg-background h-9 py-2 px-3 border overflow-x-auto font-mono">
									{verificationUrl}
								</code>
								<Button
									
									variant="outline"
									className="rounded"
									onClick={() => {
										navigator.clipboard.writeText(verificationUrl);
									}}
								>
									Copy
								</Button>
							</div>
							<p className="text-xs text-muted-foreground mt-2">
								Share this URL to allow others to verify your certificate authenticity
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Review Form */}
				<ReviewForm />

				{/* Back to Dashboard */}
				<div className="text-center">
					<Button asChild variant="outline" className="h-10 w-1/2 mb-10 rounded">
						<Link href="/students/dashboard">Back to Dashboard</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
