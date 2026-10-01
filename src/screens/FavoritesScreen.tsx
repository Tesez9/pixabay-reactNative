import { FlatList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootParamList } from '../navigation/AppNavigation';
import { useFavorites } from '../context/FavoritesContext';
import ImageCard from '../components/ImageCard';

export default function FavoritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const { width } = useWindowDimensions();
  const { favorites, remove } = useFavorites();

  const gap = 10;
  const padding = 16;
  const numColumns = 3;
  const size = (Math.min(width, 800) - padding * 2 - gap * (numColumns - 1)) / numColumns;

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.screen}>
        <Text style={styles.title}>Обране</Text>

        {favorites.length === 0 ? (
          <View style={styles.center}>
            <View style={styles.stateIcon}>
              <Feather name="heart" size={28} color="#9AA0AA" />
            </View>
            <Text style={styles.message}>Обране порожнє</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => String(item.id)}
            numColumns={numColumns}
            columnWrapperStyle={{ gap }}
            contentContainerStyle={[styles.list, { gap }]}
            renderItem={({ item }) => (
              <View style={{ width: size }}>
                <ImageCard
                  item={item}
                  size={size}
                  showFav={false}
                  onPress={() => navigation.navigate('ImageDetails', { image: item })}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => remove(item.id)}
                  style={styles.remove}
                >
                  <Feather name="x" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    marginTop: 8,
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
  list: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  remove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
