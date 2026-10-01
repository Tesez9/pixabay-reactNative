import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PixabayImage, fetchImages } from '../api/pixabay';
import type { RootParamList } from '../navigation/AppNavigation';
import ImageCard from '../components/ImageCard';
import SearchBar from '../components/SearchBar';

const CATEGORIES = ['Nature', 'Cars', 'Animals', 'People'];
const PER_PAGE = 20;
const MAX_PAGES = 25;

export default function GalleryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<PixabayImage>>(null);
  const [items, setItems] = useState<PixabayImage[]>([]);
  const [query, setQuery] = useState('nature');
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gap = 10;
  const padding = 16;
  const numColumns = 3;
  const size = (Math.min(width, 800) - padding * 2 - gap * (numColumns - 1)) / numColumns;

  const totalPages = Math.max(1, Math.min(MAX_PAGES, Math.ceil(total / PER_PAGE)));

  const loadData = async (pageNumber: number, q: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchImages(q, pageNumber);
      setTotal(data.totalHits);
      setItems(data.hits);
    } catch {
      setError('Помилка завантаження. Перевірте інтернет і спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  const runSearch = (q: string) => {
    setQuery(q);
    setPage(1);
    setItems([]);
    void loadData(1, q);
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

  const goToPage = (next: number) => {
    if (next < 1 || next > totalPages || next === page || loading) {
      return;
    }
    setPage(next);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    void loadData(next, query);
  };

  const pageWindow = () => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const pages: number[] = [];
    for (let i = start; i <= Math.min(start + 4, totalPages); i++) {
      pages.push(i);
    }
    return pages;
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
    <SafeAreaView edges={['top']} style={styles.safe}>
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
          ref={listRef}
          data={items}
          keyExtractor={(item) => String(item.id)}
          numColumns={numColumns}
          columnWrapperStyle={{ gap }}
          contentContainerStyle={[styles.list, { gap }]}
          renderItem={({ item }) => (
            <ImageCard item={item} size={size} onPress={() => navigation.navigate('ImageDetails', { image: item })} />
          )}
          ListFooterComponent={
            !loading && error === null && totalPages > 1 ? (
              <View style={styles.pages}>
                <Pressable
                  onPress={() => goToPage(page - 1)}
                  style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
                >
                  <Feather name="chevron-left" size={18} color={page === 1 ? '#B5B5B5' : '#111111'} />
                </Pressable>
                {pageWindow().map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => goToPage(p)}
                    style={[styles.pageBtn, p === page && styles.pageBtnActive]}
                  >
                    <Text style={[styles.pageText, p === page && styles.pageTextActive]}>{p}</Text>
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => goToPage(page + 1)}
                  style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]}
                >
                  <Feather name="chevron-right" size={18} color={page === totalPages ? '#B5B5B5' : '#111111'} />
                </Pressable>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
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
  pages: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  pageBtn: {
    minWidth: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF1F4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  pageBtnActive: {
    backgroundColor: '#2EC66D',
  },
  pageBtnDisabled: {
    opacity: 0.5,
  },
  pageText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
  },
  pageTextActive: {
    color: '#FFFFFF',
  },
});
