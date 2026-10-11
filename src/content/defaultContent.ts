import type { SiteContent } from './schema';

export const defaultSiteContent: SiteContent = {
  schemaVersion: 2,
  brand: {
    businessName: "RAI TRADERS",
    tagline: {
      en: "Wallpaper Designing • Wall Painting",
      hi: "आपके घर, दुकान और सपनों को दें एक नया और खूबसूरत रूप",
    },
    phone: "7000302682",
    phoneDisplay: "+91 70003 02682",
    email: "raitraders0006@gmail.com",
    address: {
      en: "Zone 1, MP Nagar, Bhopal, Madhya Pradesh, India",
      hi: "ज़ोन 1, एमपी नगर, भोपाल, मध्य प्रदेश, भारत",
    },
    city: "Bhopal",
    state: "Madhya Pradesh",
    whatsappNumber: "917000302682",
    googleMapsUrl: "https://maps.google.com/?q=Zone+1+MP+Nagar+Bhopal+Madhya+Pradesh",
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14666.124584282586!2d77.4248464!3d23.2328766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c42404eb581e7%3A0xe54e56ebcba3f392!2sZone-I%2C%20Maharana%20Pratap%20Nagar%2C%20Bhopal%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin",
    instagram: "https://instagram.com/raitraders_bhopal",
    facebook: "https://facebook.com/raitradersbhopal",
  },
  hero: {
    badge: {
      en: "PREMIUM WALL DESIGN & FINISHING",
      hi: "प्रीमियम वॉल डिज़ाइन एवं फिनिशिंग",
    },
    title: {
      en: "Transform Your Walls. Elevate Your Space.",
      hi: "दीवारों को दें आपकी पसंद और सपनों का खूबसूरत रूप।",
    },
    description: {
      en: "Premium wallpaper designing and professional wall painting services for homes, offices, shops, and commercial spaces in Bhopal.",
      hi: "भोपाल में घरों, कार्यालयों, दुकानों और व्यावसायिक परिसरों के लिए उच्च गुणवत्ता वाला वॉलपेपर डिज़ाइनिंग और पेशेवर वॉल पेंटिंग।",
    },
    primaryCtaText: {
      en: "Explore Our Designs",
      hi: "हमारे डिज़ाइन देखें",
    },
    primaryCtaLink: "#gallery",
    secondaryCtaText: {
      en: "Get a Free Quote",
      hi: "मुफ़्त कोटेशन प्राप्त करें",
    },
    secondaryCtaLink: "#contact",
    backgroundImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85",
    statsBadge: {
      en: "Bhopal's Trusted Wall Decor Specialists",
      hi: "भोपाल का विश्वसनीय वॉल स्टूडियो",
    },
  },
  trustHighlights: [
    {
      id: "trust-1",
      title: { en: "7+ Years Legacy", hi: "7+ वर्ष का अनुभव" },
      description: {
        en: "Over 7 years of master craftsmanship with 1,200+ wall transformations across Bhopal.",
        hi: "भोपाल में 7+ वर्षों से 1,200 से अधिक सफल दीवार परियोजनाएं।",
      },
      icon: "shield",
    },
    {
      id: "trust-2",
      title: { en: "Creative Designs", hi: "रचनात्मक डिज़ाइन" },
      description: {
        en: "Curated modern motifs, geometric patterns, royal damasks, and custom art.",
        hi: "आधुनिक मोटिफ्स, ज्यामितीय पैटर्न, शाही डमास्क और कस्टम वॉल आर्ट।",
      },
      icon: "Palette",
    },
    {
      id: "trust-3",
      title: { en: "Timely Service", hi: "समयबद्ध कार्य" },
      description: {
        en: "Punctual consultation, disciplined execution, and tidy handover.",
        hi: "समय पर परामर्श, अनुशासित कार्य और स्वच्छ हैंडओवर।",
      },
      icon: "Clock",
    },
    {
      id: "trust-4",
      title: { en: "Customer Satisfaction", hi: "ग्राहक संतुष्टि" },
      description: {
        en: "Transparent pricing, honest guidance, and post-finish satisfaction review.",
        hi: "स्पष्ट दरें, पारदर्शी मार्गदर्शन और कार्य समाप्ति के बाद समीक्षा।",
      },
      icon: "HeartHandshake",
    },
  ],
  about: {
    heading: {
      en: "Beautiful Walls. Better Spaces.",
      hi: "खूबसूरत दीवारें। बेहतर आशियाना।",
    },
    subheading: {
      en: "7+ Years of Interior Excellence in Bhopal",
      hi: "भोपाल में 7+ वर्षों की कलात्मक उत्कृष्टता",
    },
    description: {
      en: "RAI TRADERS brings together creative wallpaper designs and professional wall painting to help transform ordinary spaces into beautiful, welcoming environments. Serving Bhopal for over 7+ years with meticulous workmanship and lasting customer satisfaction.",
      hi: "राय ट्रेडर्स रचनात्मक वॉलपेपर डिज़ाइन और पेशेवर वॉल पेंटिंग के संगम से साधारण कमरों को मनमोहक और स्वागतयोग्य परिवेश में बदलता है।",
    },
    quote: {
      en: "We believe every wall reflects your unique personality and refined taste.",
      hi: "हम समझते हैं कि हर दीवार सिर्फ एक ढांचा नहीं, बल्कि आपकी पसंद और पहचान का आइना है।",
    },
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
    experienceBadge: {
      en: "7+ Years of Master Craftsmanship",
      hi: "7+ वर्षों की समर्पित कारीगरी",
    },
    values: [
      {
        id: "v-1",
        title: { en: "Quality-Focused Work", hi: "गुणवत्ता-केंद्रित कार्य" },
        description: {
          en: "Tested adhesives, surface primers, and laser-precise joint alignment.",
          hi: "परीक्षित एडहेसिव्स, वॉल प्राइमर और जोड़ों का सटीक संरेखण।",
        },
      },
      {
        id: "v-2",
        title: { en: "Designs for Every Space", hi: "हर कमरे के अनुरूप डिज़ाइन" },
        description: {
          en: "From serene bedroom botanicals to bold commercial accent walls.",
          hi: "शांत बेडरूम फ्लोरल से लेकर भव्य बोर्डरूम फीचर दीवारों तक।",
        },
      },
      {
        id: "v-3",
        title: { en: "Customer-First Service", hi: "ग्राहक-प्रथम सेवा" },
        description: {
          en: "Transparent estimation, on-site catalog viewing in Bhopal, and zero mess.",
          hi: "पारदर्शी एस्टीमेट, भोपाल में ऑन-साइट कैटलॉग दर्शन और साफ-सुथरा काम।",
        },
      },
    ],
  },
  services: [
    {
      id: "srv-1",
      title: { en: "Wallpaper Designing", hi: "वॉलपेपर डिज़ाइनिंग" },
      description: {
        en: "Stylish wallpaper designs for bedrooms, living rooms, offices, and feature walls.",
        hi: "बेडरूम, लिविंग रूम, ऑफिस और फीचर दीवारों के लिए आकर्षक वॉलपेपर।",
      },
      fullDescription: {
        en: "Explore vinyl-coated, non-woven, and 3D textured wallpapers tailored to your room architecture.",
        hi: "विनाइल-कोटेड, नॉन-वोवेन और 3D टेक्सचर्ड वॉलपेपर्स का समृद्ध संग्रह।",
      },
      image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=900&q=80",
      icon: "Layers",
      category: "Wallpaper",
      features: [
        { en: "Custom Pattern Fitting", hi: "कस्टम पैटर्न फिटिंग" },
        { en: "Seamless Seam Matching", hi: "सटीक जोड़ मिलान" },
        { en: "Non-Toxic Pastes", hi: "सुरक्षित पेस्ट सामग्री" },
      ],
      isActive: true,
      sortOrder: 1,
    },
    {
      id: "srv-2",
      title: { en: "Professional Wall Painting", hi: "प्रोफेशनल वॉल पेंटिंग" },
      description: {
        en: "Fresh, elegant wall painting with finishes suited to your space.",
        hi: "आपकी पसंद के अनुसार स्मूथ फिनिश के साथ प्रीमियम वॉल पेंटिंग।",
      },
      fullDescription: {
        en: "Matte, silk, and glossy sheens prepared with wall putty and smooth dual coats.",
        hi: "पुट्टी और प्राइमर के साथ तैयार की गई स्मूथ मैट व सिल्क फिनिश।",
      },
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80",
      icon: "Paintbrush",
      category: "Painting",
      features: [
        { en: "Dust-Controlled Sanding", hi: "धूल-नियंत्रित सैंडिंग" },
        { en: "Waterproof Base Coat", hi: "वाटरप्रूफ बेस कोट" },
        { en: "Color Palette Curation", hi: "कलर पैलेट चयन" },
      ],
      isActive: true,
      sortOrder: 2,
    },
    {
      id: "srv-3",
      title: { en: "Texture Wall Finishes", hi: "टेक्सचर वॉल फिनिश" },
      description: {
        en: "Decorative textures that add depth, character, and visual interest.",
        hi: "दीवारों को गहराई और शाही आभा देने वाले आकर्षक डेकोरेटिव टेक्सचर।",
      },
      fullDescription: {
        en: "Italian stucco, metallic leaf, rustic concrete, and pearl swirl finishes.",
        hi: "इटैलियन स्टुक्को, मेटैलिक गोल्ड लीफ और रस्टिक स्टोन फिनिश।",
      },
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80",
      icon: "Sparkles",
      category: "Textures",
      features: [
        { en: "Metallic Gold Highlights", hi: "मेटैलिक गोल्ड हाइलाइट्स" },
        { en: "Rustic Concrete & Stone", hi: "रस्टिक स्टोन फिनिश" },
        { en: "Long-Lasting Surface", hi: "दीर्घकालिक टिकाऊपन" },
      ],
      isActive: true,
      sortOrder: 3,
    },
    {
      id: "srv-4",
      title: { en: "Custom Wall Designs", hi: "कस्टम वॉल डिज़ाइन" },
      description: {
        en: "Personalized wall design concepts based on customer preferences.",
        hi: "आपकी व्यक्तिगत पसंद और थीम के अनुसार तैयार किए गए विशेष डिज़ाइन।",
      },
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
      icon: "LayoutTemplate",
      category: "Custom",
      features: [
        { en: "Geometric Molding Inlay", hi: "मोल्डिंग इनले वर्क" },
        { en: "Bespoke Room Color Blends", hi: "अनुकूलित रंग संयोजन" },
        { en: "Free Sample Visualization", hi: "निःशुल्क सैंपल दृश्य" },
      ],
      isActive: true,
      sortOrder: 4,
    },
    {
      id: "srv-5",
      title: { en: "Residential Interior Walls", hi: "आवासीय इंटीरियर दीवारें" },
      description: {
        en: "Beautiful wall finishes for homes, apartments, and individual rooms.",
        hi: "फ्लैट्स, विला और कमरों के लिए सुंदर और टिकाऊ दीवार फिनिश।",
      },
      image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=900&q=80",
      icon: "Home",
      category: "Residential",
      features: [
        { en: "Bedhead Accent Walls", hi: "बेडरूम हेडबोर्ड दीवारें" },
        { en: "Living Room TV Unit Backdrops", hi: "टीवी यूनिट बैकड्रॉप" },
        { en: "Pooja Room Sanctum Finishes", hi: "पूजा घर विशेष फिनिश" },
      ],
      isActive: true,
      sortOrder: 5,
    },
    {
      id: "srv-6",
      title: { en: "Commercial Wall Decoration", hi: "व्यावसायिक वॉल डेकोरेशन" },
      description: {
        en: "Attractive wall treatments for offices, shops, and business spaces.",
        hi: "शोरूम, बुटीक और कॉर्पोरेट ऑफिस के लिए प्रभावशाली वॉल ट्रीटमेंट।",
      },
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
      icon: "Building2",
      category: "Commercial",
      features: [
        { en: "Commercial Grade Durability", hi: "व्यावसायिक ग्रेड मजबूती" },
        { en: "Brand Color Alignment", hi: "ब्रांड थीम के अनुरूप" },
        { en: "Minimal Business Downtime", hi: "त्वरित निष्पादन" },
      ],
      isActive: true,
      sortOrder: 6,
    },
  ],
  gallery: [
    {
      id: "gal-1",
      title: { en: "Opulent Metallic Damask Wallpaper", hi: "शाही मेटैलिक डमास्क वॉलपेपर" },
      category: "Wallpaper",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
      caption: {
        en: "Intricate champagne-gold wallpaper creating a focal point for a luxury master bedroom.",
        hi: "मास्टर बेडरूम के लिए शैम्पेन-गोल्ड फिनिश वाला भव्य वॉलपेपर।",
      },
      roomType: "Bedroom",
      isFeatured: true,
      isSampleImage: true,
      sortOrder: 1,
    },
    {
      id: "gal-2",
      title: { en: "Contemporary Minimalist Paint Blend", hi: "कंटेम्परेरी मिनिमलिस्ट पेंट" },
      category: "Wall Painting",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85",
      caption: {
        en: "Smooth matte velvet midnight navy wall with champagne trims.",
        hi: "स्मूथ मैट वेलवेट मिडनाइट नेवी वॉल शैम्पेन ट्रिम्स के साथ।",
      },
      roomType: "Living Room",
      isFeatured: true,
      isSampleImage: true,
      sortOrder: 2,
    },
    {
      id: "gal-3",
      title: { en: "Sculpted Italian Stucco Texture", hi: "इटैलियन स्टुक्को मार्मोरिनो" },
      category: "Texture Finish",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
      caption: {
        en: "Artisanal hand-troweled texture with subtle metallic pearl shimmer.",
        hi: "हस्तनिर्मित मार्मोरिनो टेक्सचर जिसमें सूक्ष्म मोती जैसी चमक है।",
      },
      roomType: "Living Room",
      isFeatured: true,
      isSampleImage: true,
      sortOrder: 3,
    },
    {
      id: "gal-4",
      title: { en: "Executive Conference Wall Finish", hi: "एग्जीक्यूटिव कॉन्फ्रेंस वॉल" },
      category: "Commercial Spaces",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
      caption: {
        en: "Sleek architectural paneling and textured matte coat for corporate suite.",
        hi: "कॉर्पोरेट ऑफिस के लिए आर्किटेक्चरल पैनलिंग और टेक्सचर्ड कोट।",
      },
      roomType: "Commercial Spaces",
      isFeatured: true,
      isSampleImage: true,
      sortOrder: 4,
    },
    {
      id: "gal-5",
      title: { en: "Botanical Forest Feature Wallpaper", hi: "बोटैनिकल फॉरेस्ट वॉलपेपर" },
      category: "Wallpaper",
      image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85",
      caption: {
        en: "Lush botanical panoramic wallpaper breathing organic warmth into dining room.",
        hi: "डाइनिंग रूम में प्राकृतिक शांति लाने वाला बोटैनिकल वॉलपेपर।",
      },
      roomType: "Living Room",
      isFeatured: false,
      isSampleImage: true,
      sortOrder: 5,
    },
    {
      id: "gal-6",
      title: { en: "Bespoke Geometric Accent Wall", hi: "ज्यामितीय इनले एक्सेंट वॉल" },
      category: "Wall Painting",
      image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=85",
      caption: {
        en: "Geometric gold inlay lines over charcoal navy backdrop create modern luxury.",
        hi: "गोल्डन इनले लाइनों के साथ आधुनिक लग्जरी एक्सेंट वॉल।",
      },
      roomType: "Bedroom",
      isFeatured: true,
      isSampleImage: true,
      sortOrder: 6,
    },
  ],
  beforeAfter: {
    isEnabled: true,
    items: [
      {
        id: "ba-1",
        title: { en: "Living Room Accent Transformation", hi: "लिविंग रूम दीवार का कायाकल्प" },
        description: {
          en: "Drag the slider to see how plain, uneven walls are elevated into breathtaking designer focal points.",
          hi: "स्लाइडर को खींचकर देखें कि कैसे साधारण दीवार एक भव्य डिजाइनर केंद्र बिंदु में बदल जाती है।",
        },
        beforeImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
        afterImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
        beforeLabel: { en: "Original Plain Wall", hi: "शुरुआती साधारण दीवार" },
        afterLabel: { en: "RAI TRADERS Finish", hi: "राय ट्रेडर्स फिनिश" },
        isActive: true,
      },
    ],
  },
  process: [
    {
      step: "01",
      title: { en: "Consultation", hi: "परामर्श" },
      description: { en: "Discuss preferences & requirements", hi: "आवश्यकताओं एवं पसंद पर चर्चा" },
      detail: {
        en: "We inspect your wall dimensions, check surface moisture, and understand your interior style.",
        hi: "दीवार के आकार की माप, सतह की जांच और आपकी पसंद की इंटीरियर थीम पर चर्चा।",
      },
    },
    {
      step: "02",
      title: { en: "Design Selection", hi: "डिज़ाइन चयन" },
      description: { en: "Explore wallpapers & finish swatches", hi: "कैटलॉग से वॉलपेपर व शेड का चयन" },
      detail: {
        en: "Browse physical sample albums and digital catalogs to choose the exact pattern and texture.",
        hi: "फिजिकल सैंपल एल्बम और डिजिटल कैटलॉग से मनपसंद पैटर्न और शेड का चयन।",
      },
    },
    {
      step: "03",
      title: { en: "Execution", hi: "सटीक कार्य" },
      description: { en: "Surface prep & skilled application", hi: "सतह की तैयारी और कुशल अनुप्रयोग" },
      detail: {
        en: "Surface priming, dust-controlled putty, and laser-guided seamless wallpaper installation.",
        hi: "प्राइमर, पुट्टी और लेजर-सटीक जोड़ों के साथ वॉलपेपर की कुशल स्थापना।",
      },
    },
    {
      step: "04",
      title: { en: "Final Review", hi: "अंतिम समीक्षा" },
      description: { en: "Walk-through & satisfaction sign-off", hi: "हैंडओवर एवं संतुष्टि समीक्षा" },
      detail: {
        en: "Edge adhesion check, lighting reflection inspection, clean site handover.",
        hi: "किनारों की चिपचिपाहट और फिनिशिंग की जांच, तथा स्वच्छ परिसर का हैंडओवर।",
      },
    },
  ],
  whyChooseUs: [
    {
      id: "w-0",
      title: { en: "7+ Years Bhopal Heritage", hi: "7+ वर्षों की अटूट प्रतिष्ठा" },
      description: {
        en: "Serving Bhopal for over 7+ years with 1,200+ completed wall transformations and verified trust.",
        hi: "भोपाल में 7 से अधिक वर्षों की अटूट प्रतिष्ठा और 1,200+ सफल वॉल प्रोजेक्ट्स।",
      },
      icon: "award",
    },
    {
      id: "w-1",
      title: { en: "Attractive Design Options", hi: "आकर्षक डिज़ाइन विकल्प" },
      description: {
        en: "Extensive collections of modern geometric, royal damask, 3D textured, and minimalist concepts.",
        hi: "आधुनिक ज्यामितीय, शाही डमास्क, 3D टेक्सचर और मिनिमलिस्ट शैलियों का विस्तृत संग्रह।",
      },
      icon: "Sparkles",
    },
    {
      id: "w-2",
      title: { en: "Quality-Focused Workmanship", hi: "गुणवत्तापूर्ण कारीगरी" },
      description: {
        en: "Every joint and corner is aligned with precision using proven durable materials.",
        hi: "प्रत्येक जोड़ और कोने को टिकाऊ सामग्रियों के साथ पूर्ण सटीकता से संरेखित किया जाता है।",
      },
      icon: "Gem",
    },
    {
      id: "w-3",
      title: { en: "Personalized Recommendations", hi: "व्यक्तिगत मार्गदर्शन" },
      description: {
        en: "We help you select wallpapers suited to your room lighting and lifestyle usage.",
        hi: "कमरे की प्राकृतिक रोशनी और उपयोगिता के आधार पर सही सामग्री चुनने में मदद।",
      },
      icon: "Compass",
    },
    {
      id: "w-4",
      title: { en: "Residential & Commercial", hi: "आवासीय एवं व्यावसायिक" },
      description: {
        en: "Equally adept at cozy bedroom makeovers and high-traffic commercial showrooms.",
        hi: "घर के बेडरूम से लेकर व्यस्त शोरूम और कार्यालयों तक के लिए उपयुक्त।",
      },
      icon: "Building",
    },
    {
      id: "w-5",
      title: { en: "Professional Communication", hi: "स्पष्ट संवाद" },
      description: {
        en: "Clear timelines, transparent quotes with zero hidden charges, and courteous team.",
        hi: "समयसीमा का पालन, बिना किसी छिपे शुल्क के पारदर्शी अनुमान और शिष्ट व्यवहार।",
      },
      icon: "MessageSquare",
    },
    {
      id: "w-6",
      title: { en: "Focus on Timely Service", hi: "समय की पाबंदी" },
      description: {
        en: "We respect your schedule and complete installations within agreed timeframes.",
        hi: "हम आपके समय का सम्मान करते हैं और तय समय में कार्य पूरा करते हैं।",
      },
      icon: "CheckCircle2",
    },
  ],
  testimonials: [
    {
      id: "t-1",
      clientName: "Rahul Sharma",
      location: { en: "Arera Colony, Bhopal", hi: "अरेरा कॉलोनी, भोपाल" },
      rating: 5,
      review: {
        en: "RAI TRADERS installed wallpaper in our master bedroom. The alignment is fantastic and the metallic finish looks so rich.",
        hi: "राय ट्रेडर्स ने हमारे बेडरूम में वॉलपेपर लगाया। फिनिशिंग बेहद शानदार है और शाम की रोशनी में बहुत खूबसूरत दिखता है।",
      },
      serviceUsed: { en: "Wallpaper Designing", hi: "वॉलपेपर डिज़ाइनिंग" },
      isApproved: true,
      date: "August 2026",
    },
    {
      id: "t-2",
      clientName: "Pooja Verma",
      location: { en: "MP Nagar Zone 2, Bhopal", hi: "एमपी नगर ज़ोन 2, भोपाल" },
      rating: 5,
      review: {
        en: "Very professional team. They showed catalogue samples at our office and completed the textured wall neatly in 2 days.",
        hi: "बहुत पेशेवर टीम। ऑफिस में आकर कैटलॉग दिखाया और 2 दिनों में साफ-सुथरा टेक्सचर का काम पूरा किया।",
      },
      serviceUsed: { en: "Texture Wall Finish", hi: "टेक्सचर वॉल फिनिश" },
      isApproved: true,
      date: "September 2026",
    },
  ],
  faqs: [
    {
      id: "faq-1",
      question: {
        en: "What wallpaper designs are available?",
        hi: "आपके पास कौन-से वॉलपेपर डिज़ाइन उपलब्ध हैं?",
      },
      answer: {
        en: "We offer floral, damask, geometric, 3D embossed, botanical, abstract, and modern minimalist themes in durable vinyl-coated and non-woven papers.",
        hi: "हमारे पास फ्लोरल, डमास्क, ज्यामितीय, 3D एम्बॉस्ड, बोटैनिकल और आधुनिक मिनिमलिस्ट शैलियों के टिकाऊ वॉलपेपर्स उपलब्ध हैं।",
      },
      category: "Wallpaper",
      sortOrder: 1,
    },
    {
      id: "faq-2",
      question: {
        en: "Do you provide wall painting services?",
        hi: "क्या आप वॉल पेंटिंग सेवा भी प्रदान करते हैं?",
      },
      answer: {
        en: "Yes, we provide complete professional wall painting including putty preparation, primer coating, and premium emulsion finishes in matte and silk sheens.",
        hi: "हाँ, हम पुट्टी, प्राइमर बेस और प्रीमियम इंटीरियर इमल्शन (मैट व सिल्क फिनिश) के साथ संपूर्ण वॉल पेंटिंग सेवा प्रदान करते हैं।",
      },
      category: "Painting",
      sortOrder: 2,
    },
    {
      id: "faq-3",
      question: {
        en: "Can I request a custom wall design?",
        hi: "क्या मैं कस्टम वॉल डिज़ाइन का अनुरोध कर सकता हूँ?",
      },
      answer: {
        en: "Absolutely! We customize geometric paneling, accent color combinations, and textured walls to match your room dimensions and aesthetic preference.",
        hi: "बिल्कुल! हम आपके कमरे के आकार और पसंद के अनुसार ज्यामितीय मोल्डिंग, कस्टम शेड और टेक्सचर तैयार करते हैं।",
      },
      category: "Custom",
      sortOrder: 3,
    },
    {
      id: "faq-4",
      question: {
        en: "Do you serve residential and commercial customers?",
        hi: "क्या आप घरों और दुकानों दोनों के लिए सेवा देते हैं?",
      },
      answer: {
        en: "Yes, we cater to homes, flats, villas as well as offices, retail showrooms, boutiques, and clinics across Bhopal.",
        hi: "हाँ, हम भोपाल में फ्लैट्स और विला के साथ-साथ कार्यालयों, शोरूम, बुटीक और क्लीनिकों के लिए भी सेवा प्रदान करते हैं।",
      },
      category: "General",
      sortOrder: 4,
    },
    {
      id: "faq-5",
      question: {
        en: "How can I request a quotation?",
        hi: "मैं कोटेशन कैसे प्राप्त कर सकता हूँ?",
      },
      answer: {
        en: "You can click 'Get a Free Quote' or message us on WhatsApp at 7000302682 with your wall dimensions. We provide transparent upfront estimates.",
        hi: "आप 'मुफ़्त कोटेशन' पर क्लिक कर सकते हैं या 7000302682 पर व्हाट्सएप करके अपनी दीवार का माप भेज सकते हैं। हम पारदर्शी अनुमान देंगे।",
      },
      category: "Quotation",
      sortOrder: 5,
    },
    {
      id: "faq-6",
      question: {
        en: "How can I contact RAI TRADERS in Bhopal?",
        hi: "भोपाल में राय ट्रेडर्स से संपर्क कैसे करें?",
      },
      answer: {
        en: "You can call or WhatsApp us at 7000302682, email raitraders0006@gmail.com, or visit our location in Zone 1, MP Nagar, Bhopal, Madhya Pradesh.",
        hi: "आप 7000302682 पर कॉल या व्हाट्सएप कर सकते हैं, raitraders0006@gmail.com पर ईमेल भेज सकते हैं, या ज़ोन 1, एमपी नगर, भोपाल स्थित पते पर मिल सकते हैं।",
      },
      category: "Contact",
      sortOrder: 6,
    },
  ],
  appearance: {
    accentColor: "#D6A34D",
    enableAnimations: true,
    animationSpeed: "normal",
    fontHeading: "Cormorant Garamond",
  },
  lastPublished: new Date().toISOString(),
};
