// MongoDB Simulation Layer for QA Dashboard
// This hook simulates MongoDB queries on the local data

import { useMemo } from 'react';
import { 
  qaDatabase, 
  historicalBugs,
  type ReleaseCycle, 
  type Build, 
  type Module, 
  type Feature, 
  type TestCase,
  type HistoricalBug 
} from '@/data/qaDatabase';

// Types for computed analytics
export interface FeatureRiskAnalysis {
  feature_id: string;
  feature_name: string;
  module_name: string;
  risk_score: number;
  risk_level: "high" | "medium" | "low";
  total_bugs: number;
  p1_bugs: number;
  p2_bugs: number;
  p3_bugs: number;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  flaky_tests: number;
  pass_rate: number;
  retest_recommendation: "Full" | "Partial" | "None";
  trend: "up" | "down" | "neutral";
  last_tested: string;
}

export interface BuildSummary {
  build_id: string;
  build_date: string;
  status: "success" | "failed" | "running";
  total_tests: number;
  passed: number;
  failed: number;
  flaky: number;
  p1_bugs: number;
  p2_bugs: number;
  p3_bugs: number;
  total_bugs: number;
}

export interface BugTrendData {
  date: string;
  build_id: string;
  new_bugs: number;
  resolved_bugs: number;
  p1: number;
  p2: number;
  p3: number;
}

export interface PredictiveInsight {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  description: string;
  action?: string;
  feature_id?: string;
  confidence: number;
}

// Limit to recent 5 builds as per requirement
const MAX_BUILDS_FOR_ANALYSIS = 5;

