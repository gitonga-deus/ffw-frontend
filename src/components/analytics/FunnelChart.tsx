"use client";

import { FunnelMetrics } from"@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from"recharts";
import { ArrowRight } from"lucide-react";

interface FunnelChartProps {
    data: FunnelMetrics;
}

export function FunnelChart({ data }: FunnelChartProps) {
    const chartData = [
        {
            stage:"Visitors",
            count: data.visitors,
            rate: 100,
            color:"#3b82f6",
        },
        {
            stage:"Registered",
            count: data.registered,
            rate: data.visitor_to_registered_rate,
            color:"#8b5cf6",
        },
        {
            stage:"Enrolled",
            count: data.enrolled,
            rate: data.registered_to_enrolled_rate,
            color:"#10b981",
        },
        {
            stage:"Completed",
            count: data.completed,
            rate: data.enrolled_to_completed_rate,
            color:"#f59e0b",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Visual Funnel Representation */}
            <div className="space-y-3">
                {chartData.map((stage, index) => {
                    const widthPercentage = (stage.count / data.visitors) * 100;
                    const minWidth = 20; // Minimum width for visibility
                    const displayWidth = Math.max(widthPercentage, minWidth);

                    return (
                        <div key={stage.stage} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{stage.stage}</span>
                                    {index > 0 && (
                                        <span className="text-xs text-muted-foreground">
                                            ({stage.rate.toFixed(1)}% conversion)
                                        </span>
                                    )}
                                </div>
                                <span className="font-semibold">{stage.count.toLocaleString()}</span>
                            </div>
                            <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
                                <div
                                    className="h-full flex items-center justify-center text-white font-medium transition-all duration-500"
                                    style={{
                                        width: `${displayWidth}%`,
                                        backgroundColor: stage.color,
                                    }}
                                >
                                    {widthPercentage > 15 && (
                                        <span className="text-sm">{stage.count.toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                            {index < chartData.length - 1 && (
                                <div className="flex items-center justify-center py-1">
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Bar Chart Visualization */}
            <div className="pt-6 border-t">
                <h3 className="text-sm font-medium mb-4">Conversion Rates by Stage</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="stage"
                            className="text-xs"
                            tick={{ fill:"hsl(var(--muted-foreground))" }}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fill:"hsl(var(--muted-foreground))" }}
                            label={{ value:"Count", angle: -90, position:"insideLeft" }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor:"hsl(var(--background))",
                                border:"1px solid hsl(var(--border))",
                                borderRadius:"8px",
                            }}
                            formatter={(value: number) => [value.toLocaleString(),"Count"]}
                        />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">{data.visitors.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Visitors</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">{data.registered.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Registered</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">{data.enrolled.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Enrolled</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-amber-500">{data.completed.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Completed</p>
                </div>
            </div>
        </div>
    );
}
