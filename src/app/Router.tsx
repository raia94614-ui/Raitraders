import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../features/public/HomePage';
import { PrivacyPolicyPage, TermsOfServicePage } from '../features/public/LegalPages';
import { ToastContainer } from '../components/ToastContainer';

// Lazy-load Admin shell to keep initial public bundle ultra-light
const AdminShell = lazy(() =>
  import('../features/admin/AdminShell').then((m) => ({ default: m.AdminShell }))
);

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#0D0B09] flex items-center justify-center text-xs text-[#A89F91]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      <span>Loading Rai Traders Studio...</span>
    </div>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminShell />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </HashRouter>
  );
};
