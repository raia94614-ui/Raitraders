import React, { useState } from 'react';
import { Lock, Shield, ArrowRight, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onAuthenticated: () => void;
}

const PIN_STORAGE_KEY = 'raitraders_admin_pin_hash';
const DEFAULT_PASSCODE = 'raitraders2026';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onAuthenticated }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PASSCODE;

    if (passcode === storedPin || passcode === DEFAULT_PASSCODE) {
      onAuthenticated();
    } else {
      setError('Incorrect passcode. Please enter the valid admin passcode.');
    }
  };

  const handleDemoAccess = () => {
    onAuthenticated();
  };

  return (
    <div className="min-h-screen bg-[#0A0806] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#14100C] border border-[#2C241B] rounded-2xl p-8 shadow-2xl space-y-6">
        
        {/* Header Monogram */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E2B96F] to-[#996515] p-[1px] mx-auto shadow-lg shadow-[#D6A34D]/10">
            <div className="w-full h-full bg-[#1A1612] rounded-[15px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-[#D6A34D]" />
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold">
              RAI TRADERS • BHOPAL
            </span>
            <h1 className="font-heading text-2xl font-bold text-[#FAF7F2]">
              Admin Control Suite
            </h1>
            <p className="text-xs text-[#A89F91] mt-1">
              Browser-based studio manager with offline IndexedDB storage.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-xl bg-[#1A1612] border border-[#2C241B] flex items-start gap-3 text-xs text-[#A89F91]">
          <AlertCircle className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Client-Side Architecture:</strong> This administration suite runs entirely in your web browser. Content changes are saved to IndexedDB and can be exported as a static <strong>Deployment Pack (ZIP)</strong> for zero-cost hosting.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[#FAF7F2] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Admin Passcode</span>
            </label>
            <input
              type="password"
              required
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(null);
              }}
              placeholder={`Enter passcode (default: ${DEFAULT_PASSCODE})`}
              className="w-full px-4 py-3 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black font-bold uppercase tracking-wider text-xs hover:brightness-110 active:scale-98 transition-all shadow-lg cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Unlock Admin Panel</span>
          </button>
        </form>

        {/* Demo Fast-Track Access */}
        <div className="pt-2 text-center border-t border-[#2C241B]">
          <button
            onClick={handleDemoAccess}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enter Demo Mode (One-Click Access)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Back to Site */}
        <div className="text-center">
          <a href="#" className="text-[11px] text-[#A89F91] hover:text-white transition-colors">
            ← Return to Public Website
          </a>
        </div>

      </div>
    </div>
  );
};
