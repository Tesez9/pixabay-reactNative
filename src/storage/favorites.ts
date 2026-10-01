import AsyncStorage from '@react-native-async-storage/async-storage';
import { PixabayImage } from '../api/pixabay';

const KEY = '@pixabay_favorites';

export async function loadFavorites(): Promise<PixabayImage[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveFavorites(items: PixabayImage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(items));
  } catch {
  }
}
