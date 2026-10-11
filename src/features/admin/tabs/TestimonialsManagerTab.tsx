import React, { useState } from 'react';
import { Plus, Trash2, Edit3, X, Star, MessageSquare } from 'lucide-react';
import { useDraftStore } from '../../../store/draftStore';
import { useUiStore } from '../../../store/uiStore';
import type { TestimonialItem } from '../../../content/schema';

export const TestimonialsManagerTab: React.FC = () => {
  const { draft, updateDraft } = useDraftStore();
  const showToast = useUiStore((s) => s.showToast);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<Partial<TestimonialItem>>({
    clientName: '',
    location: { en: 'Zone 1, MP Nagar, Bhopal', hi: 'ज़ोन 1, एमपी नगर, भोपाल' },
    rating: 5,
    review: { en: '', hi: '' },
    serviceUsed: { en: 'Wallpaper Designing', hi: 'वॉलपेपर डिजाइनिंग' },
    isApproved: true,
    date: new Date().toISOString().split('T')[0],
  });

  const handleStartEdit = (item: TestimonialItem) => {
    setEditingId(item.id);
    setFormData(JSON.parse(JSON.stringify(item)));
    setIsAddingNew(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (!formData.clientName || !formData.review?.en) {
      showToast('Client name and review text are required', 'error');
      return;
    }

    if (isAddingNew) {
      const newItem: TestimonialItem = {
        id: `tst_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        clientName: formData.clientName,
        location: formData.location as any,
        rating: formData.rating || 5,
        review: formData.review as any,
        serviceUsed: formData.serviceUsed as any,
        isApproved: formData.isApproved ?? true,
        date: formData.date || new Date().toISOString().split('T')[0],
      };

      updateDraft((prev) => ({
        ...prev,
        testimonials: [...prev.testimonials, newItem],
      }));
      showToast('Testimonial added to draft!', 'success');
    } else if (editingId) {
      updateDraft((prev) => ({
        ...prev,
        testimonials: prev.testimonials.map((t) =>
          t.id === editingId ? ({ ...t, ...formData } as TestimonialItem) : t
        ),
      }));
      showToast('Testimonial updated!', 'success');
    }

    handleCancel();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this client testimonial?')) {
      updateDraft((prev) => ({
        ...prev,
        testimonials: prev.testimonials.filter((t) => t.id !== id),
      }));
      showToast('Review removed', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#FAF7F2]">
            Client Testimonials & Feedback
          </h2>
          <p className="text-xs text-[#A89F91]">
            Curate reviews from homeowners and business clients across Bhopal.
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
            <span>Add Review</span>
          </button>
        )}
      </div>

      {/* Editor Modal */}
      {(isAddingNew || editingId) && (
        <div className="p-6 rounded-2xl border-2 border-[var(--accent)]/50 bg-[#14100C] space-y-4 text-xs shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#2C241B] pb-3">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
              <span>{isAddingNew ? 'Add Client Review' : 'Edit Review'}</span>
            </h3>
            <button onClick={handleCancel} className="p-1 text-[#A89F91] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-white block mb-1">Client Name *</label>
              <input
                type="text"
                value={formData.clientName || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                placeholder="e.g. Dr. Rajesh Agrawal"
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-white block mb-1">Star Rating (1 - 5)</label>
              <select
                value={formData.rating || 5}
                onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none cursor-pointer"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                <option value="3">⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-white block mb-1">Location (English)</label>
              <input
                type="text"
                value={formData.location?.en || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: { ...(prev.location || { en: '', hi: '' }), en: e.target.value },
                  }))
                }
                placeholder="e.g. Arera Colony, Bhopal"
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-white block mb-1">Location (Hindi)</label>
              <input
                type="text"
                value={formData.location?.hi || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: { ...(prev.location || { en: '', hi: '' }), hi: e.target.value },
                  }))
                }
                placeholder="e.g. अरेरा कॉलोनी, भोपाल"
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-white block mb-1">Review Text (English) *</label>
              <textarea
                rows={2}
                value={formData.review?.en || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    review: { ...(prev.review || { en: '', hi: '' }), en: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-white block mb-1">Review Text (Hindi)</label>
              <textarea
                rows={2}
                value={formData.review?.hi || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    review: { ...(prev.review || { en: '', hi: '' }), hi: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none resize-none"
              />
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
              Save Review
            </button>
          </div>
        </div>
      )}

      {/* Testimonials List */}
      <div className="grid sm:grid-cols-2 gap-4">
        {draft.testimonials.map((tItem) => (
          <div key={tItem.id} className="p-4 rounded-xl border border-[#2C241B] bg-[#14100C] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[var(--accent)]">
                {[...Array(tItem.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEdit(tItem)}
                  className="p-1.5 rounded-lg border border-[#2C241B] text-[#A89F91] hover:text-white"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(tItem.id)}
                  className="p-1.5 rounded-lg border border-[#2C241B] text-[#A89F91] hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#C8BFB2] line-clamp-2 italic">"{tItem.review.en}"</p>

            <div className="text-[11px] text-[#A89F91] pt-1 border-t border-[#2C241B]/60">
              <strong className="text-white">{tItem.clientName}</strong> • {tItem.location.en}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
