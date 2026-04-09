import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { LayoutGrid, FileText, Map, Target, BarChart3, Settings, Menu, X, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const isAdmin = user?.role === "admin";
  const isLanding = location.pathname === "/";

  if (isLanding) {
    return <Outlet />;
  }

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/builder", label: "Builder", icon: LayoutGrid },
    { path: "/journey", label: "Journey Map", icon: Map },
    { path: "/objectives", label: "Objectives", icon: Target },
    { path: "/results", label: "Results", icon: FileText },
    { path: "/print", label: "Print View", icon: BarChart3 },
  ];

  if (isAdmin) {
    navItems.push({ path: "/admin", label: "Admin", icon: Settings });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="no-print sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg hidden sm:block">Blueprint Builder</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user.full_name || user.email}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => base44.auth.logout()}
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}