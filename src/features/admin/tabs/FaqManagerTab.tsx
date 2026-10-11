import React, { useState } from 'react';
import { Plus, Trash2, Edit3, X, HelpCircle } from 'lucide-react';
import { useDraftStore } from '../../../store/draftStore';
import { useUiStore } from '../../../store/uiStore';
import type { FaqItem } from '../../../content/schema';

export const FaqManagerTab: React.FC = () => {
  const { draft, updateDraft } = useDraftStore();
  const showToast = useUiStore((s) => s.showToast);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<Partial<FaqItem>>({
    question: { en: '', hi: '' },
    answer: { en: '', hi: '' },
    category: 'General',
    sortOrder: draft.faqs.length + 1,
  });

  const handleStartEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setFormData(JSON.parse(JSON.stringify(item)));
    setIsAddingNew(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (!formData.question?.en || !formData.answer?.en) {
      showToast('Question and answer in English are required', 'error');
      return;
    }

    if (isAddingNew) {
      const newItem: FaqItem = {
        id: `faq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        question: formData.question as any,
        answer: formData.answer as any,
        category: formData.category || 'General',
        sortOrder: formData.sortOrder || draft.faqs.length + 1,
      };

      updateDraft((prev) => ({
        ...prev,
        faqs: [...prev.faqs, newItem],
      }));
      showToast('New FAQ added!', 'success');
    } else if (editingId) {
      updateDraft((prev) => ({
        ...prev,
        faqs: prev.faqs.map((f) =>
          f.id === editingId ? ({ ...f, ...formData } as FaqItem) : f
        ),
      }));
      showToast('FAQ updated!', 'success');
    }

    handleCancel();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this FAQ question?')) {
      updateDraft((prev) => ({
        ...prev,
        faqs: prev.faqs.filter((f) => f.id !== id),
      }));
      showToast('FAQ removed from draft', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#FAF7F2]">
            Knowledge Base & FAQs
          </h2>
          <p className="text-xs text-[#A89F91]">
            Answers to common client questions regarding dampness, longevity, and maintenance.
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
            <span>Add FAQ</span>
          </button>
        )}
      </div>

      {/* Editor Modal */}
      {(isAddingNew || editingId) && (
        <div className="p-6 rounded-2xl border-2 border-[var(--accent)]/50 bg-[#14100C] space-y-4 text-xs shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#2C241B] pb-3">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[var(--accent)]" />
              <span>{isAddingNew ? 'Add New FAQ' : 'Edit FAQ'}</span>
            </h3>
            <button onClick={handleCancel} className="p-1 text-[#A89F91] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-semibold text-white block mb-1">Question (English) *</label>
              <input
                type="text"
                value={formData.question?.en || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    question: { ...(prev.question || { en: '', hi: '' }), en: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-white block mb-1">Question (Hindi)</label>
              <input
                type="text"
                value={formData.question?.hi || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    question: { ...(prev.question || { en: '', hi: '' }), hi: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-white block mb-1">Answer (English) *</label>
              <textarea
                rows={3}
                value={formData.answer?.en || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    answer: { ...(prev.answer || { en: '', hi: '' }), en: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[#2C241B] bg-[#0D0B09] text-white focus:border-[var(--accent)] outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-white block mb-1">Answer (Hindi)</label>
              <textarea
                rows={3}
                value={formData.answer?.hi || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    answer: { ...(prev.answer || { en: '', hi: '' }), hi: e.target.value },
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
              Save FAQ
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {draft.faqs.map((fItem) => (
          <div
            key={fItem.id}
            className="p-4 rounded-xl border border-[#2C241B] bg-[#14100C] flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <h4 className="font-heading text-sm font-bold text-white">{fItem.question.en}</h4>
              <p className="text-xs text-[#A89F91] line-clamp-2">{fItem.answer.en}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(fItem)}
                className="p-1.5 rounded-lg border border-[#2C241B] text-[#A89F91] hover:text-white"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(fItem.id)}
                className="p-1.5 rounded-lg border border-[#2C241B] text-[#A89F91] hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
