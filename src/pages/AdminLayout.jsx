import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, BarChart2, Users, AlertTriangle, DollarSign, LogOut, Shield, Menu, X } from "lucide-react";

const NAV = [
  { path: '/admin/dashboard', icon: BarChart2, label: 'Dashboard' },
  { path: '/admin/clients', icon: Users, label: 'Clients' },
  { path: '/admin/abandoned', icon: AlertTriangle, label: 'Abandoned' },
  { path: '/admin/revenue', icon: DollarSign, label: 'Revenue' },
  { path: '/admin/settings', icon: Shield, label: 'Security' },
];

export function useAdminAuth() {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: { ...options.headers, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (res.status === 401) { localStorage.removeItem('admin_token'); navigate('/admin'); return null; }
    return res;
  };

  return { token, authFetch };
}

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) navigate('/admin');
  }, []);

  const logout = () => { localStorage.removeItem('admin_token'); navigate('/admin'); };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-800">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">Blueprint Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-violet-600/20 text-violet-400 border border-violet-600/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        <header className="h-14 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-4 lg:px-6">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-gray-400">Admin</span>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
