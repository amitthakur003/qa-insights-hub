import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  AlertTriangle, 
  FileSearch, 
  Archive, 
  ChevronLeft,
  ChevronRight,
  Activity,
  Bell,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: "Release Overview", href: "/", icon: LayoutDashboard },
  { title: "Feature Risk", href: "/feature-risk", icon: AlertTriangle },
  { title: "Feature Deep Dive", href: "/feature-deep-dive", icon: FileSearch },
  { title: "Historical Bugs", href: "/historical-bugs", icon: Archive },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-sidebar-primary" />
              <span className="text-lg font-semibold text-sidebar-foreground">QA Analytics</span>
            </div>
          )}
          {collapsed && <Activity className="h-6 w-6 text-sidebar-primary mx-auto" />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground h-8 w-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        {!collapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="rounded-lg bg-sidebar-accent p-3">
              <p className="text-xs text-sidebar-foreground/70 mb-1">Current Build</p>
              <p className="text-sm font-medium text-sidebar-foreground">v2.4.1-beta</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {navItems.find(item => item.href === location.pathname)?.title || "Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground">Enterprise QA Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-priority-p1 text-[10px] text-white flex items-center justify-center">3</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-info flex items-center justify-center text-white text-sm font-medium">
              QA
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
