import React from 'react';
import { Save, Phone, Mail, MapPin, MessageCircle, Building } from 'lucide-react';
import { useDraftStore } from '../../../store/draftStore';
import { useUiStore } from '../../../store/uiStore';

export const BrandSettingsTab: React.FC = () => {
  const { draft, updateDraft } = useDraftStore();
  const showToast = useUiStore((s) => s.showToast);

  const brand = draft.brand;

  const handleChange = (field: string, value: string) => {
    updateDraft((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        [field]: value,
      },
    }));
  };

  const handleBilingualChange = (field: 'tagline' | 'address', lang: 'en' | 'hi', value: string) => {
    updateDraft((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        [field]: {
          ...prev.brand[field],
          [lang]: value,
        },
      },
    }));
  };

  const handleManualSave = () => {
    showToast('Brand settings autosaved to draft', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#FAF7F2]">
            Brand & Contact Identity
          </h2>
          <p className="text-xs text-[#A89F91]">
            Official business credentials, telephone numbers, and Bhopal studio address.
          </p>
        </div>

        <button
          onClick={handleManualSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-md"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-xs">
        
        {/* Business Name */}
        <div className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-3">
          <label className="font-semibold text-white flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Business Name</span>
          </label>
          <input
            type="text"
            value={brand.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
          />
        </div>

        {/* Email */}
        <div className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-3">
          <label className="font-semibold text-white flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Official Email</span>
          </label>
          <input
            type="email"
            value={brand.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
          />
        </div>

        {/* Phone & Display */}
        <div className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-3">
          <label className="font-semibold text-white flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Phone (Dialer) & Display Format</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={brand.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="7000302682"
              className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
            />
            <input
              type="text"
              value={brand.phoneDisplay}
              onChange={(e) => handleChange('phoneDisplay', e.target.value)}
              placeholder="+91 7000302682"
              className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
            />
          </div>
        </div>

        {/* WhatsApp Number */}
        <div className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-3">
          <label className="font-semibold text-white flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp Number (for Quotations)</span>
          </label>
          <input
            type="text"
            value={brand.whatsappNumber}
            onChange={(e) => handleChange('whatsappNumber', e.target.value)}
            placeholder="7000302682"
            className="w-full px-4 py-2.5 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
          />
        </div>

        {/* Tagline Bilingual */}
        <div className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-3 md:col-span-2">
          <span className="font-semibold text-white block">
            Brand Tagline (Bilingual)
          </span>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[11px] text-[#A89F91]">English Tagline:</span>
              <input
                type="text"
                value={brand.tagline.en}
                onChange={(e) => handleBilingualChange('tagline', 'en', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-[#A89F91]">Hindi Tagline (हिंदी):</span>
              <input
                type="text"
                value={brand.tagline.hi}
                onChange={(e) => handleBilingualChange('tagline', 'hi', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Studio Address Bilingual */}
        <div className="p-5 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-3 md:col-span-2">
          <label className="font-semibold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Bhopal Studio Address (Bilingual)</span>
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[11px] text-[#A89F91]">Address (English):</span>
              <input
                type="text"
                value={brand.address.en}
                onChange={(e) => handleBilingualChange('address', 'en', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-[#A89F91]">Address (Hindi - हिन्दी):</span>
              <input
                type="text"
                value={brand.address.hi}
                onChange={(e) => handleBilingualChange('address', 'hi', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
