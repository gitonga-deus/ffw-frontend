"use client";

import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useProgress } from "@/hooks/useProgress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PaymentButton } from "@/components/payment/PaymentButton";
import { InlineError } from "@/components/error-display";
import { DashboardSkeleton } from "@/components/loading-skeletons/DashboardSkeleton";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  AlertCircle,
  Megaphone,
  PlayCircle,
  NotebookPen,
  Scroll,
} from "lucide-react";
import { EnrollmentStatusResponse, Announcement } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function StudentDashboard() {
  const { user } = useAuth();

  // Use new progress hook - only fetch if user is enrolled
  // This prevents 403 errors for non-enrolled users
  const { overallProgress, isLoadingOverall, overallError, refetchOverall } =
    useProgress({ enabled: user?.is_enrolled ?? false });

  // Fetch enrollment status
  const {
    data: enrollmentStatus,
    isLoading: enrollmentLoading,
    isError: enrollmentError,
    refetch: refetchEnrollment,
  } = useQuery<EnrollmentStatusResponse>({
    queryKey: ["enrollment"],
    queryFn: async () => {
      const response = await api.get("/enrollment/status");
      return response.data;
    },
    enabled: !!user?.is_enrolled,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });

  // Fetch announcements
  const {
    data: announcementsData,
    isLoading: announcementsLoading,
    isError: announcementsError,
    refetch: refetchAnnouncements,
  } = useQuery<{ announcements: Announcement[]; total: number }>({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await api.get("/announcements");
      return response.data;
    },
  });

  const announcements = announcementsData?.announcements || [];

  // Fetch course info
  const {
    data: courseData,
    isLoading: courseLoading,
    isError: courseError,
  } = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      const response = await api.get("/course");
      return response.data;
    },
  });

  // Fetch modules (public for non-enrolled, with progress for enrolled)
  const {
    data: modulesData,
    isLoading: modulesLoading,
    isError: modulesError,
  } = useQuery({
    queryKey: ["course-modules", user?.is_enrolled],
    queryFn: async () => {
      const endpoint = user?.is_enrolled
        ? "/course/modules"
        : "/course/modules/public";
      const response = await api.get(endpoint);
      return response.data;
    },
    enabled: !!user,
  });

  // Show loading skeleton while initial data is loading
  if (
    !user ||
    (user.is_enrolled &&
      (enrollmentLoading || isLoadingOverall || announcementsLoading))
  ) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user.full_name.split("")}!
          </h1>
          <p className="text-muted-foreground mt-2">
            {user.is_enrolled
              ? "Continue your learning journey"
              : "Ready to start your learning journey?"}
          </p>
        </div>

        {/* Status Banners - Show action items or celebration */}
        {!user.is_enrolled ? (
          <Card className="shadow-xs border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 mb-2">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-orange-900 mb-1">
                    Ready to Start Learning?
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    Enroll now to unlock all course materials and begin your
                    journey
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ) : !enrollmentStatus?.has_signature ? (
          <Card className="rounded-sm shadow-xs border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 mb-2">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900 mb-1">
                    One More Step!
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Complete your digital signature to unlock the course content
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ) : enrollmentStatus?.enrollment?.completed_at ? (
          <Card className="shadow-xs border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900 mb-2">
                Congratulations!
              </CardTitle>
              <CardDescription className="text-green-700">
                You&apos;ve successfully completed the course on{" "}
                <span className="font-semibold">
                  {new Date(
                    enrollmentStatus.enrollment.completed_at
                  ).toLocaleDateString()}
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
        ) : enrollmentError || overallError ? (
          <InlineError
            message="Failed to load enrollment data"
            onRetry={() => {
              refetchEnrollment();
              refetchOverall();
            }}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            {/* Progress Card */}
            <Card className="shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Course Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {`${Math.round(
                      overallProgress?.progress_percentage || 0
                    )}%`}
                  </div>
                  <Progress
                    value={overallProgress?.progress_percentage || 0}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {`${overallProgress?.completed_modules || 0} of ${
                      overallProgress?.total_modules || 0
                    } modules completed`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Enrollment Date Card */}
            <Card className="shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Enrolled Since
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-2xl font-bold">
                      {enrollmentStatus?.enrollment?.enrolled_at
                        ? new Date(
                            enrollmentStatus.enrollment.enrolled_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 pl-1">
                      {enrollmentStatus?.enrollment?.enrolled_at
                        ? formatDistanceToNow(
                            new Date(enrollmentStatus.enrollment.enrolled_at),
                            {
                              addSuffix: true,
                            }
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Accessed Card */}
            <Card className="shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Last Accessed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-sm font-medium">
                      {overallProgress?.last_accessed_at
                        ? formatDistanceToNow(
                            new Date(overallProgress.last_accessed_at),
                            {
                              addSuffix: true,
                            }
                          )
                        : "Not started"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {overallProgress?.last_accessed_content?.title ||
                        "No content accessed yet"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion Status Card */}
            <Card className="shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {enrollmentStatus?.enrollment?.completed_at ? (
                    <>
                      <div>
                        <Badge variant="secondary" className="">
                          Completed
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            enrollmentStatus.enrollment.completed_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* <NotebookPen className="h-5 w-5 text-primary" /> */}
                      <div>
                        <Badge
                          variant="default"
                          className="mb-2 px-3 bg-[#049ad1]"
                        >
                          In Progress
                        </Badge>
                        <p className="text-xs text-muted-foreground pl-1">
                          Keep learning!
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="font-bold mb-2">Quick Actions</CardTitle>
            <CardDescription>
              {!user.is_enrolled
                ? "Get started with your learning journey"
                : !enrollmentStatus?.has_signature
                ? "Complete your enrollment process"
                : enrollmentStatus?.enrollment?.completed_at
                ? "You've completed the course!"
                : overallProgress?.progress_percentage === 0
                ? "Start your learning journey"
                : "Continue your learning journey"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {!user.is_enrolled ? (
                  <PaymentButton className="h-10 bg-[#049ad1] hover:bg-[#0385b5]" />
                ) : !enrollmentStatus?.has_signature ? (
                  <Button
                    asChild
                    className="h-10 bg-orange-500 hover:bg-orange-600"
                  >
                    <Link href="/students/signature">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Complete Signature
                    </Link>
                  </Button>
                ) : enrollmentStatus?.enrollment?.completed_at ? (
                  <>
                    <Button
                      asChild
                      className="h-10 bg-green-600 hover:bg-green-700 px-4! rounded-sm"
                    >
                      <Link href="/students/certificate">
                        <Scroll className="mr-2 h-4 w-4" />
                        View Certificate
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-10 px-4! rounded-sm"
                    >
                      <Link href="/students/course">
                        <NotebookPen className="mr-2 h-4 w-4" />
                        Review Course
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="default"
                      className="bg-[#049ad1] hover:bg-[#049ad1]/80 px-4! h-10 rounded-sm"
                    >
                      <Link href={
                        overallProgress?.progress_percentage === 0 && modulesData?.[0]?.id
                          ? `/students/course/${modulesData[0].id}`
                          : "/students/course"
                      }>
                        <NotebookPen className="mr-2 h-4 w-4" />
                        {overallProgress?.progress_percentage === 0
                          ? "Start Learning"
                          : "Continue Learning"}
                      </Link>
                    </Button>
                    {overallProgress &&
                      overallProgress.last_accessed_content && (
                        <Button
                          asChild
                          variant="secondary"
                          className="px-4! h-10 rounded-sm"
                        >
                          <Link
                            href={`/students/course/${overallProgress.last_accessed_content.module_id}`}
                          >
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Resume Last Content
                          </Link>
                        </Button>
                      )}
                  </>
                )}
              </div>

              {/* Progress Display for Active Learning */}
              {user.is_enrolled &&
                enrollmentStatus?.has_signature &&
                !enrollmentStatus?.enrollment?.completed_at &&
                overallProgress && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Course Progress
                      </span>
                      <span className="font-semibold">
                        {Math.round(overallProgress.progress_percentage)}%
                      </span>
                    </div>
                    <Progress
                      value={overallProgress.progress_percentage}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {overallProgress.completed_modules} of{" "}
                      {overallProgress.total_modules} modules completed
                    </p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Course Info & Instructor Bio */}
        {courseData && (
          <div className="space-y-6">
            {/* Course Overview Card */}
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
                <CardDescription>
                  What you'll learn in this course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Grid: Image + Course Info */}
                <div className="grid md:grid-cols-6 gap-10">
                  {/* Left: Course Image */}
                  {courseData.thumbnail_url ? (
                    <div className="col-span-2 relative border rounded-sm overflow-hidden bg-muted h-full min-h-[500px]">
                      <Image
                        src={courseData.thumbnail_url}
                        alt={courseData.title}
                        fill
                        className="object-contain w-full p-6"
                        sizes="(max-width: 768px) 100vw, 350px"
                        priority
                        unoptimized
                      />
                      {user?.is_enrolled && overallProgress && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm z-10">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-[#049ad1] rounded-full transition-all duration-500"
                                style={{
                                  width: `${overallProgress.progress_percentage}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                              {Math.round(overallProgress.progress_percentage)}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Course Progress
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-linear-to-br from-blue-500 to-blue-600 h-full min-h-[250px] flex items-center justify-center">
                      <div className="text-center text-white p-6">
                        <NotebookPen className="h-16 w-16 mx-auto mb-3 opacity-80" />
                        <p className="font-semibold text-lg">
                          {courseData.title}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Right: Course Title & Description */}
                  <div className="flex flex-col justify-center col-span-4">
                    <h3 className="font-semibold text-xl mb-3">
                      {courseData.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {courseData.description}
                    </p>

                    {/* Module List - Full Width Below */}
                    {modulesData && modulesData.length > 0 && (
                      <div className=" mt-4 pt-6 border-t">
                        <h4 className="font-semibold mb-4 text-sm">
                          Course Modules
                        </h4>
                        <div className="grid gap-3 md:grid-cols-2">
                          {modulesData.map((module: any, index: number) => (
                            <div
                              key={module.id}
                              className="flex items-center gap-2 py-3 transition-colors"
                            >
                              <div className="flex items-center justify-center w-6 h-6 rounded-full text-primary text-sm font-semibold shrink-0">
                                {index + 1}.
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium leading-tight">
                                  {module.title}
                                </p>
                                {!user?.is_enrolled &&
                                  module.content_count !== undefined && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {module.content_count}{" "}
                                      {module.content_count === 1
                                        ? "lesson"
                                        : "lessons"}
                                    </p>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Bio Card */}
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>Your Instructor</CardTitle>
                <CardDescription>Learn from an expert</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Grid: Instructor Image + Info */}
                <div className="grid md:grid-cols-6 gap-10">
                  {/* Left: Instructor Image */}
                  {courseData.instructor_image_url ? (
                    <div className="col-span-2 relative rounded-sm overflow-hidden bg-muted h-full aspect-4/5">
                      <Image
                        src={courseData.instructor_image_url}
                        alt={courseData.instructor_name}
                        fill
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="col-span-2 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 h-full min-h-[250px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                          <span className="text-4xl font-bold text-primary">
                            {courseData.instructor_name.charAt(0)}
                          </span>
                        </div>
                        <p className="font-semibold text-lg text-foreground">
                          {courseData.instructor_name}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Right: Instructor Info */}
                  <div className="col-span-4 flex flex-col justify-center">
                    <h3 className="font-semibold text-2xl mb-4">
                      {courseData.instructor_name}
                    </h3>
                    <p className="text-gray-800 font-medium mb-4">
                      Course Instructor
                    </p>
                    {courseData.instructor_bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {courseData.instructor_bio}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Announcements Section */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Announcements
            </CardTitle>
            <CardDescription>
              Latest updates from your instructor
            </CardDescription>
          </CardHeader>
          <CardContent>
            {announcementsError ? (
              <InlineError
                message="Failed to load announcements"
                onRetry={() => refetchAnnouncements()}
              />
            ) : announcements && announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.slice(0, 5).map((announcement, index) => (
                  <div key={announcement.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(announcement.created_at),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No announcements yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
