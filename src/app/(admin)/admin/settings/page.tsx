"use client";

import { useEffect, useState, useRef } from"react";
import { api } from"@/lib/api";
import { User, NotebookPen, Save, X } from"lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Skeleton } from"@/components/ui/skeleton";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Textarea } from"@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from"@/components/ui/tabs";
import { Switch } from"@/components/ui/switch";
import { toast } from"sonner";
import Image from"next/image";

interface AdminProfile {
	id: string;
	email: string;
	full_name: string;
	phone_number: string;
	profile_image_url: string | null;
	role: string;
	instructor_bio: string | null;
	instructor_image_url: string | null;
}

interface CourseSettings {
	id: string;
	title: string;
	description: string;
	price: string;
	currency: string;
	thumbnail_url: string | null;
	is_published: boolean;
}

export default function SettingsPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [profileForm, setProfileForm] = useState({
		full_name:"",
		email:"",
		phone_number:"",
		password:"",
		instructor_bio:"",
	});

	const [courseForm, setCourseForm] = useState({
		title:"",
		description:"",
		price:"",
		is_published: false,
	});

	const [instructorImage, setInstructorImage] = useState<File | null>(null);
	const [instructorImagePreview, setInstructorImagePreview] = useState<string | null>(null);
	const [courseThumbnail, setCourseThumbnail] = useState<File | null>(null);
	const [courseThumbnailPreview, setCourseThumbnailPreview] = useState<string | null>(null);

	const instructorImageInputRef = useRef<HTMLInputElement>(null);
	const courseThumbnailInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		fetchSettings();
	}, []);

	const fetchSettings = async () => {
		try {
			setLoading(true);
			const [profileRes, courseRes] = await Promise.all([
				api.get<AdminProfile>("/admin/settings/profile"),
				api.get<CourseSettings>("/admin/settings/course"),
			]);

			setProfileForm({
				full_name: profileRes.data.full_name,
				email: profileRes.data.email,
				phone_number: profileRes.data.phone_number,
				password:"",
				instructor_bio: profileRes.data.instructor_bio ||"",
			});

			setCourseForm({
				title: courseRes.data.title,
				description: courseRes.data.description,
				price: courseRes.data.price,
				is_published: courseRes.data.is_published,
			});

			// Set image previews from existing URLs
			setInstructorImagePreview(profileRes.data.instructor_image_url);
			setCourseThumbnailPreview(courseRes.data.thumbnail_url);
		} catch (err) {
			console.error(err);
			toast.error("Failed to load settings");
		} finally {
			setLoading(false);
		}
	};

	const handleInstructorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setInstructorImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setInstructorImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveInstructorImage = () => {
		setInstructorImage(null);
		setInstructorImagePreview(null);
		if (instructorImageInputRef.current) {
			instructorImageInputRef.current.value ="";
		}
	};

	const handleCourseThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setCourseThumbnail(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setCourseThumbnailPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveCourseThumbnail = () => {
		setCourseThumbnail(null);
		setCourseThumbnailPreview(null);
		if (courseThumbnailInputRef.current) {
			courseThumbnailInputRef.current.value ="";
		}
	};

	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			const formData = new FormData();
			formData.append("full_name", profileForm.full_name);
			formData.append("email", profileForm.email);
			formData.append("phone_number", profileForm.phone_number);
			if (profileForm.password) {
				formData.append("password", profileForm.password);
			}
			if (profileForm.instructor_bio) {
				formData.append("instructor_bio", profileForm.instructor_bio);
			}
			if (instructorImage) {
				formData.append("instructor_image", instructorImage);
			}

			await api.put("/admin/settings/profile", formData, {
				headers: {"Content-Type":"multipart/form-data" },
			});

			toast.success("Profile updated successfully");
			setProfileForm({ ...profileForm, password:"" });
			setInstructorImage(null);
			await fetchSettings();
		} catch (err: any) {
			console.error(err);
			toast.error(err.response?.data?.detail ||"Failed to update profile");
		} finally {
			setSaving(false);
		}
	};

	const handleSaveCourse = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			const formData = new FormData();
			formData.append("title", courseForm.title);
			formData.append("description", courseForm.description);
			formData.append("price", courseForm.price);
			if (courseThumbnail) {
				formData.append("thumbnail", courseThumbnail);
			}
			formData.append("is_published", courseForm.is_published.toString());

			await api.put("/admin/settings/course", formData, {
				headers: {"Content-Type":"multipart/form-data" },
			});

			toast.success("Course settings updated successfully");
			setCourseThumbnail(null);
			await fetchSettings();
		} catch (err: any) {
			console.error(err);
			toast.error(err.response?.data?.detail ||"Failed to update course settings");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return <SettingsSkeleton />;
	}

	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			{/* Page Header */}
			<div>
				<h1 className="text-2xl font-bold mb-2">Settings</h1>
				<p className="text-muted-foreground">Manage your profile and course settings</p>
			</div>

			{/* Settings Tabs */}
			<Tabs defaultValue="profile" className="space-y-6">
				<TabsList className="h-10 w-full rounded">
					<TabsTrigger value="profile" className="rounded">
						<User className="h-4 w-4 mr-2" />
						Profile
					</TabsTrigger>
					<TabsTrigger value="course" className="rounded">
						<NotebookPen className="h-4 w-4 mr-2" />
						Course
					</TabsTrigger>
				</TabsList>

				{/* Profile Tab */}
				<TabsContent value="profile">
					<form onSubmit={handleSaveProfile}>
						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle>Profile Settings</CardTitle>
								<CardDescription>Update your personal information and credentials</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex justify-between w-full items-center gap-6">

									<div className="w-full space-y-2">
										<Label htmlFor="full_name">Full Name *</Label>
										<Input
											id="full_name"
											value={profileForm.full_name}
											onChange={(e) =>
												setProfileForm({ ...profileForm, full_name: e.target.value })
											}
											className="h-10"
											required
										/>
									</div>

									<div className="w-full space-y-2">
										<Label htmlFor="email">Email *</Label>
										<Input
											id="email"
											type="email"
											value={profileForm.email}
											className="h-10"
											onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
											required
										/>
									</div>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="phone_number">Phone Number *</Label>
									<Input
										id="phone_number"
										value={profileForm.phone_number}
										onChange={(e) =>
											setProfileForm({ ...profileForm, phone_number: e.target.value })
										}
										className="h-10"
										required
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="password">New Password</Label>
									<Input
										id="password"
										type="password"
										className="h-10"
										value={profileForm.password}
										onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
										placeholder="Leave blank to keep current password"
									/>
									<p className="text-xs text-muted-foreground">
										Only fill this if you want to change your password
									</p>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="instructor_bio">Instructor Bio</Label>
									<Textarea
										id="instructor_bio"
										value={profileForm.instructor_bio}
										onChange={(e) =>
											setProfileForm({ ...profileForm, instructor_bio: e.target.value })
										}
										placeholder="Your bio as an instructor"
										className="h-60!"
										rows={4}
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="instructor_image">Instructor Image</Label>
									<div className="flex items-start gap-4">
										{instructorImagePreview && (
											<div className="relative w-38 h-38 overflow-hidden border">
												<Image
													src={instructorImagePreview}
													alt="Instructor"
													fill
													className="object-cover"
												/>
												<button
													type="button"
													onClick={handleRemoveInstructorImage}
													className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
												>
													<X className="h-3 w-3" />
												</button>
											</div>
										)}
										<div className="flex-1">
											<Input
												ref={instructorImageInputRef}
												id="instructor_image"
												type="file"
												accept="image/*"
												onChange={handleInstructorImageChange}
												className="cursor-pointer h-10"
											/>
											<p className="text-xs text-muted-foreground mt-2">
												Upload an image for your instructor profile
											</p>
										</div>
									</div>
								</div>

								<Button type="submit" disabled={saving} className="h-10 px-6! mt-4">
									<Save className="h-4 w-4 mr-2" />
									{saving ?"Saving..." :"Save Profile"}
								</Button>
							</CardContent>
						</Card>
					</form>
				</TabsContent>

				{/* Course Tab */}
				<TabsContent value="course">
					<form onSubmit={handleSaveCourse}>
						<Card className="rounded-md shadow-xs">
							<CardHeader>
								<CardTitle>Course Settings</CardTitle>
								<CardDescription>Update course information and pricing</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-2">
									<Label htmlFor="course_title">Course Title *</Label>
									<Input
										id="course_title"
										value={courseForm.title}
										onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
										required
										className="h-10"
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="course_description">Description *</Label>
									<Textarea
										id="course_description"
										value={courseForm.description}
										onChange={(e) =>
											setCourseForm({ ...courseForm, description: e.target.value })
										}
										rows={4}
										className="h-60!"
										required
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="price">Price (KES) *</Label>
									<Input
										id="price"
										type="number"
										className="h-10"
										step="0.01"
										value={courseForm.price}
										onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
										required
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="course_thumbnail">Course Thumbnail</Label>
									<div className="flex items-start gap-4">
										{courseThumbnailPreview && (
											<div className="relative w-38 h-38 overflow-hidden border">
												<Image
													src={courseThumbnailPreview}
													alt="Course Thumbnail"
													fill
													className="object-cover"
												/>
												<button
													type="button"
													onClick={handleRemoveCourseThumbnail}
													className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
												>
													<X className="h-3 w-3" />
												</button>
											</div>
										)}
										<div className="flex-1">
											<Input
												ref={courseThumbnailInputRef}
												id="course_thumbnail"
												type="file"
												accept="image/*"
												onChange={handleCourseThumbnailChange}
												className="cursor-pointer h-10"
											/>
											<p className="text-xs text-muted-foreground mt-2">
												Upload a thumbnail image for the course
											</p>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div className="space-y-2">
										<Label htmlFor="course_published">Published</Label>
										<p className="text-xs text-muted-foreground">
											Make the course visible to students
										</p>
									</div>
									<Switch
										id="course_published"
										checked={courseForm.is_published}
										onCheckedChange={(checked) =>
											setCourseForm({ ...courseForm, is_published: checked })
										}
									/>
								</div>

								<Button type="submit" disabled={saving} className="h-10">
									<Save className="h-4 w-4 mr-2" />
									{saving ?"Saving..." :"Save Course Settings"}
								</Button>
							</CardContent>
						</Card>
					</form>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function SettingsSkeleton() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			<div>
				<Skeleton className="h-8 w-48 mb-2" />
				<Skeleton className="h-4 w-96" />
			</div>
			<Skeleton className="h-10 w-full max-w-md" />
			<Card className="rounded-sm shadow-none">
				<CardHeader>
					<Skeleton className="h-6 w-32 mb-2" />
					<Skeleton className="h-4 w-64" />
				</CardHeader>
				<CardContent className="space-y-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
