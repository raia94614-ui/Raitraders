import type { BrandConfig } from '../content/schema';

export function updatePageMeta(
  brand: BrandConfig,
  lang: 'en' | 'hi',
  customTitle?: string
) {
  if (typeof document === 'undefined') return;

  const titleEn = `${brand.businessName} — Luxury Wallpaper & Wall Painting in Bhopal`;
  const titleHi = `${brand.businessName} — भोपाल में प्रीमियम वॉलपेपर एवं वॉल पेंटिंग`;
  const descEn = `Transform your walls with RAI TRADERS, Bhopal's premier destination for luxury wallpaper designing, royal wall textures, and 3D murals. Located at Zone 1, MP Nagar, Bhopal.`;
  const descHi = `आपके घर, दुकान और सपनों को दें एक नया और खूबसूरत रूप। राय ट्रेडर्स - ज़ोन 1, एमपी नगर, भोपाल। प्रीमियम वॉलपेपर एवं प्रोफेशनल वॉल पेंटिंग।`;

  document.title = customTitle || (lang === 'hi' ? titleHi : titleEn);

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', lang === 'hi' ? descHi : descEn);

  // Update JSON-LD script tag
  let scriptTag = document.querySelector('script[type="application/ld+json"]#local-business-schema');
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    scriptTag.setAttribute('id', 'local-business-schema');
    document.head.appendChild(scriptTag);
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: brand.businessName,
    image: 'https://raitraders.com/brand/logo.png',
    telephone: brand.phone,
    email: brand.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Zone 1, MP Nagar',
      addressLocality: 'Bhopal',
      addressRegion: 'Madhya Pradesh',
      postalCode: '462011',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '23.2332',
      longitude: '77.4343',
    },
    url: 'https://raitraders.com',
    priceRange: '₹₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '10:00',
        closes: '21:00',
      },
    ],
  };

  scriptTag.textContent = JSON.stringify(schemaData);
}
