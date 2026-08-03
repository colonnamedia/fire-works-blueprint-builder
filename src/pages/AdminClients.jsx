import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout, { useAdminAuth } from "./AdminLayout";
import { Search, Filter, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

const PRODUCT_LABELS = { blueprint: 'Business Blueprint', advertising: 'Advertising Strategy', website: 'Website Blueprint' };
const PRODUCT_COLORS = { blueprint: 'text-violet-400 bg-violet-400/10', advertising: 'text-blue-400 bg-blue-400/10', website: 'text-teal-400 bg-teal-400/10' };
const STATUS_COLORS = { paid: 'text-emerald-400 bg-emerald-400/10', unpaid: 'text-gray-400 bg-gray-400/10' };
const PRICES = { blueprint: 19.99, advertising: 14.99, website: 9.99 };

export default function AdminClients() {
  const { authFetch } = useAdminAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [product, setProduct] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const fetch_ = async () => {
    setLoading(true);
    const params = new URLSearchParams({ product, status, page });
    if (search) params.append('search', search);
    const res = await authFetch(`/api/admin/clients?${params}`);
    const data = await res?.json();
    if (data) setClients(data);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, [product, status, page]);
  useEffect(() => {
    const t = setTimeout(fetch_, 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Clients</h1>
        <p className="text-gray-500 text-sm mt-1">All users who submitted a form</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500" />
        </div>
        <select value={product} onChange={e => { setProduct(e.target.value); setPage(1); }}
          className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none">
          <option value="all">All Products</option>
          <option value="blueprint">Blueprint</option>
          <option value="advertising">Advertising</option>
          <option value="website">Website</option>
        </select>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none">
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Business</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Email</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3 hidden sm:table-cell">Product</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3 hidden md:table-cell">Status</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3 hidden lg:table-cell">Date</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Value</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-500 text-sm">Loading...</td></tr>
            ) : clients.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-500 text-sm">No clients found</td></tr>
            ) : clients.map((c, i) => (
              <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors"
                onClick={() => navigate(`/admin/client/${c.product}/${c.id}`)}>
                <td className="px-4 py-3 text-sm font-medium text-white">{c.business_name || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{c.email}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRODUCT_COLORS[c.product]}`}>{PRODUCT_LABELS[c.product]}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[c.payment_status] || STATUS_COLORS.unpaid}`}>{c.payment_status}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm font-medium text-emerald-400">{c.payment_status === 'paid' ? `$${PRICES[c.product]}` : '—'}</td>
                <td className="px-4 py-3"><ExternalLink className="w-3.5 h-3.5 text-gray-600" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <span className="text-sm text-gray-500">Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={clients.length < 25}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </AdminLayout>
  );
}
