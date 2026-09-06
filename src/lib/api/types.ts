// Mirrors the C# DTOs in EcommDesignsHub/Models/Dtos exactly.

export interface Category {
  id: number;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface GalleryImage {
  id: number;
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Spec {
  id: number;
  label: string;
  value: string;
  sortOrder: number;
}

export interface ProductListItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  shortDesc: string;
  coverImage: string;
  videoUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface ProductDetail {
  id: number;
  slug: string;
  title: string;
  categoryId: number;
  category: string;
  price: number;
  rating: number;
  shortDesc: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  coverImage: string;
  videoUrl?: string | null;
  gallery: GalleryImage[];
  features: string[];
  specs: Spec[];
  createdAt: string;
  updatedAt: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  categoryTag: string;
  sortOrder: number;
  isActive: boolean;
}

export interface SiteGalleryItem {
  id: number;
  imageUrl: string;
  caption: string;
  altText: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id: number;
  clientName: string;
  location: string;
  avatarUrl: string;
  rating: number;
  reviewText: string;
  productRef: string;
  isActive: boolean;
  sortOrder: number;
}

export interface WhatsAppInquiryResponse {
  link: string;
  message: string;
}

// No backend endpoint yet — shape mirrors the other site-content DTOs above
// (SiteGalleryItem, Testimonial, etc.) so it drops in cleanly once
// GET /api/timelapses exists.
export interface TimelapseVideo {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string | null;
  durationLabel: string;
  sortOrder: number;
  isActive: boolean;
}

// Mirrors the backend's BeforeAfterImage entity — powers the "Before &
// After" slider in the "Behind The Craft" section (Trust.tsx).
export interface BeforeAfterImage {
  id: number;
  title: string;
  description: string | null;
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeLabel: string;
  afterLabel: string;
  sortOrder: number;
  isActive: boolean;
}

// Mirrors the backend's WorkInProgressImage entity — powers both the
// Sketch → Line Art → Flat Color → Final Render stage grid AND (via the
// optional progress fields) the "Live Commission Queue" panel, both in
// Trust.tsx.
export interface WorkInProgressImage {
  id: number;
  projectTitle: string;
  stageName: string;
  stageNumber: number;
  imageUrl: string;
  description: string | null;
  progressPercent: number | null;
  estimatedDelivery: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductQuery {
  category?: string;
  active?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}
