export interface MangaItem {
  id: string;
  title: string;
  coverUrl: string;
  pages: string[]; // Blob URLs
}

export type ViewMode = 'library' | 'reader';

export interface LibraryItem {
  id: string;
  title: string;
  coverUrl: string;
  isDemo?: boolean;
}