import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PixabayImage } from '../api/pixabay';

export default function ImageDetailsScreen({ image, onBack }: { image: PixabayImage; onBack: () => void }) {
  const stats = [
    { icon: 'eye', label: 'Перегляди', value: String(image.views) },
    { icon: 'heart', label: 'Лайки', value: String(image.likes) },
    { icon: 'user', label: 'Автор', value: image.user },
    { icon: 'tag', label: 'Теги', value: image.tags },
  ] as const;

  return (
    <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
      <Pressable onPress={onBack} style={styles.back}>
        <Feather name="chevron-left" size={20} color="#111111" />
        <Text style={styles.backText}>Назад</Text>
      </Pressable>

      <Image source={{ uri: image.largeImageURL }} style={styles.image} resizeMode="contain" />

      <View style={styles.stats}>
        {stats.map((row) => (
          <View key={row.label} style={styles.statRow}>
            <View style={styles.statIcon}>
              <Feather name={row.icon} size={18} color="#2EC66D" />
            </View>
            <View style={styles.statText}>
              <Text style={styles.statLabel}>{row.label}</Text>
              <Text style={styles.statValue} numberOfLines={3}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 32,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EFF1F4',
    borderRadius: 20,
    paddingVertical: 8,
    paddingRight: 16,
    paddingLeft: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    backgroundColor: '#EFF1F4',
    marginTop: 12,
  },
  stats: {
    marginTop: 16,
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E7F7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#8A8F98',
  },
  statValue: {
    fontSize: 16,
    color: '#111111',
    fontWeight: '600',
    marginTop: 2,
  },
});