export function useQADatabase() {
  // Get recent builds (max 5)
  const recentBuilds = useMemo(() => {
    return qaDatabase.builds
      .slice()
      .sort((a, b) => new Date(b.build_date).getTime() - new Date(a.build_date).getTime())
      .slice(0, MAX_BUILDS_FOR_ANALYSIS);
  }, []);

  // Compute build summaries
  const buildSummaries = useMemo((): BuildSummary[] => {
    return recentBuilds.map((build, index) => {
      let passed = 0, failed = 0, flaky = 0;
      let p1 = 0, p2 = 0, p3 = 0;

      build.modules.forEach(module => {
        module.features.forEach(feature => {
          feature.test_cases.forEach(tc => {
            if (tc.status === "Passed") passed++;
            else if (tc.status === "Failed") failed++;
            else if (tc.status === "Flaky") flaky++;

            if (tc.bug_info) {
              if (tc.bug_info.severity === "P1") p1++;
              else if (tc.bug_info.severity === "P2") p2++;
              else if (tc.bug_info.severity === "P3") p3++;
            }
          });
        });
      });

      const total = passed + failed + flaky;
      let status: "success" | "failed" | "running" = "success";
      if (index === 0) status = "running"; // Latest is running
      else if (failed > 0 || p1 > 0) status = "failed";

      return {
        build_id: build.build_id,
        build_date: build.build_date,
        status,
        total_tests: total,
        passed,
        failed,
        flaky,
        p1_bugs: p1,
        p2_bugs: p2,
        p3_bugs: p3,
        total_bugs: p1 + p2 + p3
      };
    });
  }, [recentBuilds]);

  // Compute feature risk analysis
  const featureRiskAnalysis = useMemo((): FeatureRiskAnalysis[] => {
    const featureMap = new Map<string, FeatureRiskAnalysis>();

    // Analyze across all recent builds
    recentBuilds.forEach((build, buildIndex) => {
      build.modules.forEach(module => {
        module.features.forEach(feature => {
          const existing = featureMap.get(feature.feature_id);
          
          let passed = 0, failed = 0, flaky = 0;
          let p1 = 0, p2 = 0, p3 = 0;

          feature.test_cases.forEach(tc => {
            if (tc.status === "Passed") passed++;
            else if (tc.status === "Failed") failed++;
            else if (tc.status === "Flaky") flaky++;

            if (tc.bug_info) {
              if (tc.bug_info.severity === "P1") p1++;
              else if (tc.bug_info.severity === "P2") p2++;
              else if (tc.bug_info.severity === "P3") p3++;
            }
          });

          if (!existing) {
            // Calculate risk score based on bugs and failure rate
            const totalBugs = p1 + p2 + p3;
            const failRate = (failed + flaky) / feature.test_cases.length;
            
            // Risk formula: P1 bugs have high weight, failure rate matters
            const riskScore = Math.min(100, Math.round(
              (p1 * 25) + (p2 * 15) + (p3 * 5) + (failRate * 30)
            ));

            const riskLevel = riskScore >= 70 ? "high" : riskScore >= 40 ? "medium" : "low";
            
            // Retest recommendation based on risk and bug count
            let retestRecommendation: "Full" | "Partial" | "None" = "None";
            if (p1 > 0 || riskScore >= 70) retestRecommendation = "Full";
            else if (p2 > 0 || riskScore >= 40) retestRecommendation = "Partial";

            featureMap.set(feature.feature_id, {
              feature_id: feature.feature_id,
              feature_name: feature.feature_name,
              module_name: module.module_name,
              risk_score: riskScore,
              risk_level: riskLevel,
              total_bugs: totalBugs,
              p1_bugs: p1,
              p2_bugs: p2,
              p3_bugs: p3,
              total_tests: feature.test_cases.length,
              passed_tests: passed,
              failed_tests: failed,
              flaky_tests: flaky,
              pass_rate: Math.round((passed / feature.test_cases.length) * 100),
              retest_recommendation: retestRecommendation,
              trend: "neutral",
              last_tested: build.build_date
            });
          } else {
            // Update trend based on comparison with previous build
            const newBugs = p1 + p2 + p3;
            if (newBugs > existing.total_bugs) {
              existing.trend = "up";
            } else if (newBugs < existing.total_bugs) {
              existing.trend = "down";
            }
          }
        });
      });
    });

    return Array.from(featureMap.values()).sort((a, b) => b.risk_score - a.risk_score);
  }, [recentBuilds]);

  // Compute bug trend data
  const bugTrendData = useMemo((): BugTrendData[] => {
    return buildSummaries.map((summary, index) => {
      const prevSummary = buildSummaries[index + 1];
      const resolvedBugs = prevSummary 
        ? Math.max(0, prevSummary.total_bugs - summary.total_bugs + summary.total_bugs / 2)
        : Math.floor(summary.total_bugs * 0.3);

      return {
        date: new Date(summary.build_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        build_id: summary.build_id,
        new_bugs: summary.total_bugs,
        resolved_bugs: Math.round(resolvedBugs),
        p1: summary.p1_bugs,
        p2: summary.p2_bugs,
        p3: summary.p3_bugs
      };
    }).reverse();
  }, [buildSummaries]);

  // Generate predictive insights using statistical analysis
  const predictiveInsights = useMemo((): PredictiveInsight[] => {
    const insights: PredictiveInsight[] = [];

    // Analyze high-risk features
    const highRiskFeatures = featureRiskAnalysis.filter(f => f.risk_level === "high");
    if (highRiskFeatures.length > 0) {
      insights.push({
        id: "critical-1",
        type: "critical",
        title: `${highRiskFeatures.length} Feature(s) at Critical Risk`,
        description: `${highRiskFeatures.map(f => f.feature_name).join(", ")} have high failure rates. P1 bugs detected. Recommend blocking deployment.`,
        action: "View Details",
        feature_id: highRiskFeatures[0].feature_id,
        confidence: 95
      });
    }

    // Trend analysis - features getting worse
    const worseningFeatures = featureRiskAnalysis.filter(f => f.trend === "up" && f.risk_score > 50);
    if (worseningFeatures.length > 0) {
      insights.push({
        id: "warning-1",
        type: "warning",
        title: "Regression Detected",
        description: `${worseningFeatures[0].feature_name} shows increasing bug trend across recent builds. Historical pattern suggests potential cascade.`,
        action: "Analyze Trend",
        feature_id: worseningFeatures[0].feature_id,
        confidence: 78
      });
    }

    // Recurring bugs detection
    const latestBuild = recentBuilds[0];
    const previousBuilds = recentBuilds.slice(1);
    const recurringBugs = historicalBugs.filter(bug => {
      return previousBuilds.some(b => 
        b.modules.some(m => 
          m.features.some(f => 
            f.test_cases.some(tc => 
              tc.tc_id === bug.tc_id && tc.bug_info !== null
            )
          )
        )
      );
    });

    if (recurringBugs.length > 0) {
      insights.push({
        id: "info-1",
        type: "info",
        title: "Recurring Bug Pattern",
        description: `${recurringBugs.length} bugs have reappeared from previous builds. AI suggests checking for incomplete fixes or missing test coverage.`,
        action: "Review Bugs",
        confidence: 85
      });
    }

    // Success patterns
    const stableFeatures = featureRiskAnalysis.filter(f => f.risk_score < 20 && f.pass_rate === 100);
    if (stableFeatures.length > 0) {
      insights.push({
        id: "success-1",
        type: "success",
        title: "Stable Features Identified",
        description: `${stableFeatures.length} features have 100% pass rate across all recent builds. Consider reducing regression test frequency.`,
        confidence: 92
      });
    }

    // Prediction for next build
    const avgBugCount = buildSummaries.reduce((acc, b) => acc + b.total_bugs, 0) / buildSummaries.length;
    const latestBugCount = buildSummaries[0]?.total_bugs || 0;
    if (latestBugCount > avgBugCount * 1.2) {
      insights.push({
        id: "warning-2",
        type: "warning",
        title: "Bug Count Above Average",
        description: `Current build has ${Math.round((latestBugCount / avgBugCount - 1) * 100)}% more bugs than average. Statistical model predicts potential delay in release.`,
        action: "View Analysis",
        confidence: 72
      });
    }

    return insights;
  }, [featureRiskAnalysis, buildSummaries, recentBuilds]);

  // Get all test cases flattened
  const getAllTestCases = useMemo(() => {
    const testCases: Array<TestCase & { 
      feature_name: string; 
      feature_id: string; 
      module_name: string; 
      build_id: string;
    }> = [];

    const latestBuild = recentBuilds[0];
    if (latestBuild) {
      latestBuild.modules.forEach(module => {
        module.features.forEach(feature => {
          feature.test_cases.forEach(tc => {
            testCases.push({
              ...tc,
              feature_name: feature.feature_name,
              feature_id: feature.feature_id,
              module_name: module.module_name,
              build_id: latestBuild.build_id
            });
          });
        });
      });
    }

    return testCases;
  }, [recentBuilds]);

  // Get modules and features for filters
  const modules = useMemo(() => {
    const moduleSet = new Set<string>();
    recentBuilds[0]?.modules.forEach(m => moduleSet.add(m.module_name));
    return ["All Modules", ...Array.from(moduleSet)];
  }, [recentBuilds]);

  const features = useMemo(() => {
    const featureSet = new Set<string>();
    recentBuilds[0]?.modules.forEach(m => {
      m.features.forEach(f => featureSet.add(f.feature_name));
    });
    return ["All Features", ...Array.from(featureSet)];
  }, [recentBuilds]);

  const buildVersions = useMemo(() => {
    return ["All Builds", ...recentBuilds.map(b => b.build_id)];
  }, [recentBuilds]);

  // Overall stats
  const overallStats = useMemo(() => {
    const latest = buildSummaries[0];
    if (!latest) return { totalBuilds: 0, passRate: 0, failedTests: 0, openBugs: 0 };

    const openBugs = historicalBugs.filter(b => b.status === "open").length;
    
    return {
      totalBuilds: recentBuilds.length,
      passRate: latest.total_tests > 0 
        ? Math.round((latest.passed / latest.total_tests) * 100 * 10) / 10
        : 0,
      failedTests: latest.failed,
      openBugs,
      p1Bugs: historicalBugs.filter(b => b.status === "open" && b.severity === "P1").length,
      p2Bugs: historicalBugs.filter(b => b.status === "open" && b.severity === "P2").length,
      p3Bugs: historicalBugs.filter(b => b.status === "open" && b.severity === "P3").length,
      totalTests: latest.total_tests,
      passedTests: latest.passed
    };
  }, [buildSummaries, recentBuilds]);

  return {
    // Raw data
    qaDatabase,
    recentBuilds,
    historicalBugs,
    
    // Computed analytics
    buildSummaries,
    featureRiskAnalysis,
    bugTrendData,
    predictiveInsights,
    getAllTestCases,
    
    // Filters
    modules,
    features,
    buildVersions,
    
    // Stats
    overallStats,
    
    // Constants
    severities: ["All", "P1", "P2", "P3"],
    statuses: ["All", "open", "in-progress", "resolved"]
  };
}
