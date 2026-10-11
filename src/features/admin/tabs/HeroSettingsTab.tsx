import React from 'react';
import { Sparkles, Image as ImageIcon, Upload } from 'lucide-react';
import { useDraftStore } from '../../../store/draftStore';
import { useUiStore } from '../../../store/uiStore';
import { processImageFile } from '../../../storage/imageProcessing';
import { defaultStorageAdapter } from '../../../storage/indexedDbAdapter';

export const HeroSettingsTab: React.FC = () => {
  const { draft, updateDraft } = useDraftStore();
  const showToast = useUiStore((s) => s.showToast);

  const hero = draft.hero;

  const handleBilingualChange = (
    field: 'badge' | 'title' | 'description' | 'primaryCtaText' | 'secondaryCtaText' | 'statsBadge',
    lang: 'en' | 'hi',
    value: string
  ) => {
    updateDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: {
          ...prev.hero[field],
          [lang]: value,
        },
      },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Compressing and saving image...', 'info');
      const processed = await processImageFile(file, { maxWidth: 1920, maxHeight: 1080 });
      const saved = await defaultStorageAdapter.saveImage(processed.blob, file.name);

      updateDraft((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          backgroundImage: saved.url,
        },
      }));

      showToast('Hero background updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to process image: ' + String(err), 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-[#FAF7F2]">
          Hero Section & Headline Messaging
        </h2>
        <p className="text-xs text-[#A89F91]">
          Primary above-the-fold value proposition, headlines in English and Hindi, and background hero image.
        </p>
      </div>

      <div className="space-y-6 text-xs">
        
        {/* Prestige Badge */}
        <div className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-3">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Prestige Badge (Top Pill)</span>
          </span>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-[#A89F91] block mb-1">English:</span>
              <input
                type="text"
                value={hero.badge.en}
                onChange={(e) => handleBilingualChange('badge', 'en', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>
            <div>
              <span className="text-[11px] text-[#A89F91] block mb-1">Hindi (हिंदी):</span>
              <input
                type="text"
                value={hero.badge.hi}
                onChange={(e) => handleBilingualChange('badge', 'hi', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <div className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-3">
          <span className="font-semibold text-white block">
            Main Headline (H1)
          </span>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-[#A89F91] block mb-1">English:</span>
              <textarea
                rows={2}
                value={hero.title.en}
                onChange={(e) => handleBilingualChange('title', 'en', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none resize-none font-heading text-sm"
              />
            </div>
            <div>
              <span className="text-[11px] text-[#A89F91] block mb-1">Hindi (हिंदी):</span>
              <textarea
                rows={2}
                value={hero.title.hi}
                onChange={(e) => handleBilingualChange('title', 'hi', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none resize-none font-heading text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sub-description */}
        <div className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-3">
          <span className="font-semibold text-white block">
            Lead Description
          </span>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-[#A89F91] block mb-1">English:</span>
              <textarea
                rows={3}
                value={hero.description.en}
                onChange={(e) => handleBilingualChange('description', 'en', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none resize-none"
              />
            </div>
            <div>
              <span className="text-[11px] text-[#A89F91] block mb-1">Hindi (हिंदी):</span>
              <textarea
                rows={3}
                value={hero.description.hi}
                onChange={(e) => handleBilingualChange('description', 'hi', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* CTAs and Stats Badge */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-3">
            <span className="font-semibold text-white block">Primary CTA Text</span>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="English CTA"
                value={hero.primaryCtaText.en}
                onChange={(e) => handleBilingualChange('primaryCtaText', 'en', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
              <input
                type="text"
                placeholder="Hindi CTA"
                value={hero.primaryCtaText.hi}
                onChange={(e) => handleBilingualChange('primaryCtaText', 'hi', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-3">
            <span className="font-semibold text-white block">Hero Stats Pill</span>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="English Stats Badge"
                value={hero.statsBadge.en}
                onChange={(e) => handleBilingualChange('statsBadge', 'en', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
              <input
                type="text"
                placeholder="Hindi Stats Badge"
                value={hero.statsBadge.hi}
                onChange={(e) => handleBilingualChange('statsBadge', 'hi', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Hero Background Image */}
        <div className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-4">
          <label className="font-semibold text-white flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Hero Background Image</span>
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-40 h-24 rounded-xl overflow-hidden border border-[#2C241B] bg-black shrink-0">
              <img
                src={hero.backgroundImage}
                alt="Hero Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 flex-1 w-full">
              <input
                type="text"
                value={hero.backgroundImage}
                onChange={(e) =>
                  updateDraft((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, backgroundImage: e.target.value },
                  }))
                }
                placeholder="Image URL or uploaded asset"
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none text-xs"
              />

              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#D6A34D]/40 bg-[#1A1612] text-[#FAF7F2] hover:bg-[#D6A34D]/15 text-xs font-semibold cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Upload Custom Image (Auto WebP 1080p)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export interface HeroSettingsTabProps {}
