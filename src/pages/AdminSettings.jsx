import { useState, useEffect } from "react";
import AdminLayout, { useAdminAuth } from "./AdminLayout";
import { Shield, Check, Copy } from "lucide-react";

export default function AdminSettings() {
  const { authFetch } = useAdminAuth();
  const [step, setStep] = useState('idle'); // idle | setup | confirm | done
  const [qrData, setQrData] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const setup2FA = async () => {
    const res = await authFetch('/api/admin/setup-2fa', { method: 'POST' });
    const data = await res?.json();
    if (data?.otpauth) { setQrData(data); setStep('setup'); }
  };

  const confirm2FA = async () => {
    setError('');
    const res = await authFetch('/api/admin/confirm-2fa', { method: 'POST', body: JSON.stringify({ code }) });
    const data = await res?.json();
    if (data?.success) setStep('done');
    else setError(data?.error || 'Invalid code');
  };

  const copySecret = () => {
    navigator.clipboard.writeText(qrData.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Security Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage two-factor authentication</p>
      </div>

      <div className="max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Google Authenticator</p>
              <p className="text-gray-500 text-xs">Two-factor authentication (TOTP)</p>
            </div>
          </div>

          {step === 'idle' && (
            <div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Add an extra layer of security to your admin account. After setup, you'll need a code from Google Authenticator every time you log in.
              </p>
              <button onClick={setup2FA}
                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90">
                Set Up 2FA
              </button>
            </div>
          )}

          {step === 'setup' && qrData && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">1. Open Google Authenticator on your phone</p>
              <p className="text-gray-400 text-sm">2. Tap the + button and select "Enter a setup key"</p>
              <p className="text-gray-400 text-sm">3. Enter this secret key manually:</p>
              <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                <code className="text-violet-400 text-sm font-mono flex-1 break-all">{qrData.secret}</code>
                <button onClick={copySecret} className="text-gray-400 hover:text-white flex-shrink-0">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-gray-400 text-sm">4. Enter the 6-digit code to confirm:</p>
              <input type="text" value={code} onChange={e => setCode(e.target.value)} maxLength={6}
                placeholder="000000" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-center tracking-widest text-lg focus:outline-none focus:border-violet-500" />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button onClick={confirm2FA} disabled={code.length !== 6}
                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50">
                Confirm & Enable 2FA
              </button>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-white font-semibold mb-2">2FA Enabled Successfully</p>
              <p className="text-gray-400 text-sm">Your account is now protected with Google Authenticator. You'll need your code every time you log in.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
