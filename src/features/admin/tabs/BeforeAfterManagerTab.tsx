import React, { useState } from 'react';
import { Plus, Trash2, Edit3, X, Upload, MoveHorizontal } from 'lucide-react';
import { useDraftStore } from '../../../store/draftStore';
import { useUiStore } from '../../../store/uiStore';
import type { BeforeAfterItem } from '../../../content/schema';
import { processImageFile } from '../../../storage/imageProcessing';
import { defaultStorageAdapter } from '../../../storage/indexedDbAdapter';

export const BeforeAfterManagerTab: React.FC = () => {
  const { draft, updateDraft } = useDraftStore();
  const showToast = useUiStore((s) => s.showToast);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<Partial<BeforeAfterItem>>({
    title: { en: '', hi: '' },
    description: { en: '', hi: '' },
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    beforeLabel: { en: 'Before Transformation', hi: 'बदलाव से पहले' },
    afterLabel: { en: 'After Luxury Styling', hi: 'बदलाव के बाद' },
    isActive: true,
  });

  const handleStartEdit = (item: BeforeAfterItem) => {
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
      showToast('Please provide both English and Hindi titles', 'error');
      return;
    }

    if (isAddingNew) {
      const newItem: BeforeAfterItem = {
        id: `ba_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title: formData.title as any,
        description: formData.description as any,
        beforeImage: formData.beforeImage || '',
        afterImage: formData.afterImage || '',
        beforeLabel: formData.beforeLabel as any,
        afterLabel: formData.afterLabel as any,
        isActive: formData.isActive ?? true,
      };

      updateDraft((prev) => ({
        ...prev,
        beforeAfter: {
          ...prev.beforeAfter,
          items: [...prev.beforeAfter.items, newItem],
        },
      }));
      showToast('New comparison added!', 'success');
    } else if (editingId) {
      updateDraft((prev) => ({
        ...prev,
        beforeAfter: {
          ...prev.beforeAfter,
          items: prev.beforeAfter.items.map((i) =>
            i.id === editingId ? ({ ...i, ...formData } as BeforeAfterItem) : i
          ),
        },
      }));
      showToast('Comparison item updated!', 'success');
    }

    handleCancel();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this comparison pair?')) {
      updateDraft((prev) => ({
        ...prev,
        beforeAfter: {
          ...prev.beforeAfter,
          items: prev.beforeAfter.items.filter((i) => i.id !== id),
        },
      }));
      showToast('Comparison removed', 'info');
    }
  };

  const handleUpload = async (field: 'beforeImage' | 'afterImage', file: File) => {
    try {
      showToast('Optimizing image...', 'info');
      const processed = await processImageFile(file, { maxWidth: 1920, maxHeight: 1080 });
      const saved = await defaultStorageAdapter.saveImage(processed.blob, file.name);
      setFormData((prev) => ({ ...prev, [field]: saved.url }));
      showToast('Image uploaded!', 'success');
    } catch (err) {
      showToast('Upload error: ' + String(err), 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#FAF7F2]">
            Before & After Comparisons
          </h2>
          <p className="text-xs text-[#A89F91]">
            Manage interactive split-screen wall transformation sliders.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            onClick={() => {
              setIsAddingNew(true);
              setEditingId(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Comparison Pair</span>
          </button>
        )}
      </div>

      {/* Editor Modal */}
      {(isAddingNew || editingId) && (
        <div className="p-6 rounded-2xl border-2 border-[var(--accent)]/50 bg-[#14100C] space-y-4 text-xs shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#2C241B] pb-3">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <MoveHorizontal className="w-4 h-4 text-[var(--accent)]" />
              <span>{isAddingNew ? 'New Transformation Pair' : 'Edit Transformation'}</span>
            </h3>
            <button onClick={handleCancel} className="p-1 text-[#A89F91] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-white block mb-1">Title (English)</label>
              <input
                type="text"
                value={formData.title?.en || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: { ...(prev.title || { en: '', hi: '' }), en: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-white block mb-1">Title (Hindi)</label>
              <input
                type="text"
                value={formData.title?.hi || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: { ...(prev.title || { en: '', hi: '' }), hi: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            {/* Before image */}
            <div className="space-y-1.5">
              <label className="font-semibold text-white block">"Before" Image</label>
              <input
                type="text"
                value={formData.beforeImage || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, beforeImage: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none mb-1"
              />
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2C241B] bg-[#1A1612] text-xs font-semibold cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Upload Before Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleUpload('beforeImage', e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            {/* After image */}
            <div className="space-y-1.5">
              <label className="font-semibold text-white block">"After" Image</label>
              <input
                type="text"
                value={formData.afterImage || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, afterImage: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none mb-1"
              />
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2C241B] bg-[#1A1612] text-xs font-semibold cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Upload After Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleUpload('afterImage', e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#2C241B]">
            <button onClick={handleCancel} className="px-4 py-2 border border-[#2C241B] rounded-xl text-[#A89F91]">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black font-bold uppercase tracking-wider"
            >
              Save Transformation
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid sm:grid-cols-2 gap-4">
        {draft.beforeAfter.items.map((item) => (
          <div key={item.id} className="p-4 rounded-xl border border-[#2C241B] bg-[#14100C] space-y-3">
            <div className="grid grid-cols-2 gap-2 aspect-[16/10] bg-black rounded-lg overflow-hidden">
              <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" />
              <img src={item.afterImage} alt="After" className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading text-sm font-bold text-white">{item.title.en}</h4>
                <p className="text-[11px] text-[#A89F91]">{item.title.hi}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEdit(item)}
                  className="p-1.5 rounded-lg border border-[#2C241B] text-[#A89F91] hover:text-white"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg border border-[#2C241B] text-[#A89F91] hover:text-red-400"
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
