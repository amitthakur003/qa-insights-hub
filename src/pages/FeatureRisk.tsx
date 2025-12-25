import { AlertTriangle, TrendingUp, TrendingDown, Minus, RefreshCw, Shield } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQADatabase } from "@/hooks/useQADatabase";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const riskColors = {
  high: "hsl(var(--risk-high))",
  medium: "hsl(var(--risk-medium))",
  low: "hsl(var(--risk-low))",
};

const retestStyles = {
  Full: { variant: "destructive" as const, icon: RefreshCw },
  Partial: { variant: "warning" as const, icon: RefreshCw },
  None: { variant: "success" as const, icon: Shield },
};

export default function FeatureRisk() {
  const { featureRiskAnalysis } = useQADatabase();

  const chartData = featureRiskAnalysis.map(f => ({
    name: f.feature_name.split(" ")[0],
    score: f.risk_score,
    level: f.risk_level,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Feature Risk Dashboard</h2>
            <p className="text-muted-foreground">AI-powered risk scores and retest recommendations</p>
          </div>
          <Button className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Recalculate Risks
          </Button>
        </div>

        {/* Risk Score Chart */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Risk Score by Feature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]} 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Risk Score"]}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={riskColors[entry.level]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Feature Risk Table */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Feature Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Feature</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Module</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Risk Score</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Trend</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Bugs</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Pass Rate</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Retest</th>
                  </tr>
                </thead>
                <tbody>
                  {featureRiskAnalysis.map((feature, index) => {
                    const retestStyle = retestStyles[feature.retest_recommendation];
                    return (
                      <tr 
                        key={feature.feature_id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-sm">{feature.feature_name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-muted-foreground">{feature.module_name}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full"
                                style={{ 
                                  width: `${feature.risk_score}%`,
                                  backgroundColor: riskColors[feature.risk_level]
                                }}
                              />
                            </div>
                            <span className={cn(
                              "text-sm font-semibold",
                              feature.risk_level === "high" && "text-risk-high",
                              feature.risk_level === "medium" && "text-risk-medium",
                              feature.risk_level === "low" && "text-risk-low"
                            )}>
                              {feature.risk_score}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {feature.trend === "up" && <TrendingUp className="h-4 w-4 text-priority-p1 mx-auto" />}
                          {feature.trend === "down" && <TrendingDown className="h-4 w-4 text-success mx-auto" />}
                          {feature.trend === "neutral" && <Minus className="h-4 w-4 text-muted-foreground mx-auto" />}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-sm font-medium">{feature.total_bugs}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1">
                            {feature.p1_bugs > 0 && <Badge variant="p1" className="text-[10px]">P1: {feature.p1_bugs}</Badge>}
                            {feature.p2_bugs > 0 && <Badge variant="p2" className="text-[10px]">P2: {feature.p2_bugs}</Badge>}
                            {feature.p3_bugs > 0 && <Badge variant="p3" className="text-[10px]">P3: {feature.p3_bugs}</Badge>}
                            {feature.total_bugs === 0 && <span className="text-xs text-muted-foreground">None</span>}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={cn(
                            "text-sm font-medium",
                            feature.pass_rate >= 90 ? "text-success" : feature.pass_rate >= 70 ? "text-warning" : "text-priority-p1"
                          )}>
                            {feature.pass_rate}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant={retestStyle.variant} className="gap-1">
                            <retestStyle.icon className="h-3 w-3" />
                            {feature.retest_recommendation}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Risk Legend */}
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-high" />
            <span>High Risk (70-100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-medium" />
            <span>Medium Risk (40-69%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-low" />
            <span>Low Risk (0-39%)</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
