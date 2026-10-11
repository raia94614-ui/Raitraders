import { z } from 'zod';

export const BilingualTextSchema = z.object({
  en: z.string(),
  hi: z.string(),
});
export type BilingualText = z.infer<typeof BilingualTextSchema>;

export const BrandConfigSchema = z.object({
  businessName: z.string().min(1),
  tagline: BilingualTextSchema,
  phone: z.string().min(10),
  phoneDisplay: z.string(),
  email: z.string().email(),
  address: BilingualTextSchema,
  city: z.string(),
  state: z.string(),
  whatsappNumber: z.string(),
  googleMapsUrl: z.string(),
  googleMapsEmbed: z.string().optional().default(''),
  instagram: z.string().optional().default(''),
  facebook: z.string().optional().default(''),
});
export type BrandConfig = z.infer<typeof BrandConfigSchema>;

export const HeroConfigSchema = z.object({
  badge: BilingualTextSchema,
  title: BilingualTextSchema,
  description: BilingualTextSchema,
  primaryCtaText: BilingualTextSchema,
  primaryCtaLink: z.string(),
  secondaryCtaText: BilingualTextSchema,
  secondaryCtaLink: z.string(),
  backgroundImage: z.string(),
  statsBadge: BilingualTextSchema,
});
export type HeroConfig = z.infer<typeof HeroConfigSchema>;

export const TrustHighlightSchema = z.object({
  id: z.string(),
  title: BilingualTextSchema,
  description: BilingualTextSchema,
  icon: z.string(),
});
export type TrustHighlight = z.infer<typeof TrustHighlightSchema>;

export const AboutValueSchema = z.object({
  id: z.string(),
  title: BilingualTextSchema,
  description: BilingualTextSchema,
});
export type AboutValue = z.infer<typeof AboutValueSchema>;

export const AboutConfigSchema = z.object({
  heading: BilingualTextSchema,
  subheading: BilingualTextSchema,
  description: BilingualTextSchema,
  quote: BilingualTextSchema,
  image: z.string(),
  experienceBadge: BilingualTextSchema,
  values: z.array(AboutValueSchema),
});
export type AboutConfig = z.infer<typeof AboutConfigSchema>;

export const ServiceItemSchema = z.object({
  id: z.string(),
  title: BilingualTextSchema,
  description: BilingualTextSchema,
  fullDescription: BilingualTextSchema.optional(),
  image: z.string(),
  icon: z.string(),
  category: z.string(),
  features: z.array(BilingualTextSchema),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});
export type ServiceItem = z.infer<typeof ServiceItemSchema>;

export const GalleryItemSchema = z.object({
  id: z.string(),
  title: BilingualTextSchema,
  category: z.string(),
  image: z.string(),
  caption: BilingualTextSchema,
  roomType: z.string(),
  isFeatured: z.boolean().default(false),
  isSampleImage: z.boolean().default(true), // Explicitly indicates whether it's a sample vs authentic completed project
  sortOrder: z.number().default(0),
});
export type GalleryItem = z.infer<typeof GalleryItemSchema>;

export const BeforeAfterItemSchema = z.object({
  id: z.string(),
  title: BilingualTextSchema,
  description: BilingualTextSchema,
  beforeImage: z.string(),
  afterImage: z.string(),
  beforeLabel: BilingualTextSchema,
  afterLabel: BilingualTextSchema,
  isActive: z.boolean().default(true),
});
export type BeforeAfterItem = z.infer<typeof BeforeAfterItemSchema>;

export const ProcessStepSchema = z.object({
  step: z.string(),
  title: BilingualTextSchema,
  description: BilingualTextSchema,
  detail: BilingualTextSchema,
});
export type ProcessStep = z.infer<typeof ProcessStepSchema>;

export const WhyChooseUsItemSchema = z.object({
  id: z.string(),
  title: BilingualTextSchema,
  description: BilingualTextSchema,
  icon: z.string(),
});
export type WhyChooseUsItem = z.infer<typeof WhyChooseUsItemSchema>;

export const TestimonialItemSchema = z.object({
  id: z.string(),
  clientName: z.string(),
  location: BilingualTextSchema,
  rating: z.number().min(1).max(5),
  review: BilingualTextSchema,
  serviceUsed: BilingualTextSchema,
  isApproved: z.boolean().default(true),
  date: z.string(),
});
export type TestimonialItem = z.infer<typeof TestimonialItemSchema>;

export const FaqItemSchema = z.object({
  id: z.string(),
  question: BilingualTextSchema,
  answer: BilingualTextSchema,
  category: z.string(),
  sortOrder: z.number().default(0),
});
export type FaqItem = z.infer<typeof FaqItemSchema>;

export const AppearanceConfigSchema = z.object({
  accentColor: z.string().default('#D6A34D'),
  enableAnimations: z.boolean().default(true),
  animationSpeed: z.enum(['subtle', 'normal', 'expressive']).default('normal'),
  fontHeading: z.enum(['Cormorant Garamond', 'Playfair Display', 'Cinzel']).default('Cormorant Garamond'),
});
export type AppearanceConfig = z.infer<typeof AppearanceConfigSchema>;

export const SiteContentSchema = z.object({
  schemaVersion: z.number().default(2),
  brand: BrandConfigSchema,
  hero: HeroConfigSchema,
  trustHighlights: z.array(TrustHighlightSchema),
  about: AboutConfigSchema,
  services: z.array(ServiceItemSchema),
  gallery: z.array(GalleryItemSchema),
  beforeAfter: z.object({
    isEnabled: z.boolean().default(true),
    items: z.array(BeforeAfterItemSchema),
  }),
  process: z.array(ProcessStepSchema),
  whyChooseUs: z.array(WhyChooseUsItemSchema),
  testimonials: z.array(TestimonialItemSchema),
  faqs: z.array(FaqItemSchema),
  appearance: AppearanceConfigSchema,
  lastPublished: z.string().optional(),
});
export type SiteContent = z.infer<typeof SiteContentSchema>;
