import { useState, useEffect } from "react";
import AdminLayout, { useAdminAuth } from "./AdminLayout";
import { DollarSign } from "lucide-react";

const PRODUCT_COLORS = { 'Business Blueprint': 'text-violet-400 bg-violet-400/10', 'Advertising Strategy': 'text-blue-400 bg-blue-400/10', 'Website Blueprint': 'text-teal-400 bg-teal-400/10' };

export default function AdminRevenue() {
  const { authFetch } = useAdminAuth();
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/admin/revenue')
      .then(r => r?.json())
      .then(d => { if (d) setRevenue(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = revenue.reduce((sum, r) => sum + (parseInt(r.amount_cents) || 0), 0);

  return (
    <AdminLayout>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Revenue</h1>
          <p className="text-gray-500 text-sm mt-1">All paid transactions</p>
        </div>
        <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-2xl px-5 py-3 text-right">
          <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-emerald-400">${(total/100).toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
        </div>
      ) : revenue.length === 0 ? (
        <div className="text-center py-20">
          <DollarSign className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No revenue yet</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Business</th>
                <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Email</th>
                <th className="text-left text-xs text-gray-500 font-medium px-4 py-3 hidden sm:table-cell">Product</th>
                <th className="text-left text-xs text-gray-500 font-medium px-4 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {revenue.map((r, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                  <td className="px-4 py-3 text-sm text-white">{r.business_name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{r.email}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRODUCT_COLORS[r.product] || 'text-gray-400 bg-gray-400/10'}`}>{r.product}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-bold text-emerald-400">${(parseInt(r.amount_cents)/100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
