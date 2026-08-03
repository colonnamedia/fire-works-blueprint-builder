import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout, { useAdminAuth } from "./AdminLayout";
import { ArrowLeft, Mail, Building, Globe, Target, LayoutGrid, CheckCircle, Clock } from "lucide-react";

const PRODUCT_ICONS = { blueprint: LayoutGrid, advertising: Target, website: Globe };
const PRODUCT_LABELS = { blueprint: 'Business Blueprint', advertising: 'Advertising Strategy', website: 'Website Blueprint' };
const PRICES = { blueprint: '$19.99', advertising: '$14.99', website: '$9.99' };

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-800/50 last:border-0">
      <span className="text-xs text-gray-500 w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-300 flex-1">{Array.isArray(value) ? value.join(', ') : value}</span>
    </div>
  );
}

export default function AdminClientProfile() {
  const { product, id } = useParams();
  const navigate = useNavigate();
  const { authFetch } = useAdminAuth();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch(`/api/admin/client/${product}/${id}`)
      .then(r => r?.json())
      .then(d => { if (d) setClient(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const Icon = PRODUCT_ICONS[product] || LayoutGrid;

  return (
    <AdminLayout>
      <button onClick={() => navigate('/admin/clients')}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </button>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
        </div>
      ) : !client ? (
        <p className="text-gray-500 text-sm">Client not found.</p>
      ) : (
        <div className="space-y-4 max-w-2xl">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{client.business_name || client.email}</h2>
                  <p className="text-gray-500 text-xs">{PRODUCT_LABELS[product]}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {client.payment_status === 'paid' ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 text-xs bg-emerald-400/10 px-3 py-1.5 rounded-full font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Paid {PRICES[product]}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-gray-400 text-xs bg-gray-400/10 px-3 py-1.5 rounded-full font-medium">
                    <Clock className="w-3.5 h-3.5" /> Unpaid
                  </span>
                )}
              </div>
            </div>
            <Row label="Email" value={client.email} />
            <Row label="Business" value={client.business_name} />
            <Row label="Created" value={new Date(client.created_at).toLocaleString()} />
            <Row label="Email Sent" value={client.email_sent ? 'Yes' : 'No'} />
          </div>

          {product === 'blueprint' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-4">Blueprint Submission Details</p>
              <Row label="What They Do" value={client.what_you_do} />
              <Row label="Ideal Customer" value={client.ideal_customer} />
              <Row label="Primary Goal" value={client.main_goal} />
              <Row label="Website Status" value={client.has_website} />
              <Row label="Current Marketing" value={client.current_marketing} />
              <Row label="Monthly Budget" value={client.monthly_budget} />
              <Row label="Years in Business" value={client.years_in_business} />
              <Row label="Biggest Challenge" value={client.biggest_challenge} />
              <Row label="Success in 90 Days" value={client.success_in_90_days} />
            </div>
          )}

          {product === 'advertising' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-4">Advertising Submission Details</p>
              <Row label="What They Sell" value={client.what_you_sell} />
              <Row label="Business Type" value={client.business_type} />
              <Row label="Ideal Customer" value={client.ideal_customer} />
              <Row label="Website Status" value={client.website_status} />
              <Row label="Pixel Status" value={client.pixel_status} />
              <Row label="Current Ads" value={client.current_ads} />
              <Row label="Ad Goal" value={client.ad_goal} />
              <Row label="Monthly Budget" value={client.monthly_budget} />
              <Row label="Competitor" value={client.biggest_competitor} />
              <Row label="Success Goal" value={client.success_goal} />
            </div>
          )}

          {product === 'website' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-4">Website Blueprint Details</p>
              <Row label="Business Type" value={client.business_type} />
              <Row label="Website Status" value={client.website_status} />
              <Row label="Builder" value={client.builder} />
              <Row label="Primary Goal" value={client.primary_goal} />
              <Row label="Primary CTA" value={client.primary_cta} />
              <Row label="Reservations" value={client.takes_reservations} />
              <Row label="Sells Online" value={client.sells_online} />
              <Row label="Emergency Service" value={client.emergency_service} />
              <Row label="Specific Notes" value={client.specific_notes} />
            </div>
          )}

          {(client.roadmap || client.strategy || client.blueprint) && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-3">Generated Output (Raw JSON)</p>
              <pre className="text-xs text-gray-400 overflow-auto max-h-64 bg-gray-950 rounded-xl p-4 leading-relaxed">
                {JSON.stringify(client.roadmap || client.strategy || client.blueprint, null, 2)}
              </pre>
            </div>
          )}

        </div>
      )}
    </AdminLayout>
  );
}
