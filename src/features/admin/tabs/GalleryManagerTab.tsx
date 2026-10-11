import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, X, Upload, Image as ImageIcon, Tag } from 'lucide-react';
import { useDraftStore } from '../../../store/draftStore';
import { useUiStore } from '../../../store/uiStore';
import type { GalleryItem } from '../../../content/schema';
import { processImageFile } from '../../../storage/imageProcessing';
import { defaultStorageAdapter } from '../../../storage/indexedDbAdapter';

export const GalleryManagerTab: React.FC = () => {
  const { draft, updateDraft } = useDraftStore();
  const showToast = useUiStore((s) => s.showToast);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: { en: '', hi: '' },
    caption: { en: '', hi: '' },
    category: 'Living Room',
    roomType: 'Living Room',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    isSampleImage: true,
    sortOrder: draft.gallery.length + 1,
  });

  const handleStartEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setFormData(JSON.parse(JSON.stringify(item)));
    setIsAddingNew(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (!formData.title?.en || !formData.title?.hi) {
      showToast('Please provide both English and Hindi gallery titles', 'error');
      return;
    }

    if (isAddingNew) {
      const newItem: GalleryItem = {
        id: `gal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title: formData.title as any,
        caption: formData.caption as any,
        category: formData.category || 'Living Room',
        roomType: formData.roomType || 'Living Room',
        image: formData.image || '',
        isFeatured: formData.isFeatured ?? true,
        isSampleImage: formData.isSampleImage ?? true,
        sortOrder: formData.sortOrder || draft.gallery.length + 1,
      };

      updateDraft((prev) => ({
        ...prev,
        gallery: [...prev.gallery, newItem],
      }));
      showToast('New gallery item added to draft!', 'success');
    } else if (editingId) {
      updateDraft((prev) => ({
        ...prev,
        gallery: prev.gallery.map((g) =>
          g.id === editingId ? ({ ...g, ...formData } as GalleryItem) : g
        ),
      }));
      showToast('Gallery item updated!', 'success');
    }

    handleCancel();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this gallery photo from portfolio?')) {
      updateDraft((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((g) => g.id !== id),
      }));
      showToast('Gallery item removed', 'info');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Compressing gallery photo to WebP...', 'info');
      const processed = await processImageFile(file, { maxWidth: 1920, maxHeight: 1080 });
      const saved = await defaultStorageAdapter.saveImage(processed.blob, file.name);
      setFormData((prev) => ({ ...prev, image: saved.url }));
      showToast('Image uploaded successfully!', 'success');
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
            Gallery & Portfolio Showcase
          </h2>
          <p className="text-xs text-[#A89F91]">
            Upload wallpaper and painting photos with sample vs verified project labels.
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
            <span>Add Portfolio Photo</span>
          </button>
        )}
      </div>

      {/* Editor Form */}
      {(isAddingNew || editingId) && (
        <div className="p-6 rounded-2xl border-2 border-[var(--accent)]/50 bg-[#14100C] space-y-5 text-xs shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#2C241B] pb-3">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[var(--accent)]" />
              <span>{isAddingNew ? 'Add Portfolio Photo' : 'Edit Portfolio Photo'}</span>
            </h3>
            <button onClick={handleCancel} className="p-1 rounded-lg text-[#A89F91] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-white block mb-1">Title (English) *</label>
              <input
                type="text"
                value={formData.title?.en || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: { ...(prev.title || { en: '', hi: '' }), en: e.target.value },
                  }))
                }
                placeholder="e.g. Royal Damask Living Room"
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-white block mb-1">Title (Hindi) *</label>
              <input
                type="text"
                value={formData.title?.hi || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: { ...(prev.title || { en: '', hi: '' }), hi: e.target.value },
                  }))
                }
                placeholder="e.g. रॉयल डमास्क लिविंग रूम"
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-white block mb-1">Room / Space</label>
              <select
                value={formData.roomType || 'Living Room'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    roomType: e.target.value,
                    category: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none cursor-pointer"
              >
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Master Bedroom</option>
                <option value="Wall Textures">Wall Textures</option>
                <option value="3D Murals">3D Murals</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Sample vs Authentic Badge Toggle */}
            <div>
              <label className="font-semibold text-white block mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Project Verification Status</span>
              </label>
              <div className="flex items-center gap-3 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isSample"
                    checked={formData.isSampleImage === false}
                    onChange={() => setFormData((prev) => ({ ...prev, isSampleImage: false }))}
                    className="accent-emerald-500"
                  />
                  <span className="text-emerald-400 font-semibold">Authentic Project</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isSample"
                    checked={formData.isSampleImage === true}
                    onChange={() => setFormData((prev) => ({ ...prev, isSampleImage: true }))}
                    className="accent-[var(--accent)]"
                  />
                  <span className="text-[#D6A34D] font-semibold">Sample Concept</span>
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-white block mb-1">Caption / Details (English)</label>
              <input
                type="text"
                value={formData.caption?.en || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    caption: { ...(prev.caption || { en: '', hi: '' }), en: e.target.value },
                  }))
                }
                placeholder="e.g. Installed in Arera Colony villa using German heavy adhesive."
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-white block mb-1">Caption / Details (Hindi)</label>
              <input
                type="text"
                value={formData.caption?.hi || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    caption: { ...(prev.caption || { en: '', hi: '' }), hi: e.target.value },
                  }))
                }
                placeholder="e.g. अरेरा कॉलोनी विला में जर्मन पेस्ट द्वारा सीमलेस फिटिंग।"
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="font-semibold text-white block">Photo Asset</label>
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
                  <span>Upload File</span>
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
              <span>Save Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* Gallery Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {draft.gallery.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-[#2C241B] bg-[#14100C] overflow-hidden group flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] bg-black">
              <img src={item.image} alt={item.title.en} className="w-full h-full object-cover" />
              
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] text-white">
                  {item.roomType}
                </span>

                {item.isSampleImage ? (
                  <span className="px-2 py-0.5 rounded bg-[#D6A34D]/25 border border-[#D6A34D]/40 text-[#D6A34D] text-[10px] font-bold">
                    Sample Concept
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                    Authentic Project
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-heading text-sm font-bold text-white">{item.title.en}</h4>
                <p className="text-[11px] text-[#A89F91] line-clamp-1">{item.caption.en}</p>
              </div>

              <div className="pt-2 border-t border-[#2C241B] flex justify-end gap-2">
                <button
                  onClick={() => handleStartEdit(item)}
                  className="p-1.5 rounded-lg border border-[#2C241B] text-[#A89F91] hover:text-white"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg border border-[#2C241B] text-[#A89F91] hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
