export interface WhatsAppQuoteRequest {
  clientName?: string;
  phone?: string;
  service?: string;
  roomType?: string;
  areaSqFt?: number;
  estimatedRolls?: number;
  estimatedCostRange?: string;
  preferredStyle?: string;
  locality?: string;
  notes?: string;
}

export function sanitizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return digits || '917000302682';
}

export function generateWhatsAppUrl(
  phone: string,
  data: WhatsAppQuoteRequest
): string {
  const cleanNumber = sanitizePhone(phone);

  const lines: string[] = [
    `*नमस्ते RAI TRADERS Team,*`,
    `I would like to inquire about wall design & interior finishing for my space in Bhopal:`,
    '',
  ];

  if (data.clientName) {
    lines.push(`• *Client Name:* ${data.clientName}`);
  }
  if (data.service) {
    lines.push(`• *Selected Service:* ${data.service}`);
  }
  if (data.roomType) {
    lines.push(`• *Room / Space:* ${data.roomType}`);
  }
  if (data.areaSqFt) {
    lines.push(`• *Wall Area:* ~${data.areaSqFt} sq. ft.`);
  }
  if (data.estimatedRolls) {
    lines.push(`• *Estimated Wallpaper Rolls:* ~${data.estimatedRolls} rolls (including pattern matching)`);
  }
  if (data.estimatedCostRange) {
    lines.push(`• *Estimated Budget Range:* ${data.estimatedCostRange}`);
  }
  if (data.preferredStyle) {
    lines.push(`• *Design Pattern / Style:* ${data.preferredStyle}`);
  }
  if (data.locality) {
    lines.push(`• *Project Location:* ${data.locality}, Bhopal`);
  }
  if (data.notes) {
    lines.push(`• *Special Note:* ${data.notes}`);
  }

  lines.push('');
  lines.push(`Please let me know when you can provide catalog samples or schedule an on-site wall measurement.`);

  const text = lines.join('\n');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function generateQuickInquiryUrl(phone: string, serviceTitle?: string): string {
  const cleanNumber = sanitizePhone(phone);
  const text = serviceTitle
    ? `नमस्ते RAI TRADERS, I am interested in "${serviceTitle}" for my home/office in Bhopal. Please share catalog photos, wallpaper roll options, and pricing details.`
    : `नमस्ते RAI TRADERS, I would like to schedule a free site visit and wall consultation in Bhopal. Please get in touch!`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
