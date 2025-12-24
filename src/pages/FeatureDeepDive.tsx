import { useState } from "react";
import { FileSearch, AlertCircle, CheckCircle, XCircle, Clock, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { testCases, features } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusStyles = {
  passed: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", badge: "success" as const },
  failed: { icon: XCircle, color: "text-priority-p1", bg: "bg-priority-p1/10", badge: "destructive" as const },
  flaky: { icon: Clock, color: "text-warning", bg: "bg-warning/10", badge: "warning" as const },
};

const priorityBadges = {
  P1: "p1" as const,
  P2: "p2" as const,
  P3: "p3" as const,
};

export default function FeatureDeepDive() {
  const [selectedFeature, setSelectedFeature] = useState("All Features");
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  const filteredTests = selectedFeature === "All Features"
    ? testCases
    : testCases.filter(tc => tc.feature === selectedFeature);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Feature Deep Dive</h2>
            <p className="text-muted-foreground">Detailed test case analysis with AI insights</p>
          </div>
          <Select value={selectedFeature} onValueChange={setSelectedFeature}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Feature" />
            </SelectTrigger>
            <SelectContent>
              {features.map((feature) => (
                <SelectItem key={feature} value={feature}>{feature}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
          <Card className="bg-success/5 border-success/30">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{filteredTests.filter(t => t.status === "passed").length}</p>
                <p className="text-sm text-muted-foreground">Passed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-priority-p1/5 border-priority-p1/30">
            <CardContent className="p-4 flex items-center gap-3">
              <XCircle className="h-8 w-8 text-priority-p1" />
              <div>
                <p className="text-2xl font-bold">{filteredTests.filter(t => t.status === "failed").length}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-warning/5 border-warning/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{filteredTests.filter(t => t.status === "flaky").length}</p>
                <p className="text-sm text-muted-foreground">Flaky</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-info/5 border-info/30">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-info" />
              <div>
                <p className="text-2xl font-bold">{filteredTests.filter(t => t.hasScriptIssue).length}</p>
                <p className="text-sm text-muted-foreground">Script Issues</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Cases List */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-info" />
              Test Cases ({filteredTests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredTests.map((test, index) => {
              const status = statusStyles[test.status];
              const StatusIcon = status.icon;
              const isExpanded = expandedTest === test.id;
              
              return (
                <div 
                  key={test.id}
                  className={cn(
                    "rounded-lg border transition-all duration-200 animate-slide-up",
                    status.bg,
                    "border-border/50 hover:border-border"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Main row */}
                  <div 
                    className="flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => setExpandedTest(isExpanded ? null : test.id)}
                  >
                    <StatusIcon className={cn("h-5 w-5 flex-shrink-0", status.color)} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">{test.id}</span>
                        <Badge variant={priorityBadges[test.priority]} className="text-[10px]">
                          {test.priority}
                        </Badge>
                        {test.hasScriptIssue && (
                          <Badge variant="outline" className="text-[10px] border-warning text-warning">
                            Script Issue
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">{test.name}</p>
                      <p className="text-xs text-muted-foreground">{test.feature}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{test.duration}</span>
                      <span>{test.lastRun}</span>
                      <Badge variant={status.badge} className="text-[10px]">
                        {test.status}
                      </Badge>
                      {(test.status !== "passed" || test.hasScriptIssue) && (
                        isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && test.errorMessage && (
                    <div className="px-4 pb-4 pt-0 border-t border-border/30 mt-0">
                      <div className="mt-4 space-y-4">
                        {/* Error message */}
                        <div className="bg-card rounded-lg p-3 border border-border/50">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Error Message</p>
                          <code className="text-sm text-priority-p1 font-mono">{test.errorMessage}</code>
                        </div>

                        {/* AI Explanation */}
                        {test.aiExplanation && (
                          <div className="bg-info/10 rounded-lg p-3 border border-info/30">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="h-4 w-4 text-info" />
                              <p className="text-xs font-medium text-info">AI Analysis</p>
                            </div>
                            <p className="text-sm text-foreground">{test.aiExplanation}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            View Full Log
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Re-run Test
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Create Bug Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
