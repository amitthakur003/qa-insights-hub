import { Bug, TestTube, XCircle, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { BuildTimeline } from "@/components/dashboard/BuildTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQADatabase } from "@/hooks/useQADatabase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Index() {
  const { 
    buildSummaries, 
    bugTrendData, 
    predictiveInsights, 
    overallStats,
    featureRiskAnalysis 
  } = useQADatabase();

  // Transform build summaries for timeline
  const timelineBuilds = buildSummaries.map(b => ({
    id: b.build_id,
    version: b.build_id,
    status: b.status,
    timestamp: new Date(b.build_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    testsRun: b.total_tests,
    testsPassed: b.passed,
    testsFailed: b.failed,
  }));

  // Transform insights
  const insightsList = predictiveInsights.map(i => ({
    id: i.id,
    type: i.type,
    title: i.title,
    description: i.description,
    action: i.action
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold tracking-tight">Release Cycle Overview</h2>
          <p className="text-muted-foreground">Monitor build health and quality metrics • Recent 5 builds</p>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Builds"
            value={String(overallStats.totalBuilds)}
            subtitle="In analysis window"
            icon={<TestTube className="h-5 w-5" />}
            variant="info"
          />
          <MetricCard
            title="Pass Rate"
            value={`${overallStats.passRate}%`}
            subtitle={`${overallStats.passedTests} / ${overallStats.totalTests} tests passing`}
            icon={<CheckCircle className="h-5 w-5" />}
            variant="success"
          />
          <MetricCard
            title="Failed Tests"
            value={String(overallStats.failedTests)}
            subtitle="In latest build"
            icon={<XCircle className="h-5 w-5" />}
            variant="danger"
          />
          <MetricCard
            title="Open Bugs"
            value={String(overallStats.openBugs)}
            subtitle={`${overallStats.p1Bugs} P1, ${overallStats.p2Bugs} P2, ${overallStats.p3Bugs} P3`}
            icon={<Bug className="h-5 w-5" />}
            variant="warning"
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
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="new_bugs"
                      name="New Bugs"
                      stroke="hsl(var(--priority-p1))"
                      fill="url(#bugsGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved_bugs"
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
          <InsightsPanel insights={insightsList} />
        </div>

        {/* Build Timeline and Feature Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BuildTimeline builds={timelineBuilds} />

          {/* Feature Risk Distribution */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Feature Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureRiskAnalysis.slice(0, 5).map((feature, index) => (
                  <div 
                    key={feature.feature_id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">{feature.feature_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {feature.passed_tests}/{feature.total_tests} ({feature.pass_rate}%)
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          feature.risk_level === 'high' ? 'bg-risk-high' :
                          feature.risk_level === 'medium' ? 'bg-risk-medium' : 'bg-risk-low'
                        }`}
                        style={{ width: `${feature.pass_rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
