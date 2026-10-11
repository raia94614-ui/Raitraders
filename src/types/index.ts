export interface BrandConfig {
  businessName: string;
  tagline: string;
  hindiTagline: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  address: string;
  city: string;
  state: string;
  whatsappNumber: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  instagram: string;
  facebook: string;
}

export interface HeroConfig {
  badge: string;
  title: string;
  hindiTitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  backgroundImage: string;
  statsBadge: string;
}

export interface TrustHighlight {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AboutValue {
  id: string;
  title: string;
  description: string;
}

export interface AboutConfig {
  heading: string;
  subheading: string;
  description: string;
  quote?: string;
  hindiQuote?: string;
  image: string;
  experienceBadge: string;
  values: AboutValue[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  image: string;
  icon: string;
  category: string;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Wallpaper' | 'Wall Painting' | 'Texture Finish' | 'Living Room' | 'Bedroom' | 'Commercial Spaces';
  image: string;
  caption: string;
  roomType: string;
  isFeatured: boolean;
  sortOrder: number;
}

export interface BeforeAfterConfig {
  isEnabled: boolean;
  title: string;
  subtitle: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  detail: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  location: string;
  rating: number;
  review: string;
  serviceUsed: string;
  avatarUrl?: string;
  isApproved: boolean;
  date: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface AppearanceConfig {
  accentColor: string;
  enableAnimations: boolean;
  animationSpeed: 'subtle' | 'normal' | 'expressive';
  fontHeading: 'Cinzel' | 'Playfair Display' | 'Cormorant';
}

export interface SiteContent {
  brand: BrandConfig;
  hero: HeroConfig;
  trustHighlights: TrustHighlight[];
  about: AboutConfig;
  services: ServiceItem[];
  gallery: GalleryItem[];
  beforeAfter: BeforeAfterConfig;
  process: ProcessStep[];
  whyChooseUs: WhyChooseUsItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  appearance: AppearanceConfig;
  lastUpdated: string;
}

export interface QuoteFormData {
  customerName: string;
  phoneNumber: string;
  serviceRequired: string;
  propertyType: string;
  approxWallArea: string;
  preferredContact: 'WhatsApp' | 'Phone Call' | 'Email';
  message: string;
}
