import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Lock, Eye, EyeOff, Shield } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState('login'); // login | 2fa
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.requires2fa) {
        setTempToken(data.tempToken);
        setStep('2fa');
      } else {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handle2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('admin_token', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Fire-Works Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Business Blueprint Control Panel</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          {step === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="admin@email.com"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-3 text-gray-500 hover:text-gray-300">
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50 transition-opacity hover:opacity-90">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handle2FA} className="space-y-4">
              <div className="text-center mb-2">
                <Shield className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                <p className="text-white font-medium text-sm">Two-Factor Authentication</p>
                <p className="text-gray-400 text-xs mt-1">Enter the 6-digit code from Google Authenticator</p>
              </div>
              <input
                type="text" value={code} onChange={e => setCode(e.target.value)} required maxLength={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm text-center tracking-widest text-lg focus:outline-none focus:border-violet-500"
                placeholder="000000"
              />
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button type="submit" disabled={loading || code.length !== 6}
                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button type="button" onClick={() => setStep('login')} className="w-full text-gray-500 text-xs hover:text-gray-300">
                ← Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
