import { Sparkles, AlertCircle, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  type: "warning" | "success" | "info" | "critical";
  title: string;
  description: string;
  action?: string;
}

interface InsightsPanelProps {
  insights: Insight[];
  className?: string;
}

const insightStyles = {
  warning: {
    icon: AlertCircle,
    bg: "bg-warning/10",
    border: "border-warning/30",
    iconColor: "text-warning",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-success/10",
    border: "border-success/30",
    iconColor: "text-success",
  },
  info: {
    icon: TrendingUp,
    bg: "bg-info/10",
    border: "border-info/30",
    iconColor: "text-info",
  },
  critical: {
    icon: AlertCircle,
    bg: "bg-priority-p1/10",
    border: "border-priority-p1/30",
    iconColor: "text-priority-p1",
  },
};

export function InsightsPanel({ insights, className }: InsightsPanelProps) {
  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Sparkles className="h-5 w-5 text-info" />
          Predictive Insights
          <Badge variant="info" className="ml-auto text-[10px]">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => {
          const style = insightStyles[insight.type];
          const Icon = style.icon;
          
          return (
            <div
              key={insight.id}
              className={cn(
                "rounded-lg border p-3 transition-all duration-200 hover:shadow-sm animate-slide-up",
                style.bg,
                style.border
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", style.iconColor)} />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">{insight.title}</p>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                  {insight.action && (
                    <button className="text-xs font-medium text-info hover:underline mt-1">
                      {insight.action} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
