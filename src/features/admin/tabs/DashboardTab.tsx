import React from 'react';
import { Layers, Image as ImageIcon, MessageSquare, HelpCircle, HardDrive, Download, Eye, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useDraftStore } from '../../../store/draftStore';

interface DashboardTabProps {
  onNavigateTab: (tabId: string) => void;
  onOpenPreview: () => void;
  onExportPack: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  onNavigateTab,
  onOpenPreview,
  onExportPack,
}) => {
  const { draft, isDirty } = useDraftStore();

  const totalServices = draft.services.length;
  const totalGallery = draft.gallery.length;
  const realGallery = draft.gallery.filter((g) => !g.isSampleImage).length;
  const sampleGallery = draft.gallery.filter((g) => g.isSampleImage).length;
  const totalReviews = draft.testimonials.length;
  const totalFaqs = draft.faqs.length;

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1A1612] via-[#241E18] to-[#1A1612] border border-[#3D3224] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent)]">
              Studio Content Manager
            </span>
            {isDirty ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <AlertTriangle className="w-3 h-3" />
                Unpublished Changes in Draft
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                Published & In Sync
              </span>
            )}
          </div>

          <h2 className="font-heading text-2xl font-bold text-[#FAF7F2] mt-1">
            Welcome to RAI TRADERS Control Panel
          </h2>
          <p className="text-xs text-[#A89F91]">
            Manage bilingual content, upload portfolio photos, tune visualizers, and export static deployment packs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenPreview}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D6A34D]/40 bg-[#14100C] hover:bg-[#D6A34D]/15 text-[#FAF7F2] text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Preview Draft</span>
          </button>

          <button
            onClick={onExportPack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black text-xs font-bold tracking-wider uppercase hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ZIP Pack</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Services Card */}
        <div
          onClick={() => onNavigateTab('services')}
          className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] hover:border-[var(--accent)]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[#A89F91]">Active Services</span>
            <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-heading text-3xl font-bold text-white">{totalServices}</span>
            <span className="text-xs text-[#A89F91] block mt-0.5">Custom Wall Finishes</span>
          </div>
        </div>

        {/* Gallery Card */}
        <div
          onClick={() => onNavigateTab('gallery')}
          className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] hover:border-[var(--accent)]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[#A89F91]">Gallery Images</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-heading text-3xl font-bold text-white">{totalGallery}</span>
            <span className="text-xs text-[#A89F91] block mt-0.5">
              {realGallery} Real Projects • {sampleGallery} Concepts
            </span>
          </div>
        </div>

        {/* Reviews Card */}
        <div
          onClick={() => onNavigateTab('testimonials')}
          className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] hover:border-[var(--accent)]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[#A89F91]">Client Reviews</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-heading text-3xl font-bold text-white">{totalReviews}</span>
            <span className="text-xs text-[#A89F91] block mt-0.5">Bhopal Local Feedback</span>
          </div>
        </div>

        {/* FAQs Card */}
        <div
          onClick={() => onNavigateTab('faqs')}
          className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] hover:border-[var(--accent)]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[#A89F91]">Knowledge FAQs</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-heading text-3xl font-bold text-white">{totalFaqs}</span>
            <span className="text-xs text-[#A89F91] block mt-0.5">Client Guidance Questions</span>
          </div>
        </div>

      </div>

      {/* Architecture & Publishing Workflow Guide */}
      <div className="p-6 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="font-heading text-lg font-bold text-[#FAF7F2]">
            Static Publishing Architecture (No Backend Required)
          </h3>
        </div>

        <p className="text-xs text-[#C8BFB2] leading-relaxed">
          Rai Traders is engineered with an honest frontend-only publishing model. Whenever you edit content here, it is instantly stored locally in your browser’s IndexedDB with undo/redo capabilities. To make your changes live across the internet for all visitors:
        </p>

        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#1A1612] border border-[#2C241B] space-y-1.5">
            <span className="text-xs font-bold text-[var(--accent)]">1. Publish in Browser</span>
            <p className="text-[11px] text-[#A89F91]">
              Click "Publish to Live Site". Creates an automatic rollback snapshot and updates your device immediately.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1A1612] border border-[#2C241B] space-y-1.5">
            <span className="text-xs font-bold text-[var(--accent)]">2. Export Deployment Pack</span>
            <p className="text-[11px] text-[#A89F91]">
              Click "Export ZIP Pack" to download a clean bundle containing <code>content.json</code> and all custom images.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1A1612] border border-[#2C241B] space-y-1.5">
            <span className="text-xs font-bold text-[var(--accent)]">3. Permanent Web Host</span>
            <p className="text-[11px] text-[#A89F91]">
              Unzip the archive into your static host (Netlify, Vercel, or GitHub Pages) for 100% free, permanent global hosting!
            </p>
          </div>
        </div>

        {draft.lastPublished && (
          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#A89F91]">
            <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Last published: {new Date(draft.lastPublished).toLocaleString()}</span>
          </div>
        )}
      </div>

    </div>
  );
};
