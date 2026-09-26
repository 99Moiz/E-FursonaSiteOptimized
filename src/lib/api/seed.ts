// Local seed data, shaped exactly like the real API responses.
// Used only when VITE_DEMO_MODE=true, so the UI is browsable before the
// .NET backend is deployed/reachable. Real usage should leave this off.


import type {
  BeforeAfterImage,
  Category,
  Faq,
  ProductDetail,
  ProductListItem,
  SiteGalleryItem,
  Testimonial,
  TimelapseVideo,
  WorkInProgressImage,
} from "./types";

export const seedCategories: Category[] = [
  { id: 1, name: "Full Fursuit", sortOrder: 0, isActive: true },
  { id: 2, name: "Partial Suit", sortOrder: 1, isActive: true },
  { id: 3, name: "Head Build", sortOrder: 2, isActive: true },
  { id: 4, name: "Paw + Tail Set", sortOrder: 3, isActive: true },
  { id: 5, name: "Custom Hybrid", sortOrder: 4, isActive: true },
];

interface SeedProduct extends ProductDetail {
  galleryImages: string[];
}


const raw: SeedProduct[] = [
  
  
  {
    id: 6,
    slug: "chimera-hybrid-build",
    title: "Chimera Hybrid Build",
    categoryId: 5,
    category: "Custom Hybrid",
    price: 6400,
    rating: 5.0,
    shortDesc: "Multi-species hybrid showpiece.",
    description:
      "Our most ambitious build — a fully custom hybrid blending traits from multiple species into a single award-grade showpiece.",
    isActive: true,
    sortOrder: 5,
    coverImage: null,
    videoUrl: null,
    gallery: [],
    galleryImages: [],
    features: [
      "Bespoke concept art",
      "Multi-species fur blending",
      "Show-grade finishing",
      "Optional wings or horns",
      "Unlimited revisions",
    ],
    specs: [
      { id: 21, label: "Build Time", value: "20 weeks", sortOrder: 0 },
      { id: 22, label: "Materials", value: "Premium fully bespoke", sortOrder: 1 },
      { id: 23, label: "Includes", value: "Full custom build", sortOrder: 2 },
      { id: 24, label: "Shipping", value: "White-glove worldwide", sortOrder: 3 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    slug: "arctic-fox-partial",
    title: "Arctic Fox Partial Suit",
    categoryId: 2,
    category: "Partial Suit",
    price: 1800,
    rating: 4.9,
    shortDesc: "Head, paws, and tail set with icy blue accents.",
    description: "A crisp, convention-ready partial suit featuring a fully articulated head, matching hand paws, and a long plume tail.",
    isActive: true,
    sortOrder: 1,
    coverImage: null,
    videoUrl: null,
    gallery: [],
    galleryImages: [],
    features: ["Follow-me jaw", "Airbrushed shading", "Matching hand paws", "Removable tail"],
    specs: [
      { id: 25, label: "Build Time", value: "8 weeks", sortOrder: 0 },
      { id: 26, label: "Weight", value: "Under 2.5 lbs", sortOrder: 1 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 8,
    slug: "sunset-dragon-headshot",
    title: "Sunset Dragon Headshot",
    categoryId: 3,
    category: "Head Build",
    price: 90,
    rating: 5.0,
    shortDesc: "Vivid digital portrait with warm gradient shading.",
    description: "A vibrant, fully rendered headshot commission with custom lighting and background to match your fursona's palette.",
    isActive: true,
    sortOrder: 2,
    coverImage: null,
    videoUrl: null,
    gallery: [],
    galleryImages: [],
    features: ["Full-color rendering", "Custom background", "2 revision rounds"],
    specs: [{ id: 27, label: "Delivery", value: "3-5 days", sortOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const seedProducts: ProductDetail[] = raw.map((p) => ({
  ...p,
  gallery: p.galleryImages.map((url, i) => ({
    id: p.id * 10 + i,
    imageUrl: url,
    altText: p.title,
    isPrimary: i === 0,
    sortOrder: i,
  })),
}));

export const seedProductList: ProductListItem[] = seedProducts.map((p) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  category: p.category,
  price: p.price,
  rating: p.rating,
  shortDesc: p.shortDesc,
  coverImage: p.coverImage,
  videoUrl: p.videoUrl,
  isActive: p.isActive,
  sortOrder: p.sortOrder,
}));

export const seedTestimonials: Testimonial[] = [
 
];

export const seedFaqs: Faq[] = [
  { id: 1, question: "How long does a custom fursuit take?", answer: "Heads ship in ~8 weeks, partials in ~12, and full suits in ~16. Rush slots open quarterly.", categoryTag: "general", sortOrder: 0, isActive: true },
  { id: 2, question: "Can I bring my own character design?", answer: "Absolutely. We accept ref sheets, sketches, or even mood boards. Our artists translate any vision into a buildable spec.", categoryTag: "general", sortOrder: 1, isActive: true },
  { id: 3, question: "Do you ship internationally?", answer: "Yes — to 75+ countries, fully insured, with duty-paid options for EU, UK, AU, JP, and CA.", categoryTag: "shipping", sortOrder: 2, isActive: true },
  { id: 4, question: "What's your payment plan?", answer: "30% deposit secures your slot. The remainder splits across milestones with no interest.", categoryTag: "payment", sortOrder: 3, isActive: true },
  { id: 5, question: "How do I clean and care for the suit?", answer: "Every order includes a printed care kit, video guide, and lifetime touch-up support from the original maker.", categoryTag: "care", sortOrder: 4, isActive: true },
  { id: 6, question: "Do you offer NSFW or mature designs?", answer: "We focus exclusively on SFW convention-grade character work.", categoryTag: "general", sortOrder: 5, isActive: true },
];

export const seedGallery: SiteGalleryItem[] = [
 
];

export const seedTimelapses: TimelapseVideo[] = [
 
];

export const seedBeforeAfter: BeforeAfterImage[] = [
  
];

export const seedWorkInProgress: WorkInProgressImage[] = [
  // Stage grid for "Aurora Wolf — Full Suit" (also feeds the Live Commission Queue via progressPercent/estimatedDelivery)
  
  // Additional in-progress commissions, queue-only (no stage image needed on the grid)
 
];
