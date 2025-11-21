"use client";

import { useQuery } from"@tanstack/react-query";
import { api } from"@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Badge } from"@/components/ui/badge";
import { Progress } from"@/components/ui/progress";
import { Separator } from"@/components/ui/separator";
import { UserStatisticsResponse } from"@/types";
import { Users, CheckCircle2, Clock, TrendingUp, Award } from"lucide-react";
import { formatDistanceToNow } from"date-fns";

interface UserStatisticsProps {
  period:"24H" |"7D" |"30D";
}

export function UserStatistics({ period }: UserStatisticsProps) {
  const { data: stats, isLoading } = useQuery<UserStatisticsResponse>({
    queryKey: ["analytics","users", period],
    queryFn: async () => {
      const response = await api.get(`/admin/analytics/users?period=${period}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
          <CardDescription>No enrolled students yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No student data available for this period</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_students}</div>
            <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed_students}</div>
            <p className="text-xs text-muted-foreground mt-1">Finished course</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.average_progress.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Overall progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Complete</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.average_completion_days && stats.average_completion_days > 0
                ? `${Math.round(stats.average_completion_days)}d`
                :"N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Days to finish</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Student Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Student Progress</CardTitle>
          <CardDescription>
            Detailed progress tracking for each enrolled student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.students.map((user, index) => (
              <div key={user.user_id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.full_name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.completed_at ? (
                        <Badge variant="default" className="gap-1">
                          <Award className="h-3 w-3" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="secondary">In Progress</Badge>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Course Progress</span>
                      <span className="font-medium">
                        {user.progress_percentage.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={user.progress_percentage} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Enrolled</p>
                      <p className="font-medium mt-0.5">
                        {formatDistanceToNow(new Date(user.enrolled_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {user.completed_at && (
                      <div>
                        <p className="text-muted-foreground">Completed</p>
                        <p className="font-medium mt-0.5">
                          {formatDistanceToNow(new Date(user.completed_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    )}
                    {user.time_to_completion_days !== undefined &&
                      user.time_to_completion_days > 0 && (
                        <div>
                          <p className="text-muted-foreground">Time to Complete</p>
                          <p className="font-medium mt-0.5">
                            {Math.round(user.time_to_completion_days)} days
                          </p>
                        </div>
                      )}
                    {user.last_accessed_at && !user.completed_at && (
                      <div>
                        <p className="text-muted-foreground">Last Active</p>
                        <p className="font-medium mt-0.5">
                          {formatDistanceToNow(new Date(user.last_accessed_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
