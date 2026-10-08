export interface EventShow {
  id: number;
  title: string;
  date: string;
  day?: string;
  month?: string;
  time?: string;
  location: string;
  venue?: string;
  cover: string;
  description: string;
  category?: "shows" | "congado" | "oficinas" | "social" | "projeto";
  categoryLabel?: string;
  priceBadge?: string;
  galleryId?: number;
  modalidade?: string;
  featured?: boolean;
}

export interface GalleryItem {
  id: number;
  title: string;
  date: string;
  location: string;
  cover: string;
  description: string;
  images: string[];
}

export interface TransparencyDoc {
  id: string;
  name: string;
  desc: string;
  link: string;
  tag: string;
  backupLink?: string;
  isCustom?: boolean;
}
