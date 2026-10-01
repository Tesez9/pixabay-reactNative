import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PixabayImage } from '../api/pixabay';
import { useFavorites } from '../context/FavoritesContext';

export default function ImageCard({ item, size, onPress, showFav = true }: { item: PixabayImage; size: number; onPress: () => void; showFav?: boolean }) {
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(item.id);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.card, { width: size, height: size }]}>
      <Image source={{ uri: item.previewURL }} style={styles.image} resizeMode="cover" />
      {showFav && (
        <TouchableOpacity activeOpacity={0.7} onPress={() => toggle(item)} style={styles.favOverlay}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? '#E5484D' : '#FFFFFF'} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E8EAEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
