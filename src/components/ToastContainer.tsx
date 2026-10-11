import React from 'react';
import { useUiStore } from '../store/uiStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUiStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-3.5 rounded-xl border backdrop-blur-md shadow-2xl flex items-start gap-3 pointer-events-auto transition-all text-xs ${
            t.type === 'success'
              ? 'bg-[#14100C]/95 border-emerald-500/40 text-emerald-300'
              : t.type === 'error'
              ? 'bg-[#14100C]/95 border-red-500/40 text-red-300'
              : 'bg-[#14100C]/95 border-[#D6A34D]/40 text-[#FAF7F2]'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : t.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <Info className="w-4 h-4 text-[var(--accent)]" />
            )}
          </div>

          <p className="flex-1 leading-relaxed">{t.message}</p>

          <button
            onClick={() => removeToast(t.id)}
            className="p-1 rounded text-stone-400 hover:text-white shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
