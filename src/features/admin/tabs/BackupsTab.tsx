import React, { useEffect, useState } from 'react';
import { History, RotateCcw, Plus, Trash2, Clock, Shield } from 'lucide-react';
import { defaultStorageAdapter } from '../../../storage/indexedDbAdapter';
import type { BackupSnapshot } from '../../../storage/StorageAdapter';
import { useDraftStore } from '../../../store/draftStore';
import { useUiStore } from '../../../store/uiStore';

export const BackupsTab: React.FC = () => {
  const { draft, setDraftDirectly, resetToDefault } = useDraftStore();
  const showToast = useUiStore((s) => s.showToast);

  const [backups, setBackups] = useState<BackupSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBackups = async () => {
    setIsLoading(true);
    try {
      const list = await defaultStorageAdapter.listBackups();
      setBackups(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateSnapshot = async () => {
    const label = prompt('Enter a label for this manual snapshot:', `Manual Backup (${new Date().toLocaleTimeString()})`);
    if (!label) return;

    try {
      await defaultStorageAdapter.createBackup(label, draft);
      showToast('Snapshot created successfully!', 'success');
      fetchBackups();
    } catch (err) {
      showToast('Failed to create snapshot: ' + String(err), 'error');
    }
  };

  const handleRestore = async (id: string) => {
    if (confirm('Restore this snapshot? It will replace your current draft content.')) {
      try {
        const restored = await defaultStorageAdapter.restoreBackup(id);
        await setDraftDirectly(restored);
        showToast('Snapshot restored into draft!', 'success');
      } catch (err) {
        showToast('Failed to restore: ' + String(err), 'error');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this backup snapshot?')) {
      try {
        await defaultStorageAdapter.deleteBackup(id);
        showToast('Snapshot deleted', 'info');
        fetchBackups();
      } catch (err) {
        showToast('Failed to delete: ' + String(err), 'error');
      }
    }
  };

  const handleResetDefault = async () => {
    if (
      confirm(
        'WARNING: This will reset your entire website copy and services to the default authentic Bhopal Rai Traders template. Are you sure?'
      )
    ) {
      await resetToDefault();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#FAF7F2]">
            Version Snapshots & Recovery
          </h2>
          <p className="text-xs text-[#A89F91]">
            Automatic snapshots are captured every time you publish. Roll back to any point in time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateSnapshot}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Snapshot</span>
          </button>

          <button
            onClick={handleResetDefault}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500/40 bg-red-950/20 text-red-300 hover:bg-red-950/40 text-xs font-semibold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Factory Default</span>
          </button>
        </div>
      </div>

      {/* Snapshots List */}
      <div className="space-y-3">
        {isLoading && (
          <div className="p-8 text-center text-xs text-[#A89F91]">Loading snapshots...</div>
        )}

        {!isLoading && backups.length === 0 && (
          <div className="p-12 text-center border border-[#2C241B] rounded-2xl bg-[#14100C] space-y-2">
            <History className="w-8 h-8 text-[#A89F91] mx-auto" />
            <h4 className="font-heading text-base font-bold text-white">No Snapshots Yet</h4>
            <p className="text-xs text-[#A89F91]">
              Snapshots will be automatically created whenever you publish changes.
            </p>
          </div>
        )}

        {backups.map((snap) => (
          <div
            key={snap.id}
            className="p-4 rounded-xl border border-[#2C241B] bg-[#14100C] flex items-center justify-between gap-4 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
                <h4 className="font-bold text-white text-sm">{snap.label}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#2C241B] text-[#A89F91]">
                  Schema v{snap.version}
                </span>
              </div>
              <p className="text-[11px] text-[#A89F91] flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[var(--accent)]" />
                <span>{new Date(snap.timestamp).toLocaleString()}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleRestore(snap.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--accent)]/40 hover:bg-[var(--accent)]/15 text-[var(--accent)] text-xs font-semibold cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore</span>
              </button>

              <button
                onClick={() => handleDelete(snap.id)}
                className="p-1.5 rounded-lg border border-[#2C241B] text-[#A89F91] hover:text-red-400 cursor-pointer"
                title="Delete Snapshot"
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
