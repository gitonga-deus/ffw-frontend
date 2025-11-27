"use client";

import { useEffect, useState } from"react";
import { usersApi } from"@/lib/users-api";
import type { UserListResponse, UserFilters } from"@/types/user";
import {
	Users,
	UserCheck,
	Calendar,
	Clock,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Download,
} from"lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Skeleton } from"@/components/ui/skeleton";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from"@/components/ui/select";
import { Badge } from"@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from"@/components/ui/avatar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from"@/components/ui/table";
import Link from"next/link";

export default function UsersPage() {
	const [data, setData] = useState<UserListResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<UserFilters>({
		page: 1,
		page_size: 20,
		enrollment_status: null,
	});
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		fetchUsers();
	}, [filters]);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await usersApi.getUsers(filters);
			setData(response);
		} catch (err) {
			setError("Failed to load users");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (newPage: number) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
	};

	const handleEnrollmentFilterChange = (value: string) => {
		setFilters((prev) => ({
			...prev,
			page: 1,
			enrollment_status: value ==="all" ? null : (value as"enrolled" |"not_enrolled"),
		}));
	};

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

	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-US", {
			year:"numeric",
			month:"short",
			day:"numeric",
			hour:"2-digit",
			minute:"2-digit",
		});
	};

	// Filter users by search query (client-side)
	const filteredUsers = data?.users.filter(
		(user) =>
			user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const exportUsersToCSV = () => {
		if (!filteredUsers || filteredUsers.length === 0) {
			return;
		}

		// Prepare CSV headers
		const headers = [
			"Full Name",
			"Email",
			"Phone Number",
			"Role",
			"Enrollment Status",
			"Verification Status",
			"Registered Date",
			"Last Login",
		];

		// Prepare CSV rows
		const rows = filteredUsers.map((user) => [
			user.full_name,
			user.email,
			user.phone_number,
			user.role,
			user.is_enrolled ? "Enrolled" : "Not Enrolled",
			user.is_verified ? "Verified" : "Unverified",
			formatDate(user.created_at),
			user.last_login_at ? formatDateTime(user.last_login_at) : "Never",
		]);

		// Create CSV content
		const csvContent = [
			headers.join(","),
			...rows.map((row) =>
				row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
			),
		].join("\n");

		// Create blob and download
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		
		link.setAttribute("href", url);
		link.setAttribute("download", `users-export-${new Date().toISOString().split("T")[0]}.csv`);
		link.style.visibility = "hidden";
		
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (loading && !data) {
		return <UsersSkeleton />;
	}

	if (error && !data) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-6">
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-muted-foreground">{error}</p>
				</div>
			</div>
		);
	}

	const stats = {
		total: data?.total || 0,
		enrolled: data?.users.filter((u) => u.is_enrolled).length || 0,
		verified: data?.users.filter((u) => u.is_verified).length || 0,
	};

	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold mb-2">Users</h1>
					<p className="text-muted-foreground">Manage and view all registered users</p>
				</div>
				<Button
					variant="outline"
					onClick={exportUsersToCSV}
					disabled={!filteredUsers || filteredUsers.length === 0}
					className="rounded-sm px-6!"
				>
					<Download className="h-4 w-4 mr-2" />
					Export Data
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.total}</div>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Enrolled Users</CardTitle>
						<UserCheck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.enrolled}</div>
						<p className="text-xs text-muted-foreground">
							{stats.total > 0 ? ((stats.enrolled / stats.total) * 100).toFixed(1) : 0}% of total
						</p>
					</CardContent>
				</Card>

				<Card className="rounded-md shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Verified Users</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.verified}</div>
						<p className="text-xs text-muted-foreground">
							{stats.total > 0 ? ((stats.verified / stats.total) * 100).toFixed(1) : 0}% of total
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card className="rounded-md shadow-xs">
				<CardHeader>
					<CardTitle>User List</CardTitle>
					<CardDescription>Search and filter users</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="flex flex-1 items-center gap-2">
							<Input
								placeholder="Search by name or email..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="h-10"
							/>
						</div>

						<div className="flex items-center gap-2">
							{/* <Filter className="h-4 w-4 text-muted-foreground" /> */}
							<Select
								value={filters.enrollment_status ||"all"}
								onValueChange={handleEnrollmentFilterChange}
							>
								<SelectTrigger className="w-[180px] h-10!">
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Users</SelectItem>
									<SelectItem value="enrolled">Enrolled</SelectItem>
									<SelectItem value="not_enrolled">Not Enrolled</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Users Table */}
			<Card className="rounded-md shadow-xs">
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="px-4">User</TableHead>
								<TableHead>Contact</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Registered</TableHead>
								<TableHead>Last Login</TableHead>
								<TableHead className="text-right px-4">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers && filteredUsers.length > 0 ? (
								filteredUsers.map((user) => (
									<TableRow key={user.id}>
										<TableCell className="px-4">
											<div className="flex items-center gap-3">
												<Avatar>
													<AvatarImage src={user.profile_image_url || undefined} />
													<AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">{user.full_name}</p>
													<p className="text-sm text-muted-foreground">{user.role}</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="space-y-1">
												<div className="flex items-center gap-2 text-sm tracking-tight">
													<span>{user.email}</span>
												</div>
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<span>{user.phone_number}</span>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex flex-col gap-1.5">
												<Badge
													variant={user.is_enrolled ?"default" :"destructive"}
													className="w-fit text-xs"
												>
													{user.is_enrolled ? (
														<>
															Enrolled
														</>
													) : (
														<>
															Not Enrolled
														</>
													)}
												</Badge>
												<Badge
													variant={user.is_verified ?"secondary" :"outline"}
													className="w-fit"
												>
													{user.is_verified ? (
														<>
															Verified
														</>
													) : (
														<>
															Unverified
														</>
													)}
												</Badge>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2 text-sm">
												<Calendar className="h-3 w-3 text-muted-foreground" />
												<span>{formatDate(user.created_at)}</span>
											</div>
										</TableCell>
										<TableCell>
											{user.last_login_at ? (
												<div className="flex items-center gap-2 text-sm">
													<Clock className="h-3 w-3 text-muted-foreground" />
													<span>{formatDateTime(user.last_login_at)}</span>
												</div>
											) : (
												<span className="text-sm text-muted-foreground">Never</span>
											)}
										</TableCell>
										<TableCell className="text-right px-4">
											<Link href={`/admin/users/${user.id}`}>
												<Button variant="outline" size="sm" className="rounded">
													View Details
												</Button>
											</Link>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={6} className="text-center py-8">
										<p className="text-muted-foreground">No users found</p>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Pagination */}
			{data && data.total_pages > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing {(data.page - 1) * data.page_size + 1} to{""}
						{Math.min(data.page * data.page_size, data.total)} of {data.total} users
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(data.page - 1)}
							disabled={data.page === 1 || loading}
						>
							<ChevronLeft className="h-4 w-4 mr-1" />
							Previous
						</Button>
						<span className="text-sm">
							Page {data.page} of {data.total_pages}
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(data.page + 1)}
							disabled={data.page === data.total_pages || loading}
						>
							Next
							<ChevronRight className="h-4 w-4 ml-1" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

function UsersSkeleton() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			<div>
				<Skeleton className="h-8 w-48 mb-2" />
				<Skeleton className="h-4 w-96" />
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i} className="rounded-sm shadow-none">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-20 mb-2" />
							<Skeleton className="h-3 w-32" />
						</CardContent>
					</Card>
				))}
			</div>
			<Card className="rounded-md shadow-xs">
				<CardHeader>
					<Skeleton className="h-6 w-32 mb-2" />
					<Skeleton className="h-4 w-48" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-10 w-full" />
				</CardContent>
			</Card>
		</div>
	);
}
