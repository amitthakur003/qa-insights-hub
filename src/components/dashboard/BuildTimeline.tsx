import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, GitBranch } from "lucide-react";

interface Build {
  id: string;
  version: string;
  status: "success" | "failed" | "running";
  timestamp: string;
  testsRun: number;
  testsPassed: number;
  testsFailed: number;
}

interface BuildTimelineProps {
  builds: Build[];
  className?: string;
}

const statusStyles = {
  success: {
    icon: CheckCircle,
    bg: "bg-success",
    text: "text-success",
    badge: "success" as const,
  },
  failed: {
    icon: XCircle,
    bg: "bg-priority-p1",
    text: "text-priority-p1",
    badge: "destructive" as const,
  },
  running: {
    icon: Clock,
    bg: "bg-info",
    text: "text-info",
    badge: "info" as const,
  },
};

export function BuildTimeline({ builds, className }: BuildTimelineProps) {
  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <GitBranch className="h-5 w-5 text-info" />
          Build Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
          
          <div className="space-y-4">
            {builds.map((build, index) => {
              const style = statusStyles[build.status];
              const Icon = style.icon;
              
              return (
                <div 
                  key={build.id} 
                  className="relative flex gap-4 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Timeline dot */}
                  <div className={cn(
                    "relative z-10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0",
                    style.bg
                  )}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-card rounded-lg border p-3 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{build.version}</span>
                        <Badge variant={style.badge} className="text-[10px]">
                          {build.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{build.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{build.testsRun} tests</span>
                      <span className="text-success">{build.testsPassed} passed</span>
                      {build.testsFailed > 0 && (
                        <span className="text-priority-p1">{build.testsFailed} failed</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
