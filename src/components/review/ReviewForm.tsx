"use client";

import { useState } from"react";
import { useMutation, useQueryClient } from"@tanstack/react-query";
import { api } from"@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Textarea } from"@/components/ui/textarea";
import { Label } from"@/components/ui/label";
import { StarRating } from"@/components/ui/star-rating";
import { toast } from"sonner";

interface ReviewFormProps {
	onSuccess?: () => void;
}

export function ReviewForm({ onSuccess }: ReviewFormProps) {
	const [rating, setRating] = useState(0);
	const [reviewText, setReviewText] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const queryClient = useQueryClient();

	const submitReviewMutation = useMutation({
		mutationFn: async (data: { rating: number; review_text: string }) => {
			const response = await api.post("/reviews", data);
			return response.data;
		},
		onSuccess: () => {
			setSubmitted(true);
			queryClient.invalidateQueries({ queryKey: ["reviews"] });
			toast.success("Review submitted successfully!", {
				description:"Your review is pending approval and will be visible soon.",
			});
			if (onSuccess) {
				onSuccess();
			}
		},
		onError: (error: any) => {
			const message = error.response?.data?.error?.message ||"Failed to submit review";
			toast.error("Error", {
				description: message,
			});
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (rating === 0) {
			toast.error("Please select a rating");
			return;
		}

		if (reviewText.length < 10) {
			toast.error("Review must be at least 10 characters long");
			return;
		}

		if (reviewText.length > 1000) {
			toast.error("Review must not exceed 1000 characters");
			return;
		}

		submitReviewMutation.mutate({
			rating,
			review_text: reviewText,
		});
	};

	if (submitted) {
		return (
			<Card className="rounded-sm shadow-xs">
				<CardHeader>
					<CardTitle>
						Thank You for Your Review!
					</CardTitle>
					<CardDescription>
						Your review has been submitted and is pending approval
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						We appreciate your feedback! Your review will be visible on the course page once it&apos;s approved by the instructor.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="rounded-sm shadow-xs">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					Share Your Experience
				</CardTitle>
				<CardDescription>
					Help others by sharing your thoughts about this course
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Rating */}
					<div className="space-y-2">
						<Label htmlFor="rating">Rating *</Label>
						<div className="flex items-center gap-4">
							<StarRating
								rating={rating}
								onRatingChange={setRating}
								size="lg"
							/>
							{rating > 0 && (
								<span className="text-sm text-muted-foreground">
									{rating} {rating === 1 ?"star" :"stars"}
								</span>
							)}
						</div>
					</div>

					{/* Review Text */}
					<div className="space-y-2">
						<Label htmlFor="review">Your Review *</Label>
						<Textarea
							id="review"
							placeholder="Share your experience with this course... (10-1000 characters)"
							value={reviewText}
							onChange={(e) => setReviewText(e.target.value)}
							rows={6}
							className="resize-none h-40!"
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>
								{reviewText.length < 10
									? `${10 - reviewText.length} more characters required`
									:"Minimum length met"}
							</span>
							<span
								className={reviewText.length > 1000 ?"text-red-500" :""}
							>
								{reviewText.length}/1000
							</span>
						</div>
					</div>

					{/* Submit Button */}
					<Button
						type="submit"
						disabled={submitReviewMutation.isPending}
						className="w-full rounded h-10 bg-[#049ad1] hover:bg-[#049ad1]/80"
					>
						{submitReviewMutation.isPending ?"Submitting..." :"Submit Review"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
