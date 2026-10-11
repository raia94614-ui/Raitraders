import React from 'react';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#061522] text-cream-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent)] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </a>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">
            <Shield className="w-4 h-4" />
            <span>Privacy & Client Data</span>
          </div>
          <h1 className="font-serif text-4xl font-bold">Privacy Policy</h1>
          <p className="text-xs text-cream-300">Effective Date: October 2026 • RAI TRADERS (Zone 1, MP Nagar, Bhopal)</p>
        </div>

        <div className="space-y-6 text-sm text-[#C8BFB2] leading-relaxed border-t border-gold-500/20 pt-6">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-white">1. Information We Collect</h2>
            <p>
              When you submit an inquiry or quotation request on our website, we only collect the contact information you directly provide: your name, contact phone number, room dimensions, and project locality within Bhopal.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-white">2. Frontend-Only Storage Architecture</h2>
            <p>
              This website operates on a privacy-first, client-side architecture. We do not maintain centralized cloud tracking databases or sell your data. Inquiries are compiled into direct WhatsApp messaging links that you review before sending from your personal device.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-white">3. On-Site Measurement Data</h2>
            <p>
              Measurement specs gathered during physical site visits in Bhopal are strictly used for pattern calculation, cutting sheets, and order fulfillment. We never share floor plans or interior photos without prior client consent.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-white">4. Contact Details</h2>
            <p>
              For privacy concerns or data deletion requests, contact Rai Traders at <strong>raitraders0006@gmail.com</strong> or visit our office at Zone 1, MP Nagar, Bhopal, Madhya Pradesh.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#061522] text-cream-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent)] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </a>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">
            <FileText className="w-4 h-4" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="font-serif text-4xl font-bold">Terms of Service</h1>
          <p className="text-xs text-cream-300">Effective Date: October 2026 • Jurisdiction: Bhopal, Madhya Pradesh</p>
        </div>

        <div className="space-y-6 text-sm text-[#C8BFB2] leading-relaxed border-t border-gold-500/20 pt-6">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-white">1. Estimates and Quotations</h2>
            <p>
              All quotations are issued following our free on-site wall inspection assessing surface dampness, undulations, pattern repeat waste, and exact architectural dimensions in Bhopal.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-white">2. Wall Preparation & Warranty</h2>
            <p>
              Our German adhesive and installation warranty applies to solid, cured, damp-free walls. If active moisture or seepage is identified during inspection, waterproofing treatment must precede wallpaper application to ensure lasting adherence.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-white">3. Installation Timelines</h2>
            <p>
              Standard residential rooms are typically completed within 24 to 48 hours following design confirmation. Commercial fitouts are scheduled according to site readiness.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-white">4. Jurisdiction</h2>
            <p>
              All agreements and service engagements are subject to the exclusive jurisdiction of the courts of Bhopal, Madhya Pradesh, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
