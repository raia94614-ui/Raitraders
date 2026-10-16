import React, { useState, useEffect } from 'react';
import { loadVisualizerLeads, type VisualizerLead } from '../../visualizer/store/persistence';
import { MessageSquare, Phone, Trash2, ExternalLink, Calculator, Layers, Sparkles } from 'lucide-react';

export const VisualizerAdminTab: React.FC = () => {
  const [leads, setLeads] = useState<VisualizerLead[]>([]);
  const [loading, setLoading] = useState(true);

  const [rates, setRates] = useState({
    paintPerSqFt: 35,
    wallpaperPerSqFt: 85,
    stuccoPerSqFt: 55,
  });
  const [savedRatesSuccess, setSavedRatesSuccess] = useState(false);

  useEffect(() => {
    fetchLeads();
    const storedRates = localStorage.getItem('rai_visualizer_rates');
    if (storedRates) {
      try {
        setRates(JSON.parse(storedRates));
      } catch (e) {
        console.warn('Failed to parse rates:', e);
      }
    }
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const list = await loadVisualizerLeads();
    setLeads(list);
    setLoading(false);
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('rai_visualizer_rates', JSON.stringify(rates));
    setSavedRatesSuccess(true);
    setTimeout(() => setSavedRatesSuccess(false), 2500);
  };

  const handleClearLeads = () => {
    if (confirm('Clear all visualizer leads from local storage?')) {
      localStorage.removeItem('rai_visualizer_leads');
      setLeads([]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2C241B]">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            <span>3D Visualizer & Leads Studio</span>
          </h2>
          <p className="text-xs text-[#A89F91] mt-1">
            Manage customer design requests from the 3D Visualizer and configure estimation rates for Bhopal.
          </p>
        </div>

        <a
          href="#/visualizer"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8222] text-[#0A0806] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all self-start sm:self-auto"
        >
          <span>Launch 3D Visualizer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Pricing Rate Configuration */}
      <div className="p-6 rounded-2xl bg-[#14100C] border border-[#2C241B] space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#D4AF37]">
          <Calculator className="w-4 h-4" />
          <span>Bhopal Rate Card per Sq. Ft.</span>
        </div>

        <form onSubmit={handleSaveRates} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-[#A89F91] block mb-1">Standard Luxury Paint (₹ / sq.ft)</label>
            <input
              type="number"
              min="10"
              max="500"
              value={rates.paintPerSqFt}
              onChange={(e) => setRates({ ...rates, paintPerSqFt: Number(e.target.value) || 35 })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0A0806] border border-[#2C241B] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[#A89F91] block mb-1">Imported Wallpaper (₹ / sq.ft)</label>
            <input
              type="number"
              min="20"
              max="1000"
              value={rates.wallpaperPerSqFt}
              onChange={(e) => setRates({ ...rates, wallpaperPerSqFt: Number(e.target.value) || 85 })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0A0806] border border-[#2C241B] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[#A89F91] block mb-1">Royale Stucco / Texture (₹ / sq.ft)</label>
            <input
              type="number"
              min="20"
              max="1000"
              value={rates.stuccoPerSqFt}
              onChange={(e) => setRates({ ...rates, stuccoPerSqFt: Number(e.target.value) || 55 })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0A0806] border border-[#2C241B] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#7A7367]">
              Rates are used by the 3D Visualizer quote calculator for customer budget estimates.
            </span>
            <div className="flex items-center gap-3">
              {savedRatesSuccess && (
                <span className="text-xs text-emerald-400 font-semibold">✓ Rates updated successfully</span>
              )}
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2C241B] hover:bg-[#D4AF37] text-white hover:text-[#0A0806] text-xs font-bold transition-all"
              >
                Save Rates
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Customer Leads List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-white">Recent Customer Design Inquiries ({leads.length})</h3>
          </div>

          {leads.length > 0 && (
            <button
              onClick={handleClearLeads}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs text-[#7A7367]">Loading leads from IndexedDB...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#14100C] border border-[#2C241B] text-center space-y-2">
            <p className="text-sm font-medium text-[#FAF7F2]">No inquiries received yet.</p>
            <p className="text-xs text-[#7A7367]">
              Customer inquiries submitted via the 3D Visualizer Quote form will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((l) => {
              const dateStr = new Date(l.submittedAt).toLocaleString();
              const waLink = `https://wa.me/91${l.customerPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                l.customerName
              )},%20thank%20you%20for%20designing%20your%20${encodeURIComponent(
                l.room
              )}%20with%20RAI%20TRADERS%20Bhopal!`;

              return (
                <div
                  key={l.id}
                  className="p-5 rounded-2xl bg-[#14100C] border border-[#2C241B] hover:border-[#D4AF37]/40 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-white text-sm">{l.customerName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 uppercase font-bold">
                          {l.room.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#A89F91] mt-0.5">
                        Submitted: {dateStr} • Area: {l.areaSqFt} sq. ft.
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#D4AF37]">
                        ₹{l.estimatedTotal.toLocaleString('en-IN')}
                      </span>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${l.customerPhone}`}
                        className="p-1.5 rounded-lg bg-[#2C241B] hover:bg-[#3D3226] text-[#FAF7F2] text-xs transition-colors"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {l.designsSummary && l.designsSummary.length > 0 && (
                    <div className="p-3 rounded-xl bg-[#0A0806] border border-[#1C1814] text-xs space-y-1">
                      <span className="text-[10px] text-[#7A7367] uppercase tracking-wider block font-semibold">
                        Customized Finishes:
                      </span>
                      {l.designsSummary.map((sum, idx) => (
                        <div key={idx} className="text-[#A89F91]">
                          • {sum}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
