import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootParamList } from '../navigation/AppNavigation';
import { useFavorites } from '../context/FavoritesContext';

type Props = NativeStackScreenProps<RootParamList, 'ImageDetails'>;

export default function ImageDetailsScreen({ route, navigation }: Props) {
  const { image } = route.params;
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(image.id);

  const stats = [
    { icon: 'eye', label: 'Перегляди', value: String(image.views) },
    { icon: 'heart', label: 'Лайки', value: String(image.likes) },
    { icon: 'download', label: 'Завантаження', value: String(image.downloads) },
    { icon: 'tag', label: 'Теги', value: image.tags },
  ] as const;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.back}>
            <Feather name="chevron-left" size={20} color="#111111" />
            <Text style={styles.backText}>Назад</Text>
          </Pressable>
        </View>

        <Image source={{ uri: image.largeImageURL }} style={styles.image} resizeMode="contain" />

        <View style={styles.authorRow}>
          <View style={styles.authorText}>
            <Text style={styles.authorLabel}>Автор фотографії</Text>
            <Text style={styles.authorName}>{image.user}</Text>
          </View>
          <Pressable onPress={() => toggle(image)} style={[styles.favPill, fav && styles.favPillActive]}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? '#E5484D' : '#111111'} />
            <Text style={[styles.favPillText, fav && styles.favPillTextActive]}>
              {fav ? 'Збережено' : 'В обране'}
            </Text>
          </Pressable>
        </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  screen: {
    padding: 16,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 32,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  favPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF1F4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  favPillActive: {
    backgroundColor: '#FDECEF',
  },
  favPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  favPillTextActive: {
    color: '#E5484D',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  authorText: {
    flex: 1,
  },
  authorLabel: {
    fontSize: 12,
    color: '#8A8F98',
  },
  authorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    marginTop: 2,
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
