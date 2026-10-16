import { jsPDF } from 'jspdf';
import type { SurfaceDesign } from '../materials/PBRMaterialResolver';
import { WALLPAPER_CATALOG } from '../materials/proceduralTextures';
import { ROOMS_METADATA } from './visualizerStore';
import type { RoomId } from './visualizerStore';

export interface PdfExportOptions {
  projectName: string;
  room: RoomId;
  designs: Record<string, SurfaceDesign>;
  areaSqFt: number;
  estCostPerSqFt?: number;
  canvasImageUri?: string | null;
}

/**
 * Generate a luxury one-page PDF Design Sheet using client-side jsPDF
 */
export async function generateDesignSheetPdf({
  projectName,
  room,
  designs,
  areaSqFt,
  estCostPerSqFt = 45,
  canvasImageUri,
}: PdfExportOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const roomMeta = ROOMS_METADATA.find((r) => r.id === room);

  // 1. Header Banner (Deep Navy #0B1530)
  doc.setFillColor(11, 21, 48);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold accent rule line
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 41, pageWidth, 1.5, 'F');

  // Brand Name
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('RAI TRADERS', 16, 18);

  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text('Exclusive Wall Design, Imported Wallpapers & Architectural Painting', 16, 26);
  doc.text('Zone-1, M.P. Nagar, Bhopal, Madhya Pradesh | Ph: +91 70003 02682', 16, 33);

  // Document Title
  doc.setFontSize(14);
  doc.setTextColor(212, 175, 55);
  doc.text('3D DESIGN SHEET', pageWidth - 16, 18, { align: 'right' });

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  doc.setFontSize(9);
  doc.setTextColor(200, 210, 230);
  doc.text(`Generated: ${dateStr}`, pageWidth - 16, 26, { align: 'right' });

  // 2. Project & Room Summary Section
  doc.setTextColor(11, 21, 48);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(projectName || `${roomMeta?.label ?? 'Room'} Design`, 16, 52);

  doc.setFontSize(10);
  doc.setTextColor(90, 95, 110);
  doc.setFont('helvetica', 'normal');
  doc.text(`Room: ${roomMeta?.label ?? 'Custom'} (${roomMeta?.labelHi ?? ''})`, 16, 59);
  doc.text(`Estimated Carpet / Wall Area: ~${areaSqFt} sq. ft.`, 16, 65);
  doc.text(
    `Indicative Price Range: Rs. ${Math.round(areaSqFt * estCostPerSqFt * 0.9).toLocaleString('en-IN')} - Rs. ${Math.round(areaSqFt * estCostPerSqFt * 1.15).toLocaleString('en-IN')} (subject to final site measurement)`,
    16,
    71
  );

  // 3. Render Screenshot Thumbnail if available
  let startTableY = 78;
  if (canvasImageUri) {
    try {
      doc.addImage(canvasImageUri, 'PNG', 16, 78, 178, 85);
      startTableY = 170;
    } catch (e) {
      console.warn('Could not add image to PDF:', e);
      startTableY = 78;
    }
  }

  // 4. Specification Table
  doc.setFillColor(242, 245, 250);
  doc.rect(16, startTableY, pageWidth - 32, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(11, 21, 48);
  doc.text('Surface / Wall Part', 20, startTableY + 5.5);
  doc.text('Type', 75, startTableY + 5.5);
  doc.text('Specification / Code', 115, startTableY + 5.5);
  doc.text('Finish / Texture', 165, startTableY + 5.5);

  let currentY = startTableY + 8;
  const entries = Object.entries(designs);

  if (entries.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 130);
    doc.text('No customized surfaces selected (pristine original specifications).', 20, currentY + 7);
    currentY += 14;
  } else {
    entries.slice(0, 12).forEach(([partId, design]) => {
      currentY += 7;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 35, 45);

      // Clean part label
      const cleanLabel = partId.split('/')[1]?.replace(/-/g, ' ') || partId;
      doc.text(cleanLabel.charAt(0).toUpperCase() + cleanLabel.slice(1), 20, currentY);

      if (design.type === 'color') {
        doc.text('Paint Color', 75, currentY);
        doc.text(design.colorHex || '#EAE2D5', 115, currentY);
        doc.text(design.finish ? design.finish.toUpperCase() : 'MATTE', 165, currentY);
      } else if (design.type === 'wallpaper') {
        const wp = WALLPAPER_CATALOG.find((w) => w.id === design.wallpaperId);
        doc.text('Wallpaper', 75, currentY);
        doc.text(wp?.name || design.wallpaperId || 'Pattern', 115, currentY);
        doc.text(`Scale ${design.wallpaperScale || 1.0}x`, 165, currentY);
      } else if (design.type === 'two_tone') {
        doc.text('Two-Tone Dado', 75, currentY);
        doc.text(`${design.colorHex} / ${design.secondaryColorHex}`, 115, currentY);
        doc.text(`Split ${Math.round((design.splitRatio || 0.35) * 100)}%`, 165, currentY);
      }
    });
  }

  // 5. Footer Terms & WhatsApp CTA
  const footerY = 278;
  doc.setFillColor(11, 21, 48);
  doc.rect(0, footerY - 5, pageWidth, 25, 'F');

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('FREE ON-SITE CONSULTATION & COLOR SAMPLING IN BHOPAL', 16, footerY);

  doc.setTextColor(200, 210, 230);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    'Visit our Zone-1 MP Nagar Experience Centre to touch physical wallpaper books and texture swatches.',
    16,
    footerY + 5
  );
  doc.text(
    'WhatsApp this design directly to +91 70003 02682 for immediate quotation & master painter slot booking.',
    16,
    footerY + 10
  );

  // Trigger browser download
  const cleanFilename = (projectName || 'RAI_Traders_Design_Sheet')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');
  doc.save(`${cleanFilename}.pdf`);
}
