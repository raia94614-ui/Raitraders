import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../features/public/HomePage';
import { PrivacyPolicyPage, TermsOfServicePage } from '../features/public/LegalPages';
import { ToastContainer } from '../components/ToastContainer';

// Lazy-load Admin shell to keep initial public bundle ultra-light
const AdminShell = lazy(() =>
  import('../features/admin/AdminShell').then((m) => ({ default: m.AdminShell }))
);

// Lazy-load 3D Visualizer (heavy Three.js bundle loaded only when needed)
const VisualizerPage = lazy(() =>
  import('../features/visualizer/ui/VisualizerView').then((m) => ({ default: m.VisualizerView }))
);

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#0B1530] flex items-center justify-center text-xs text-[#D4AF37]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-3 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin shadow-lg" />
      <span className="font-serif font-bold text-sm text-[#D4AF37]">Preparing 3D Villa Experience...</span>
      <span className="text-[11px] text-gray-400">Loading RAI Visualizer 3D Studio</span>
    </div>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
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
