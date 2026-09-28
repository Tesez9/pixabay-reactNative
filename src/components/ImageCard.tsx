import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { PixabayImage } from '../api/pixabay';

export default function ImageCard({ item, size, onPress }: { item: PixabayImage; size: number; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.card, { width: size, height: size }]}>
      <Image source={{ uri: item.previewURL }} style={styles.image} resizeMode="cover" />
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
});
