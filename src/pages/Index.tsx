import { Bug, TestTube, XCircle, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { BuildTimeline } from "@/components/dashboard/BuildTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { builds, bugTrendData, insights } from "@/data/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

export default function Index() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold tracking-tight">Release Cycle Overview</h2>
          <p className="text-muted-foreground">Monitor build health and quality metrics</p>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Builds"
            value="24"
            subtitle="This release cycle"
            icon={<TestTube className="h-5 w-5" />}
            variant="info"
            trend={{ value: 12, direction: "up", label: "vs last cycle" }}
          />
          <MetricCard
            title="Pass Rate"
            value="94.2%"
            subtitle="847 / 899 tests passing"
            icon={<CheckCircle className="h-5 w-5" />}
            variant="success"
            trend={{ value: 2.4, direction: "up", label: "improvement" }}
          />
          <MetricCard
            title="Failed Tests"
            value="52"
            subtitle="Across all builds"
            icon={<XCircle className="h-5 w-5" />}
            variant="danger"
            trend={{ value: 8, direction: "down", label: "reduced" }}
          />
          <MetricCard
            title="Open Bugs"
            value="15"
            subtitle="3 P1, 7 P2, 5 P3"
            icon={<Bug className="h-5 w-5" />}
            variant="warning"
            trend={{ value: 3, direction: "up", label: "new this week" }}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bug Trend Chart */}
          <Card className="lg:col-span-2 animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Bug Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bugTrendData}>
                    <defs>
                      <linearGradient id="bugsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--priority-p1))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--priority-p1))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="bugs"
                      name="New Bugs"
                      stroke="hsl(var(--priority-p1))"
                      fill="url(#bugsGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      name="Resolved"
                      stroke="hsl(var(--success))"
                      fill="url(#resolvedGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Insights Panel */}
          <InsightsPanel insights={insights} />
        </div>

        {/* Build Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BuildTimeline builds={builds} />

          {/* Test Distribution */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Test Distribution by Feature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Payment Processing", tests: 156, passed: 142, color: "bg-chart-1" },
                  { name: "User Authentication", tests: 203, passed: 198, color: "bg-chart-2" },
                  { name: "Dashboard Analytics", tests: 89, passed: 89, color: "bg-chart-3" },
                  { name: "Report Generation", tests: 124, passed: 108, color: "bg-chart-4" },
                  { name: "User Management", tests: 175, passed: 168, color: "bg-chart-5" },
                ].map((feature, index) => {
                  const passRate = Math.round((feature.passed / feature.tests) * 100);
                  return (
                    <div 
                      key={feature.name} 
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">{feature.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {feature.passed}/{feature.tests} ({passRate}%)
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${feature.color} rounded-full transition-all duration-500`}
                          style={{ width: `${passRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
