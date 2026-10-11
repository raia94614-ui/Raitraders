import React, { useState } from 'react';
import { Download, Upload, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDraftStore } from '../../../store/draftStore';
import { useUiStore } from '../../../store/uiStore';
import { defaultStorageAdapter } from '../../../storage/indexedDbAdapter';
import { exportDeploymentPack, importDeploymentPack } from '../../../storage/zipPack';

export const DeploymentPackTab: React.FC = () => {
  const { draft, setDraftDirectly } = useDraftStore();
  const showToast = useUiStore((s) => s.showToast);

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      showToast('Packaging content.json and custom media assets...', 'info');
      const zipBlob = await exportDeploymentPack(draft, defaultStorageAdapter);

      // Trigger download
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raitraders_deployment_pack_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Deployment Pack (ZIP) exported successfully!', 'success');
    } catch (err) {
      showToast('Failed to export ZIP pack: ' + String(err), 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      showToast('Reading and validating ZIP Deployment Pack...', 'info');
      const { content, importedImagesCount } = await importDeploymentPack(file, defaultStorageAdapter);
      await setDraftDirectly(content);

      showToast(
        `Import successful! Restored content with ${importedImagesCount} media assets.`,
        'success'
      );
    } catch (err) {
      showToast('Import failed: ' + String(err), 'error');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-[#FAF7F2]">
          Static Deployment Pack (ZIP)
        </h2>
        <p className="text-xs text-[#A89F91]">
          Bundle all site copy, bilingual translations, and uploaded media into a standalone archive.
        </p>
      </div>

      {/* Main Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 text-xs">
        
        {/* Export Card */}
        <div className="p-6 rounded-2xl border-2 border-[var(--accent)]/40 bg-[#14100C] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>

            <h3 className="font-heading text-xl font-bold text-white">
              Export Deployment Bundle
            </h3>

            <p className="text-[#C8BFB2] leading-relaxed">
              Downloads a compressed <code>.zip</code> package containing:
            </p>

            <ul className="space-y-1.5 text-[#A89F91]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span><code>content.json</code> (All English & Hindi site data)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span><code>/content-assets/</code> (All custom uploaded WebP photos)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span><code>manifest.json</code> & Static Hosting Guide</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black font-bold uppercase tracking-wider text-xs hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating ZIP...' : 'Download Deployment Pack (ZIP)'}</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="p-6 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>

            <h3 className="font-heading text-xl font-bold text-white">
              Restore from Deployment Pack
            </h3>

            <p className="text-[#C8BFB2] leading-relaxed">
              Moving to another computer, new browser, or restoring from a backup? Select your previously downloaded ZIP file to instantly restore all data.
            </p>

            <div className="p-3 rounded-xl bg-[#1A1612] border border-[#2C241B] text-[11px] text-[#A89F91] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Restores both text content and binary image assets into browser IndexedDB.
              </span>
            </div>
          </div>

          <label className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#D6A34D]/40 bg-[#1A1612] hover:bg-[#D6A34D]/15 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-[var(--accent)]" />
            <span>{isImporting ? 'Importing Pack...' : 'Select ZIP Pack to Restore'}</span>
            <input
              type="file"
              accept=".zip,application/zip"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
            />
          </label>
        </div>

      </div>

      {/* Deployment Guide Details */}
      <div className="p-6 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="font-heading text-lg font-bold text-white">
            How to Deploy for Permanent Global Hosting
          </h3>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-[#A89F91]">
          <div className="space-y-1">
            <strong className="text-white block">Netlify Drop (Easiest)</strong>
            <p>
              Log in to Netlify, drag your project's <code>dist</code> folder or unzipped deployment pack directly into the Sites tab for instant global publishing.
            </p>
          </div>

          <div className="space-y-1">
            <strong className="text-white block">GitHub Pages / Vercel</strong>
            <p>
              Copy <code>content.json</code> and <code>content-assets/</code> into the repository’s <code>public/</code> folder, then commit and push.
            </p>
          </div>

          <div className="space-y-1">
            <strong className="text-white block">Zero Cloud Server Costs</strong>
            <p>
              No monthly database bills or Supabase/Firebase upkeep. The site loads at lightning speed from edge CDN cache worldwide.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
