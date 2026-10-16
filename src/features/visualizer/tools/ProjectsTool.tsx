import React, { useState, useEffect } from 'react';
import {
  saveProjectToStorage,
  loadProjectsFromStorage,
  deleteProjectFromStorage,
  type VisualizerProject,
} from '../store/persistence';
import { useVisualizerStore, ROOMS_METADATA } from '../store/visualizerStore';
import { generateDesignSheetPdf } from '../store/pdfExport';
import { FolderDown, Trash2, FileText, Check, Plus } from 'lucide-react';

export const ProjectsTool: React.FC = () => {
  const { designs, activeRoom, areaSqFt, loadDesignsState, language } = useVisualizerStore();
  const isHi = language === 'hi';

  const [projects, setProjects] = useState<VisualizerProject[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const list = await loadProjectsFromStorage();
    setProjects(list);
  };

  const handleSaveCurrent = async () => {
    setSaving(true);
    let thumbnail: string | undefined = undefined;
    try {
      if (typeof window !== 'undefined' && window.__vizCanvas) {
        thumbnail = window.__vizCanvas.toDataURL('image/jpeg', 0.6);
      }
    } catch (e) {
      console.warn('Canvas thumbnail capture failed:', e);
    }

    const roomMeta = ROOMS_METADATA.find((r) => r.id === activeRoom);
    await saveProjectToStorage({
      name: newProjectName.trim() || `${roomMeta?.label || 'Room'} Concept`,
      room: activeRoom,
      designs,
      areaSqFt,
      thumbnail,
    });

    setSaving(false);
    setSaveSuccess(true);
    setNewProjectName('');
    setTimeout(() => setSaveSuccess(false), 2500);
    await loadProjects();
  };

  const handleDelete = async (id: string) => {
    if (confirm(isHi ? 'क्या आप इस प्रोजेक्ट को हटाना चाहते हैं?' : 'Delete this saved project?')) {
      await deleteProjectFromStorage(id);
      await loadProjects();
    }
  };

  const handleLoad = (p: VisualizerProject) => {
    loadDesignsState(p.designs, p.room);
  };

  const handleExportPdf = async (p: VisualizerProject) => {
    await generateDesignSheetPdf({
      projectName: p.name,
      room: p.room,
      designs: p.designs,
      areaSqFt: p.areaSqFt,
      canvasImageUri: p.thumbnail,
    });
  };

  return (
    <div className="space-y-4">
      {/* Save current project box */}
      <div className="bg-navy-950/80 p-3.5 rounded-2xl border border-gold-500/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gold-300">
            {isHi ? 'वर्तमान डिज़ाइन सहेजें' : 'Save Current Design'}
          </span>
          <span className="text-[10px] text-gray-400">IndexedDB Local</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder={isHi ? 'प्रोजेक्ट का नाम (उदा. लिविंग रूम)' : 'Project Name (e.g. Master Luxe)'}
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs bg-navy-900 border border-navy-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50"
          />
          <button
            onClick={handleSaveCurrent}
            disabled={saving}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 transition-all flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{saving ? '...' : isHi ? 'सहेजें' : 'Save'}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>{isHi ? 'प्रोजेक्ट सफलतापूर्वक सहेजा गया!' : 'Project saved to browser storage!'}</span>
          </div>
        )}
      </div>

      {/* Projects list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <span>{isHi ? 'सहेजे गए प्रोजेक्ट्स' : 'Saved Projects'} ({projects.length})</span>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            {isHi ? 'अभी कोई सहेजा गया प्रोजेक्ट नहीं है।' : 'No saved projects yet. Design and click Save!'}
          </div>
        ) : (
          projects.map((p) => {
            const roomMeta = ROOMS_METADATA.find((r) => r.id === p.room);
            const dateStr = new Date(p.savedAt).toLocaleDateString();

            return (
              <div
                key={p.id}
                className="bg-navy-950/70 border border-navy-800 hover:border-gold-500/40 rounded-2xl p-3 flex flex-col gap-2 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-gold-300 transition-colors">
                      {p.name}
                    </h5>
                    <div className="text-[10px] text-gray-400">
                      {roomMeta?.emoji} {isHi ? roomMeta?.labelHi : roomMeta?.label} • {dateStr}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleExportPdf(p)}
                      title="Download PDF"
                      className="p-1.5 rounded-lg text-gold-400 hover:bg-navy-900 border border-gold-500/20 hover:border-gold-500/40 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-navy-900 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {p.thumbnail && (
                  <div className="w-full h-24 rounded-xl overflow-hidden border border-navy-800 bg-navy-900">
                    <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <button
                  onClick={() => handleLoad(p)}
                  className="w-full py-1.5 text-[11px] font-semibold rounded-lg bg-navy-900 hover:bg-gold-500/20 text-gold-300 border border-gold-500/30 transition-all flex items-center justify-center gap-1"
                >
                  <FolderDown className="w-3.5 h-3.5" />
                  <span>{isHi ? 'यह डिज़ाइन लोड करें' : 'Load Design'}</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
