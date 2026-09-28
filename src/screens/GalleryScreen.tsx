import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PixabayImage, fetchImages } from '../api/pixabay';
import ImageCard from '../components/ImageCard';
import SearchBar from '../components/SearchBar';

const CATEGORIES = ['Nature', 'Cars', 'Animals', 'People'];

export default function GalleryScreen({ onOpenImage }: { onOpenImage: (image: PixabayImage) => void }) {
  const { width } = useWindowDimensions();
  const [items, setItems] = useState<PixabayImage[]>([]);
  const [query, setQuery] = useState('nature');
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gap = 10;
  const padding = 16;
  const numColumns = 3;
  const size = (Math.min(width, 800) - padding * 2 - gap * (numColumns - 1)) / numColumns;

  const loadData = async (pageNumber: number, fresh: boolean, q: string) => {
    if (fresh) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    try {
      const data = await fetchImages(q, pageNumber);
      setTotal(data.totalHits);
      if (fresh) {
        setItems(data.hits);
      } else {
        setItems((prev) => [...prev, ...data.hits]);
      }
    } catch {
      setError('Помилка завантаження. Перевірте інтернет і спробуйте ще раз.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const runSearch = (q: string) => {
    setQuery(q);
    setPage(1);
    setItems([]);
    void loadData(1, true, q);
  };

  const submit = (text: string) => {
    const q = text.trim() === '' ? 'nature' : text;
    setCategory(null);
    runSearch(q);
  };

  const selectCategory = (c: string) => {
    setCategory(c);
    runSearch(c.toLowerCase());
  };

  const handleLoadMore = () => {
    if (loading || loadingMore || items.length === 0 || items.length >= total) {
      return;
    }
    const next = page + 1;
    setPage(next);
    void loadData(next, false, query);
  };

  useEffect(() => {
    fetchImages('nature', 1).then(
      (data) => {
        setTotal(data.totalHits);
        setItems(data.hits);
        setLoading(false);
      },
      () => {
        setError('Помилка завантаження. Перевірте інтернет і спробуйте ще раз.');
        setLoading(false);
      }
    );
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.heading}>
        <Text style={styles.title}>Pixabay <Text style={styles.titleAccent}>Gallery</Text></Text>
        <Text style={styles.subtitle}>Шукайте фото з усього світу</Text>
      </View>
      <SearchBar onSearch={submit} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            onPress={() => selectCategory(c)}
            style={[styles.chip, category === c && styles.chipActive]}
          >
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading && <ActivityIndicator size="large" color="#2EC66D" style={styles.loader} />}

      {!loading && error !== null && (
        <View style={styles.center}>
          <View style={styles.stateIcon}>
            <Feather name="alert-circle" size={28} color="#9AA0AA" />
          </View>
          <Text style={styles.message}>{error}</Text>
          <Pressable onPress={() => runSearch(query)} style={styles.retry}>
            <Text style={styles.retryText}>Спробувати ще раз</Text>
          </Pressable>
        </View>
      )}

      {!loading && error === null && items.length === 0 && (
        <View style={styles.center}>
          <View style={styles.stateIcon}>
            <Feather name="image" size={28} color="#9AA0AA" />
          </View>
          <Text style={styles.message}>Нічого не знайдено</Text>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        numColumns={numColumns}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={[styles.list, { gap }]}
        renderItem={({ item }) => (
          <ImageCard item={item} size={size} onPress={() => onOpenImage(item)} />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#2EC66D" />
              <Text style={styles.footerText}>Завантаження...</Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  heading: {
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
  },
  titleAccent: {
    color: '#2EC66D',
  },
  subtitle: {
    fontSize: 14,
    color: '#8A8F98',
    marginTop: 4,
  },
  categories: {
    gap: 8,
    paddingVertical: 12,
  },
  chip: {
    backgroundColor: '#EFF1F4',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  chipActive: {
    backgroundColor: '#2EC66D',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  loader: {
    marginTop: 32,
  },
  center: {
    alignItems: 'center',
    marginTop: 40,
  },
  stateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF1F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#777777',
    textAlign: 'center',
  },
  retry: {
    backgroundColor: '#2EC66D',
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginTop: 14,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  list: {
    paddingTop: 4,
    paddingBottom: 16,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#8A8F98',
  },
});
