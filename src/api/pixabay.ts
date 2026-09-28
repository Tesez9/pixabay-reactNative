import { PIXABAY_API_KEY } from '../config';

export interface PixabayImage {
  id: number;
  tags: string;
  previewURL: string;
  largeImageURL: string;
  views: number;
  likes: number;
  user: string;
}

export interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

export async function fetchImages(query: string, page = 1): Promise<PixabayResponse> {
  const url =
    `https://pixabay.com/api/?key=${PIXABAY_API_KEY}` +
    `&q=${encodeURIComponent(query)}&image_type=photo&per_page=20&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = (await res.json()) as PixabayResponse;
  return { total: data.total, totalHits: data.totalHits, hits: data.hits ?? [] };
}
