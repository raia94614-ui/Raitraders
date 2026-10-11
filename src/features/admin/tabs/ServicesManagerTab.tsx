import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, X, Upload, Layers } from 'lucide-react';
import { useDraftStore } from '../../../store/draftStore';
import { useUiStore } from '../../../store/uiStore';
import type { ServiceItem } from '../../../content/schema';
import { processImageFile } from '../../../storage/imageProcessing';
import { defaultStorageAdapter } from '../../../storage/indexedDbAdapter';

export const ServicesManagerTab: React.FC = () => {
  const { draft, updateDraft } = useDraftStore();
  const showToast = useUiStore((s) => s.showToast);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New service draft form state
  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    title: { en: '', hi: '' },
    description: { en: '', hi: '' },
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    icon: 'sparkles',
    category: 'Wallpaper',
    features: [
      { en: 'Professional installation', hi: 'प्रोफेशनल इंस्टॉलेशन' },
      { en: '100% German adhesive', hi: '100% जर्मन एडहेसिव' },
    ],
    isActive: true,
    sortOrder: draft.services.length + 1,
  });

  const handleStartEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setFormData(JSON.parse(JSON.stringify(service)));
    setIsAddingNew(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (!formData.title?.en || !formData.title?.hi) {
      showToast('Please provide both English and Hindi service titles', 'error');
      return;
    }

    if (isAddingNew) {
      const newService: ServiceItem = {
        id: `srv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title: formData.title as any,
        description: formData.description as any,
        image: formData.image || '',
        icon: formData.icon || 'sparkles',
        category: formData.category || 'Wallpaper',
        features: formData.features || [],
        isActive: formData.isActive ?? true,
        sortOrder: formData.sortOrder || draft.services.length + 1,
      };

      updateDraft((prev) => ({
        ...prev,
        services: [...prev.services, newService],
      }));
      showToast('New service added successfully!', 'success');
    } else if (editingId) {
      updateDraft((prev) => ({
        ...prev,
        services: prev.services.map((item) =>
          item.id === editingId ? ({ ...item, ...formData } as ServiceItem) : item
        ),
      }));
      showToast('Service updated successfully!', 'success');
    }

    handleCancel();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      updateDraft((prev) => ({
        ...prev,
        services: prev.services.filter((s) => s.id !== id),
      }));
      showToast('Service deleted from draft', 'info');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Optimizing service image...', 'info');
      const processed = await processImageFile(file, { maxWidth: 1280, maxHeight: 800 });
      const saved = await defaultStorageAdapter.saveImage(processed.blob, file.name);
      setFormData((prev) => ({ ...prev, image: saved.url }));
      showToast('Image uploaded and optimized!', 'success');
    } catch (err) {
      showToast('Image processing failed: ' + String(err), 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#FAF7F2]">
            Services & Specialty Finishes
          </h2>
          <p className="text-xs text-[#A89F91]">
            Manage all wallpaper, texture, and painting services offered by Rai Traders.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            onClick={() => {
              setIsAddingNew(true);
              setEditingId(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Service</span>
          </button>
        )}
      </div>

      {/* Edit / Add Modal or In-place Panel */}
      {(isAddingNew || editingId) && (
        <div className="p-6 rounded-2xl border-2 border-[var(--accent)]/50 bg-[#14100C] space-y-5 text-xs shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#2C241B] pb-3">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--accent)]" />
              <span>{isAddingNew ? 'Create New Service' : 'Edit Service'}</span>
            </h3>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg text-[#A89F91] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-white block mb-1">Service Title (English) *</label>
              <input
                type="text"
                value={formData.title?.en || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: { ...(prev.title || { en: '', hi: '' }), en: e.target.value },
                  }))
                }
                placeholder="e.g. Premium Wallpaper Designing"
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-white block mb-1">Service Title (Hindi) *</label>
              <input
                type="text"
                value={formData.title?.hi || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: { ...(prev.title || { en: '', hi: '' }), hi: e.target.value },
                  }))
                }
                placeholder="e.g. प्रीमियम वॉलपेपर डिजाइनिंग"
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-white block mb-1">Category</label>
              <select
                value={formData.category || 'Wallpaper'}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none cursor-pointer"
              >
                <option value="Wallpaper">Wallpaper</option>
                <option value="Wall Painting">Wall Painting</option>
                <option value="Textures">Textures</option>
                <option value="Custom 3D">Custom 3D</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-white block mb-1">Display Order</label>
              <input
                type="number"
                value={formData.sortOrder || 1}
                onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-white block mb-1">Description (English)</label>
              <textarea
                rows={2}
                value={formData.description?.en || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: { ...(prev.description || { en: '', hi: '' }), en: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-white block mb-1">Description (Hindi)</label>
              <textarea
                rows={2}
                value={formData.description?.hi || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: { ...(prev.description || { en: '', hi: '' }), hi: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="font-semibold text-white block">Service Showcase Image</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="Image URL"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D6A34D]/40 bg-[#1A1612] text-[#FAF7F2] hover:bg-[#D6A34D]/15 text-xs font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#2C241B]">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl border border-[#2C241B] text-[#A89F91] hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black font-bold uppercase tracking-wider shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Save Service</span>
            </button>
          </div>
        </div>
      )}

      {/* Services List Table / Grid */}
      <div className="grid gap-4">
        {draft.services.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-[#2C241B] bg-[#14100C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-black shrink-0 border border-[#2C241B]">
                <img src={item.image} alt={item.title.en} className="w-full h-full object-cover" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading text-base font-bold text-white">{item.title.en}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2C241B] text-[#D6A34D]">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-[#A89F91]">{item.title.hi}</p>
                <span className="text-[11px] text-[#7A7367]">
                  {item.features?.length || 0} features listed • Order #{item.sortOrder || 0}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(item)}
                className="p-2 rounded-lg border border-[#2C241B] hover:border-[var(--accent)] text-[#A89F91] hover:text-white transition-colors cursor-pointer"
                title="Edit Service"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg border border-[#2C241B] hover:border-red-500/50 text-[#A89F91] hover:text-red-400 transition-colors cursor-pointer"
                title="Delete Service"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
