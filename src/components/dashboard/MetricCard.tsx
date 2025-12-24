import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variantStyles = {
  default: "border-border",
  success: "border-success/30 bg-success/5",
  warning: "border-warning/30 bg-warning/5",
  danger: "border-priority-p1/30 bg-priority-p1/5",
  info: "border-info/30 bg-info/5",
};

const iconVariantStyles = {
  default: "bg-secondary text-foreground",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  danger: "bg-priority-p1/20 text-priority-p1",
  info: "bg-info/20 text-info",
};

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon, 
  variant = "default",
  className 
}: MetricCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md animate-fade-in",
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className={cn(
              "rounded-lg p-2.5",
              iconVariantStyles[variant]
            )}>
              {icon}
            </div>
          )}
        </div>
        
        {trend && (
          <div className="mt-3 flex items-center gap-1.5">
            {trend.direction === "up" && (
              <TrendingUp className={cn(
                "h-4 w-4",
                variant === "danger" || variant === "warning" ? "text-priority-p1" : "text-success"
              )} />
            )}
            {trend.direction === "down" && (
              <TrendingDown className={cn(
                "h-4 w-4",
                variant === "success" || variant === "info" ? "text-priority-p1" : "text-success"
              )} />
            )}
            {trend.direction === "neutral" && (
              <Minus className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={cn(
              "text-sm font-medium",
              trend.direction === "up" && (variant === "danger" || variant === "warning") && "text-priority-p1",
              trend.direction === "up" && variant !== "danger" && variant !== "warning" && "text-success",
              trend.direction === "down" && (variant === "success" || variant === "info") && "text-priority-p1",
              trend.direction === "down" && variant !== "success" && variant !== "info" && "text-success",
              trend.direction === "neutral" && "text-muted-foreground"
            )}>
              {trend.value > 0 ? "+" : ""}{trend.value}%
            </span>
            {trend.label && (
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
