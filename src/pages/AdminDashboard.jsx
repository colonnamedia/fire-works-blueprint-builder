import { useState, useEffect } from "react";
import AdminLayout, { useAdminAuth } from "./AdminLayout";
import { DollarSign, Users, TrendingUp, AlertTriangle, LayoutGrid, Target, Globe } from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{label}</p>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function ProductCard({ label, icon: Icon, color, data, price }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <p className="text-sm font-semibold text-white">{label}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><p className="text-xs text-gray-500 mb-1">Total</p><p className="text-lg font-bold text-white">{data?.total || 0}</p></div>
        <div><p className="text-xs text-gray-500 mb-1">Paid</p><p className="text-lg font-bold text-emerald-400">{data?.paid || 0}</p></div>
        <div><p className="text-xs text-gray-500 mb-1">Revenue</p><p className="text-lg font-bold text-violet-400">${((parseInt(data?.revenue)||0)/100).toFixed(0)}</p></div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { authFetch } = useAdminAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/admin/analytics')
      .then(r => r?.json())
      .then(d => { if (d) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Fire-Works Business Blueprint overview</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Revenue" value={`$${((data?.total_revenue||0)/100).toFixed(2)}`} sub="All products" icon={DollarSign} color="bg-violet-600" />
            <StatCard label="Total Paid" value={data?.total_paid || 0} sub="Completed purchases" icon={TrendingUp} color="bg-emerald-600" />
            <StatCard label="Submissions" value={data?.total_submissions || 0} sub="All form starts" icon={Users} color="bg-blue-600" />
            <StatCard label="Conversion" value={`${data?.conversion_rate || 0}%`} sub="Submission to paid" icon={AlertTriangle} color="bg-amber-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ProductCard label="Business Blueprint" icon={LayoutGrid} color="bg-violet-600" data={data?.products?.blueprint} price={1999} />
            <ProductCard label="Advertising Strategy" icon={Target} color="bg-blue-600" data={data?.products?.advertising} price={1499} />
            <ProductCard label="Website Blueprint" icon={Globe} color="bg-teal-600" data={data?.products?.website} price={999} />
          </div>

          {data?.daily_chart?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-sm font-semibold text-white mb-4">Daily Blueprint Submissions (Last 30 days)</p>
              <div className="flex items-end gap-1 h-24">
                {data.daily_chart.map((d, i) => {
                  const max = Math.max(...data.daily_chart.map(x => parseInt(x.count)));
                  const height = max > 0 ? (parseInt(d.count) / max) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                        {d.date}: {d.count}
                      </div>
                      <div className="w-full bg-violet-600/80 rounded-t" style={{ height: `${height}%`, minHeight: height > 0 ? 4 : 0 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
