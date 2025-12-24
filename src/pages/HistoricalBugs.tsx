import { useState } from "react";
import { Archive, Filter, Download, ExternalLink } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { historicalBugs, features, buildVersions, severities, statuses } from "@/data/mockData";
import { cn } from "@/lib/utils";

const severityBadges = {
  P1: "p1" as const,
  P2: "p2" as const,
  P3: "p3" as const,
};

const statusStyles = {
  open: { color: "text-priority-p1", bg: "bg-priority-p1/10", border: "border-priority-p1/30" },
  "in-progress": { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
  resolved: { color: "text-success", bg: "bg-success/10", border: "border-success/30" },
};

export default function HistoricalBugs() {
  const [selectedFeature, setSelectedFeature] = useState("All Features");
  const [selectedBuild, setSelectedBuild] = useState("All Builds");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredBugs = historicalBugs.filter(bug => {
    if (selectedFeature !== "All Features" && bug.feature !== selectedFeature) return false;
    if (selectedBuild !== "All Builds" && bug.build !== selectedBuild) return false;
    if (selectedSeverity !== "All" && bug.severity !== selectedSeverity) return false;
    if (selectedStatus !== "All" && bug.status !== selectedStatus) return false;
    return true;
  });

  const openCount = filteredBugs.filter(b => b.status === "open").length;
  const inProgressCount = filteredBugs.filter(b => b.status === "in-progress").length;
  const resolvedCount = filteredBugs.filter(b => b.status === "resolved").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Historical Bugs Vault</h2>
            <p className="text-muted-foreground">Browse and filter all reported bugs</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2">
              <Archive className="h-4 w-4" />
              Major Release Retest
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Filters:</span>
              </div>
              
              <Select value={selectedFeature} onValueChange={setSelectedFeature}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Feature" />
                </SelectTrigger>
                <SelectContent>
                  {features.map((feature) => (
                    <SelectItem key={feature} value={feature}>{feature}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBuild} onValueChange={setSelectedBuild}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Build" />
                </SelectTrigger>
                <SelectContent>
                  {buildVersions.map((build) => (
                    <SelectItem key={build} value={build}>{build}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  {severities.map((severity) => (
                    <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedFeature("All Features");
                  setSelectedBuild("All Builds");
                  setSelectedSeverity("All");
                  setSelectedStatus("All");
                }}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          <Card className="bg-priority-p1/5 border-priority-p1/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open</p>
                  <p className="text-2xl font-bold text-priority-p1">{openCount}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-priority-p1/20 flex items-center justify-center">
                  <span className="text-priority-p1 font-bold">{Math.round((openCount / filteredBugs.length) * 100) || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-warning/5 border-warning/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-warning">{inProgressCount}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                  <span className="text-warning font-bold">{Math.round((inProgressCount / filteredBugs.length) * 100) || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-success/5 border-success/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-success">{resolvedCount}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success font-bold">{Math.round((resolvedCount / filteredBugs.length) * 100) || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bugs Table */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Bug Reports ({filteredBugs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Feature</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Severity</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Build</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Assignee</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBugs.map((bug, index) => {
                    const statusStyle = statusStyles[bug.status];
                    return (
                      <tr 
                        key={bug.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-slide-up"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="py-4 px-4">
                          <span className="font-mono text-xs text-muted-foreground">{bug.id}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm font-medium">{bug.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[250px]">{bug.description}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm">{bug.feature}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant={severityBadges[bug.severity]}>{bug.severity}</Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            statusStyle.bg,
                            statusStyle.color,
                            statusStyle.border,
                            "border"
                          )}>
                            {bug.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs font-mono">{bug.build}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm">{bug.assignee}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-muted-foreground">{bug.createdAt}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredBugs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No bugs match the selected filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
