"use client";

import { useEffect, useState } from"react";
import { api } from"@/lib/api";
import { Star, Check, X, Clock, User } from"lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Skeleton } from"@/components/ui/skeleton";
import { Button } from"@/components/ui/button";
import { Badge } from"@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from"@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from"@/components/ui/avatar";
import { toast } from"sonner";

interface ReviewWithUser {
	id: string;
	user_id: string;
	user_name: string;
	user_profile_image: string | null;
	rating: number;
	review_text: string;
	status: string;
	created_at: string;
}

interface ReviewStats {
	total_reviews: number;
	average_rating: number;
	rating_distribution: Record<number, number>;
}

interface ReviewListResponse {
	reviews: ReviewWithUser[];
	stats: ReviewStats;
}

export default function ReviewsPage() {
	const [allReviews, setAllReviews] = useState<ReviewListResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState<string | null>(null);

	useEffect(() => {
		fetchReviews();
	}, []);

	const fetchReviews = async () => {
		try {
			setLoading(true);
			const response = await api.get<ReviewListResponse>("/reviews/admin/all");
			setAllReviews(response.data);
		} catch (err) {
			console.error(err);
			toast.error("Failed to load reviews");
		} finally {
			setLoading(false);
		}
	};

	const handleApprove = async (reviewId: string) => {
		try {
			setActionLoading(reviewId);
			await api.put(`/reviews/${reviewId}/approve`);
			toast.success("Review approved successfully");
			await fetchReviews();
		} catch (err) {
			console.error(err);
			toast.error("Failed to approve review");
		} finally {
			setActionLoading(null);
		}
	};

	const handleReject = async (reviewId: string) => {
		try {
			setActionLoading(reviewId);
			await api.put(`/reviews/${reviewId}/reject`);
			toast.success("Review rejected successfully");
			await fetchReviews();
		} catch (err) {
			console.error(err);
			toast.error("Failed to reject review");
		} finally {
			setActionLoading(null);
		}
	};

	if (loading) {
		return <ReviewsSkeleton />;
	}

	if (!allReviews) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-6">
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-muted-foreground">No reviews available</p>
				</div>
			</div>
		);
	}

	const pendingReviews = allReviews.reviews.filter((r) => r.status ==="pending");
	const approvedReviews = allReviews.reviews.filter((r) => r.status ==="approved");
	const rejectedReviews = allReviews.reviews.filter((r) => r.status ==="rejected");

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year:"numeric",
			month:"short",
			day:"numeric",
		});
	};

	const ReviewCard = ({ review, showActions = false }: { review: ReviewWithUser; showActions?: boolean }) => (
		<Card className="rounded-md shadow-xs">
			<CardContent className="pt-6">
				<div className="flex items-start gap-4">
					<Avatar>
						<AvatarImage src={review.user_profile_image || undefined} />
						<AvatarFallback>{getInitials(review.user_name)}</AvatarFallback>
					</Avatar>
					<div className="flex-1 space-y-2">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">{review.user_name}</p>
								<p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
							</div>
							<Badge
								variant={
									review.status ==="approved"
										?"default"
										: review.status ==="pending"
										?"secondary"
										:"destructive"
								}
							>
								{review.status}
							</Badge>
						</div>
						<div className="flex items-center gap-1">
							{Array.from({ length: 5 }).map((_, i) => (
								<Star
									key={i}
									className={`h-4 w-4 ${
										i < review.rating ?"fill-yellow-400 text-yellow-400" :"text-gray-300"
									}`}
								/>
							))}
						</div>
						<p className="text-sm">{review.review_text}</p>
						{showActions && review.status ==="pending" && (
							<div className="flex gap-2 pt-2">
								<Button
									className="rounded-md px-4!"
									onClick={() => handleApprove(review.id)}
									disabled={actionLoading === review.id}
								>
									<Check className="h-4 w-4 mr-1" />
									Approve
								</Button>
								<Button
									className="rounded-md px-4!"
									variant="destructive"
									onClick={() => handleReject(review.id)}
									disabled={actionLoading === review.id}
								>
									<X className="h-4 w-4 mr-1" />
									Reject
								</Button>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			{/* Page Header */}
			<div>
				<h1 className="text-2xl font-bold mb-2">Reviews</h1>
				<p className="text-muted-foreground">Manage course reviews and ratings</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
						<Star className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{allReviews.reviews.length}</div>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Average Rating</CardTitle>
						<Star className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{allReviews.stats.average_rating.toFixed(1)}</div>
						<p className="text-xs text-muted-foreground">From approved reviews</p>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pending</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{pendingReviews.length}</div>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Approved</CardTitle>
						<Check className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{approvedReviews.length}</div>
					</CardContent>
				</Card>
			</div>

			{/* Reviews Tabs */}
			<Tabs defaultValue="pending" className="space-y-4">
				<TabsList className="h-10 w-full rounded">
					<TabsTrigger value="pending" className="rounded">
						Pending ({pendingReviews.length})
					</TabsTrigger>
					<TabsTrigger value="approved" className="rounded">
						Approved ({approvedReviews.length})
					</TabsTrigger>
					<TabsTrigger value="rejected" className="rounded">
						Rejected ({rejectedReviews.length})
					</TabsTrigger>
					<TabsTrigger value="all" className="rounded">All ({allReviews.reviews.length})</TabsTrigger>
				</TabsList>

				<TabsContent value="pending" className="space-y-4">
					{pendingReviews.length > 0 ? (
						pendingReviews.map((review) => (
							<ReviewCard key={review.id} review={review} showActions />
						))
					) : (
						<Card className="rounded-md shadow-xs">
							<CardContent className="py-12 text-center">
								<p className="text-muted-foreground">No pending reviews</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value="approved" className="space-y-4">
					{approvedReviews.length > 0 ? (
						approvedReviews.map((review) => <ReviewCard key={review.id} review={review} />)
					) : (
						<Card className="rounded-md shadow-xs">
							<CardContent className="py-12 text-center">
								<p className="text-muted-foreground">No approved reviews</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value="rejected" className="space-y-4">
					{rejectedReviews.length > 0 ? (
						rejectedReviews.map((review) => <ReviewCard key={review.id} review={review} />)
					) : (
						<Card className="rounded-md shadow-xs">
							<CardContent className="py-12 text-center">
								<p className="text-muted-foreground">No rejected reviews</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value="all" className="space-y-4">
					{allReviews.reviews.map((review) => (
						<ReviewCard key={review.id} review={review} showActions={review.status ==="pending"} />
					))}
				</TabsContent>
			</Tabs>
		</div>
	);
}

function ReviewsSkeleton() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			<div>
				<Skeleton className="h-8 w-48 mb-2" />
				<Skeleton className="h-4 w-96" />
			</div>
			<div className="grid gap-4 md:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16 mb-2" />
							<Skeleton className="h-3 w-32" />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
