import { useState, useEffect } from "react";
import AdminLayout, { useAdminAuth } from "./AdminLayout";
import { AlertTriangle, Mail } from "lucide-react";

const PRODUCT_COLORS = { blueprint: 'text-violet-400 bg-violet-400/10', advertising: 'text-blue-400 bg-blue-400/10', website: 'text-teal-400 bg-teal-400/10' };
const PRODUCT_LABELS = { blueprint: 'Blueprint', advertising: 'Advertising', website: 'Website' };

export default function AdminAbandoned() {
  const { authFetch } = useAdminAuth();
  const [abandoned, setAbandoned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/admin/abandoned')
      .then(r => r?.json())
      .then(d => { if (d) setAbandoned(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const sendFollowUp = (email, product) => {
    window.open(`mailto:${email}?subject=Your ${PRODUCT_LABELS[product]} is waiting&body=Hi there,%0A%0AWe noticed you started building your ${PRODUCT_LABELS[product]} but didn't complete it. Your personalized strategy is ready — just complete checkout to receive it.%0A%0Ahttps://www.fireworks-businessblueprint.com%0A%0AFire-Works Business Blueprint`);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Abandoned</h1>
        <p className="text-gray-500 text-sm mt-1">Users who submitted but didn't complete payment — {abandoned.length} total</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
        </div>
      ) : abandoned.length === 0 ? (
        <div className="text-center py-20">
          <AlertTriangle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No abandoned submissions</p>
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
                <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Follow Up</th>
              </tr>
            </thead>
            <tbody>
              {abandoned.map((a, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                  <td className="px-4 py-3 text-sm text-white">{a.business_name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{a.email}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRODUCT_COLORS[a.product]}`}>{PRODUCT_LABELS[a.product]}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => sendFollowUp(a.email, a.product)}
                      className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-400/10 hover:bg-violet-400/20 px-3 py-1.5 rounded-lg transition-colors">
                      <Mail className="w-3 h-3" /> Follow Up
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
