import { useState } from "react";
import { FileSearch, AlertCircle, CheckCircle, XCircle, Clock, Sparkles, ChevronDown, ChevronUp, Code } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQADatabase } from "@/hooks/useQADatabase";
import { cn } from "@/lib/utils";

const statusStyles = {
  Passed: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", badge: "success" as const },
  Failed: { icon: XCircle, color: "text-priority-p1", bg: "bg-priority-p1/10", badge: "destructive" as const },
  Flaky: { icon: Clock, color: "text-warning", bg: "bg-warning/10", badge: "warning" as const },
};

const priorityBadges = {
  P1: "p1" as const,
  P2: "p2" as const,
  P3: "p3" as const,
};

export default function FeatureDeepDive() {
  const { getAllTestCases, features } = useQADatabase();
  const [selectedFeature, setSelectedFeature] = useState("All Features");
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [showScript, setShowScript] = useState<string | null>(null);

  const filteredTests = selectedFeature === "All Features"
    ? getAllTestCases
    : getAllTestCases.filter(tc => tc.feature_name === selectedFeature);

  const passedCount = filteredTests.filter(t => t.status === "Passed").length;
  const failedCount = filteredTests.filter(t => t.status === "Failed").length;
  const flakyCount = filteredTests.filter(t => t.status === "Flaky").length;
  const scriptIssueCount = filteredTests.filter(t => t.bug_info !== null).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Feature Deep Dive</h2>
            <p className="text-muted-foreground">Detailed test case analysis with AI insights & scripts</p>
          </div>
          <Select value={selectedFeature} onValueChange={setSelectedFeature}>
            <SelectTrigger className="w-[220px]">
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
                <p className="text-2xl font-bold">{passedCount}</p>
                <p className="text-sm text-muted-foreground">Passed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-priority-p1/5 border-priority-p1/30">
            <CardContent className="p-4 flex items-center gap-3">
              <XCircle className="h-8 w-8 text-priority-p1" />
              <div>
                <p className="text-2xl font-bold">{failedCount}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-warning/5 border-warning/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{flakyCount}</p>
                <p className="text-sm text-muted-foreground">Flaky</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-info/5 border-info/30">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-info" />
              <div>
                <p className="text-2xl font-bold">{scriptIssueCount}</p>
                <p className="text-sm text-muted-foreground">With Bugs</p>
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
              const isExpanded = expandedTest === test.tc_id;
              const isScriptVisible = showScript === test.tc_id;
              
              return (
                <div 
                  key={test.tc_id}
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
                    onClick={() => setExpandedTest(isExpanded ? null : test.tc_id)}
                  >
                    <StatusIcon className={cn("h-5 w-5 flex-shrink-0", status.color)} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">{test.tc_id}</span>
                        {test.bug_info && (
                          <Badge variant={priorityBadges[test.bug_info.severity]} className="text-[10px]">
                            {test.bug_info.severity}
                          </Badge>
                        )}
                        {test.bug_info && (
                          <Badge variant="outline" className="text-[10px] border-warning text-warning">
                            Bug Found
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">{test.title}</p>
                      <p className="text-xs text-muted-foreground">{test.feature_name} • {test.module_name}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant={status.badge} className="text-[10px]">
                        {test.status}
                      </Badge>
                      {(test.bug_info || test.script_content) && (
                        isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-border/30 mt-0">
                      <div className="mt-4 space-y-4">
                        {/* Error message */}
                        {test.bug_info && (
                          <div className="bg-card rounded-lg p-3 border border-border/50">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Error Log</p>
                            <code className="text-sm text-priority-p1 font-mono">{test.bug_info.error_log}</code>
                          </div>
                        )}

                        {/* AI Explanation */}
                        {test.bug_info?.ai_analysis && (
                          <div className="bg-info/10 rounded-lg p-3 border border-info/30">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="h-4 w-4 text-info" />
                              <p className="text-xs font-medium text-info">AI Analysis</p>
                            </div>
                            <p className="text-sm text-foreground">{test.bug_info.ai_analysis}</p>
                          </div>
                        )}

                        {/* Script Content Toggle */}
                        <div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowScript(isScriptVisible ? null : test.tc_id);
                            }}
                          >
                            <Code className="h-3 w-3" />
                            {isScriptVisible ? "Hide Script" : "View Script"}
                          </Button>
                        </div>

                        {/* Script Content */}
                        {isScriptVisible && (
                          <div className="bg-card rounded-lg p-3 border border-border/50 overflow-x-auto">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Test Script (Selenium)</p>
                            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                              {test.script_content}
                            </pre>
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
                          {test.bug_info && (
                            <Button size="sm" variant="outline" className="text-xs">
                              View Bug Report
                            </Button>
                          )}
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
