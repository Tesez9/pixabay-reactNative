import React, { createContext, useContext, useEffect, useState } from 'react';
import { PixabayImage } from '../api/pixabay';
import { loadFavorites, saveFavorites } from '../storage/favorites';

interface FavoritesValue {
  favorites: PixabayImage[];
  toggle: (image: PixabayImage) => void;
  remove: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<PixabayImage[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadFavorites().then((items) => {
      setFavorites(items);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) {
      void saveFavorites(favorites);
    }
  }, [favorites, ready]);

  const toggle = (image: PixabayImage) => {
    setFavorites((prev) =>
      prev.some((p) => p.id === image.id) ? prev.filter((p) => p.id !== image.id) : [...prev, image]
    );
  };

  const remove = (id: number) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const isFavorite = (id: number) => favorites.some((p) => p.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, remove, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return ctx;
}
