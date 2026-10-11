import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Building,
  Sparkles,
  Layers,
  Image as ImageIcon,
  MoveHorizontal,
  MessageSquare,
  HelpCircle,
  Palette,
  History,
  Package,
  Undo2,
  Redo2,
  Save,
  Eye,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useDraftStore } from '../../store/draftStore';
import { useUiStore } from '../../store/uiStore';
import { defaultStorageAdapter } from '../../storage/indexedDbAdapter';
import { exportDeploymentPack } from '../../storage/zipPack';

import { AdminLogin } from './AdminLogin';
import { DashboardTab } from './tabs/DashboardTab';
import { BrandSettingsTab } from './tabs/BrandSettingsTab';
import { HeroSettingsTab } from './tabs/HeroSettingsTab';
import { ServicesManagerTab } from './tabs/ServicesManagerTab';
import { GalleryManagerTab } from './tabs/GalleryManagerTab';
import { BeforeAfterManagerTab } from './tabs/BeforeAfterManagerTab';
import { TestimonialsManagerTab } from './tabs/TestimonialsManagerTab';
import { FaqManagerTab } from './tabs/FaqManagerTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { BackupsTab } from './tabs/BackupsTab';
import { DeploymentPackTab } from './tabs/DeploymentPackTab';
import { PreviewSimulatorModal } from './PreviewSimulatorModal';

export const AdminShell: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    draft,
    isDirty,
    isPublishing,
    initDraft,
    undo,
    redo,
    canUndo,
    canRedo,
    publishDraft,
    discardDraft,
  } = useDraftStore();

  const showToast = useUiStore((s) => s.showToast);

  // Initialize draft on mount
  useEffect(() => {
    initDraft();
  }, [initDraft]);

  // Global Keyboard Shortcuts (Ctrl+Z for Undo, Ctrl+Y or Ctrl+Shift+Z for Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          if (canRedo()) redo();
        } else {
          e.preventDefault();
          if (canUndo()) undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        if (canRedo()) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const handlePublish = async () => {
    if (confirm('Publish all changes to live website? A snapshot backup will be created automatically.')) {
      try {
        await publishDraft();
      } catch {
        // toast handled in store
      }
    }
  };

  const handleDiscard = async () => {
    if (confirm('Discard all unsaved draft changes and reload published content?')) {
      await discardDraft();
    }
  };

  const handleExportPack = async () => {
    try {
      showToast('Generating static deployment bundle...', 'info');
      const zipBlob = await exportDeploymentPack(draft, defaultStorageAdapter);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raitraders_deployment_pack_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Deployment Pack (ZIP) ready!', 'success');
    } catch (err) {
      showToast('Failed to export pack: ' + String(err), 'error');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'brand', label: 'Brand & Contact', icon: <Building className="w-4 h-4" /> },
    { id: 'hero', label: 'Hero Headlines', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'services', label: 'Services Manager', icon: <Layers className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery Portfolio', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'beforeAfter', label: 'Before & After', icon: <MoveHorizontal className="w-4 h-4" /> },
    { id: 'testimonials', label: 'Client Reviews', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'faqs', label: 'Knowledge FAQs', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'backups', label: 'Snapshots & Rollback', icon: <History className="w-4 h-4" /> },
    { id: 'deployment', label: 'Export ZIP Pack', icon: <Package className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0A0806] text-[#FAF7F2] flex flex-col">
      
      {/* Top Header Bar */}
      <header className="h-16 border-b border-[#2C241B] bg-[#14100C]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
        
        {/* Brand & Mode */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E2B96F] to-[#996515] p-[1px]">
            <div className="w-full h-full bg-[#1A1612] rounded-[7px] flex items-center justify-center">
              <span className="font-heading text-sm font-bold text-[#F5DEB3]">RT</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-base font-bold text-white whitespace-nowrap">
                Rai Traders Admin
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#2C241B] text-[#D6A34D]">
                v2.0
              </span>
            </div>
          </div>
        </div>

        {/* State Indicators & Global Actions */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          
          {/* Draft Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1612] border border-[#2C241B]">
            {isDirty ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300 font-medium text-[11px]">Draft Modified</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-300 font-medium text-[11px]">Published</span>
              </>
            )}
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center gap-1 border border-[#2C241B] rounded-lg p-0.5 bg-[#0D0B09]">
            <button
              onClick={() => undo()}
              disabled={!canUndo()}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded text-[#A89F91] hover:text-white disabled:opacity-30 disabled:hover:text-[#A89F91] cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => redo()}
              disabled={!canRedo()}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded text-[#A89F91] hover:text-white disabled:opacity-30 disabled:hover:text-[#A89F91] cursor-pointer"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Preview Simulator */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2C241B] hover:border-[var(--accent)] text-[#A89F91] hover:text-white transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Preview</span>
          </button>

          {/* Discard Draft */}
          {isDirty && (
            <button
              onClick={handleDiscard}
              className="hidden lg:inline-flex px-3 py-1.5 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              Discard Draft
            </button>
          )}

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={isPublishing || !isDirty}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black font-bold uppercase tracking-wider text-xs hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing...' : 'Publish to Live'}</span>
          </button>

          {/* Exit / Return to public site */}
          <a
            href="#"
            title="Exit to public site"
            className="p-2 rounded-lg border border-[#2C241B] text-[#A89F91] hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </a>

        </div>

      </header>

      {/* Main Layout: Sidebar + Active Tab Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-60 border-r border-[#2C241B] bg-[#0E0C09] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          <nav className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7367] px-3 pb-2 block">
              Management Suite
            </span>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-[#D6A34D]/20 to-transparent border-l-2 border-[var(--accent)] text-[var(--accent)] font-bold'
                    : 'text-[#A89F91] hover:text-white hover:bg-[#14100C]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom Sidebar Info Card */}
          <div className="pt-4 border-t border-[#1C1814] space-y-2 text-[11px] text-[#7A7367]">
            <div className="flex items-center justify-between">
              <span>Client Database:</span>
              <span className="text-[#D6A34D] font-mono">IndexedDB</span>
            </div>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </aside>

        {/* Tab Content Stage */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#0A0806]">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardTab
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenPreview={() => setIsPreviewOpen(true)}
                onExportPack={handleExportPack}
              />
            )}
            {activeTab === 'brand' && <BrandSettingsTab />}
            {activeTab === 'hero' && <HeroSettingsTab />}
            {activeTab === 'services' && <ServicesManagerTab />}
            {activeTab === 'gallery' && <GalleryManagerTab />}
            {activeTab === 'beforeAfter' && <BeforeAfterManagerTab />}
            {activeTab === 'testimonials' && <TestimonialsManagerTab />}
            {activeTab === 'faqs' && <FaqManagerTab />}
            {activeTab === 'appearance' && <AppearanceTab />}
            {activeTab === 'backups' && <BackupsTab />}
            {activeTab === 'deployment' && <DeploymentPackTab />}
          </div>
        </main>

      </div>

      {/* Viewport Preview Modal */}
      <PreviewSimulatorModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

    </div>
  );
};
