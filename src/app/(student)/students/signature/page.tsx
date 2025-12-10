"use client";

import { useAuth } from"@/hooks/use-auth";
import { useRouter } from"next/navigation";
import { useMutation, useQuery } from"@tanstack/react-query";
import { api } from"@/lib/api";
import { SignatureCanvas } from"@/components/signature/SignatureCanvas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { toast } from"sonner";
import { CheckCircle2, AlertCircle } from"lucide-react";
import Link from"next/link";
import { EnrollmentStatusResponse } from"@/types";
import { useEffect, useState } from"react";
import { Checkbox } from"@/components/ui/checkbox";
import { Label } from"@/components/ui/label";

export default function SignaturePage() {
	const { user } = useAuth();
	const router = useRouter();
	const [commitments, setCommitments] = useState({
		commitment1: false,
		commitment2: false,
		commitment3: false,
		commitment4: false,
		commitment5: false,
		commitment6: false,
		commitment7: false,
		commitment8: false,
	});

	// Check enrollment status
	const { data: enrollmentStatus, isLoading } = useQuery<EnrollmentStatusResponse>({
		queryKey: ["enrollment-status"],
		queryFn: async () => {
			const response = await api.get("/enrollment/status");
			return response.data;
		},
	});

	// Redirect if not enrolled
	useEffect(() => {
		if (!isLoading && !user?.is_enrolled) {
			router.push("/students/dashboard");
		}
	}, [user, isLoading, router]);

	// Redirect if signature already submitted
	useEffect(() => {
		if (enrollmentStatus?.has_signature) {
			router.push("/students/course");
		}
	}, [enrollmentStatus, router]);

	const submitSignatureMutation = useMutation({
		mutationFn: async (signatureBlob: Blob) => {
			// Convert blob to base64
			const reader = new FileReader();
			const base64Promise = new Promise<string>((resolve, reject) => {
				reader.onloadend = () => {
					const base64String = reader.result as string;
					resolve(base64String);
				};
				reader.onerror = reject;
			});
			reader.readAsDataURL(signatureBlob);
			const signatureData = await base64Promise;

			const response = await api.post("/enrollment/signature", {
				signature_data: signatureData,
			});
			return response.data;
		},
		onSuccess: () => {
			toast.success("Signature submitted successfully!");
			router.push("/students/course");
		},
		onError: (error: any) => {
			const errorMessage =
				error.response?.data?.error?.message ||
				error.response?.data?.detail ||"Failed to submit signature";
			toast.error(errorMessage);
		},
	});

	const handleSignatureSave = (signatureBlob: Blob) => {
		// Check if all commitments are checked
		const allCommitmentsChecked = Object.values(commitments).every((value) => value === true);

		if (!allCommitmentsChecked) {
			toast.error("Please check all commitment boxes before submitting your signature");
			return;
		}

		submitSignatureMutation.mutate(signatureBlob);
	};

	const allCommitmentsChecked = Object.values(commitments).every((value) => value === true);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	if (!user?.is_enrolled) {
		return null;
	}

	// If signature already submitted
	if (enrollmentStatus?.has_signature) {
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<div className="flex justify-center mb-4">
							<CheckCircle2 className="h-16 w-16 text-green-500" />
						</div>
						<CardTitle className="text-center">Signature Already Submitted</CardTitle>
						<CardDescription className="text-center">
							You&apos;ve already completed the signature process
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild className="w-full">
							<Link href="/students/course">Go to Course</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto space-y-6">
				{/* Header */}
				<div className="text-left space-y-2">
					<h1 className="text-3xl font-bold">Complete Your Enrollment</h1>
					<p className="text-muted-foreground">
						One final step: Please provide your digital signature to confirm your
						commitment to the course
					</p>
				</div>

				{/* Info Card */}
				<Card className="border-blue-200 bg-[#049ad1]/10 shadow-xs">
					<CardContent className="pt-6">
						<div className="flex gap-3">
							<AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
							<div className="space-y-1">
								<p className="text-sm font-medium text-blue-900">
									Why do we need your signature?
								</p>
								<p className="text-sm text-blue-800">
									Your digital signature serves as a formal commitment to complete the
									course and represents your agreement to engage with the learning
									materials. This helps us maintain the quality and integrity of our
									learning community.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Commitments */}
				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle>Course Commitments</CardTitle>
						<CardDescription>
							Please read and agree to the following commitments before signing
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center space-x-3">
							<Checkbox
								id="commitment1"
								checked={commitments.commitment1}
								className="rounded-xs"
								onCheckedChange={(checked) =>
									setCommitments({ ...commitments, commitment1: checked as boolean })
								}
							/>
							<Label htmlFor="commitment1" className="text-sm font-normal leading-relaxed cursor-pointer">
								Having learned procrastination is the number one reason for financial failure, I will begin today.
							</Label>
						</div>

						<div className="flex items-center space-x-3">
							<Checkbox
								id="commitment2"
								checked={commitments.commitment2}
								className="rounded-xs"
								onCheckedChange={(checked) =>
									setCommitments({ ...commitments, commitment2: checked as boolean })
								}
							/>
							<Label htmlFor="commitment2" className="text-sm font-normal leading-relaxed cursor-pointer">
								I will dedicate at least one hour per day toward my Financially Fit for Life program until completed and will continue with the daily meditations as outlined.
							</Label>
						</div>

						<div className="flex items-center space-x-3">
							<Checkbox
								id="commitment3"
								checked={commitments.commitment3}
								className="rounded-xs"
								onCheckedChange={(checked) =>
									setCommitments({ ...commitments, commitment3: checked as boolean })
								}
							/>
							<Label htmlFor="commitment3" className="text-sm font-normal leading-relaxed cursor-pointer">
								I will complete all 33 exercises to the best of my ability.
							</Label>
						</div>

						<div className="flex items-center space-x-3">
							<Checkbox
								id="commitment4"
								checked={commitments.commitment4}
								className="rounded-xs"
								onCheckedChange={(checked) =>
									setCommitments({ ...commitments, commitment4: checked as boolean })
								}
							/>
							<Label htmlFor="commitment4" className="text-sm font-normal leading-relaxed cursor-pointer">
								I will not prejudge the exercises, but will postpone my opinion until after completion.
							</Label>
						</div>

						<div className="flex items-center space-x-3">
							<Checkbox
								id="commitment5"
								checked={commitments.commitment5}
								className="rounded-xs"
								onCheckedChange={(checked) =>
									setCommitments({ ...commitments, commitment5: checked as boolean })
								}
							/>
							<Label htmlFor="commitment5" className="text-sm font-normal leading-relaxed cursor-pointer">
								I will maintain a positive attitude throughout The Seven Steps.
							</Label>
						</div>

						<div className="flex items-center space-x-3">
							<Checkbox
								id="commitment6"
								checked={commitments.commitment6}
								className="rounded-xs"
								onCheckedChange={(checked) =>
									setCommitments({ ...commitments, commitment6: checked as boolean })
								}
							/>
							<Label htmlFor="commitment6" className="text-sm font-normal leading-relaxed cursor-pointer">
								Recognizing that many begin a life changing program without finishing, I will beat all odds and finish the program by seeing it through to the end.
							</Label>
						</div>

						<div className="flex items-center space-x-3">
							<Checkbox
								id="commitment7"
								checked={commitments.commitment7}
								className="rounded-xs"
								onCheckedChange={(checked) =>
									setCommitments({ ...commitments, commitment7: checked as boolean })
								}
							/>
							<Label htmlFor="commitment7" className="text-sm font-normal leading-relaxed cursor-pointer">
								I will make this commitment public by sharing it with a spouse or friend, which will strengthen my commitment and resolve. I will ask this person to witness my commitment below.
							</Label>
						</div>

						<div className="flex items-center space-x-3">
							<Checkbox
								id="commitment8"
								checked={commitments.commitment8}
								className="rounded-xs"
								onCheckedChange={(checked) =>
									setCommitments({ ...commitments, commitment8: checked as boolean })
								}
							/>
							<Label htmlFor="commitment8" className="text-sm font-normal leading-relaxed cursor-pointer">
								I have read, understood, and accepted the above commitments.
							</Label>
						</div>

						{!allCommitmentsChecked && (
							<div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3">
								<AlertCircle className="h-4 w-4 shrink-0" />
								<span>Please check all boxes to proceed with your signature</span>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Signature Canvas */}
				<Card className={!allCommitmentsChecked ?"opacity-50 pointer-events-none rounded-md shadow-xs" :"rounded-md shadow-xs"}>
					<SignatureCanvas
						onSave={handleSignatureSave}
						isSubmitting={submitSignatureMutation.isPending}
					/>
				</Card>

				{/* Help Text */}
				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-lg">Tips for a Good Signature</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="flex gap-2">
								<span className="text-primary">•</span>
								<span>Use your mouse or touch screen to draw your signature</span>
							</li>
							<li className="flex gap-2">
								<span className="text-primary">•</span>
								<span>Draw naturally as you would sign on paper</span>
							</li>
							<li className="flex gap-2">
								<span className="text-primary">•</span>
								<span>Use the Undo button to correct mistakes</span>
							</li>
							<li className="flex gap-2">
								<span className="text-primary">•</span>
								<span>Use the Clear button to start over if needed</span>
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
