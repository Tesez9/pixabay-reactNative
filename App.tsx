import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { PixabayImage } from './src/api/pixabay';
import GalleryScreen from './src/screens/GalleryScreen';
import ImageDetailsScreen from './src/screens/ImageDetailsScreen';

export default function App() {
  const [selected, setSelected] = useState<PixabayImage | null>(null);

  return (
    <SafeAreaProvider>
      <View style={styles.screen}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
          <StatusBar style="dark" />
          {selected ? (
            <ImageDetailsScreen image={selected} onBack={() => setSelected(null)} />
          ) : (
            <GalleryScreen onOpenImage={setSelected} />
          )}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  safe: {
    flex: 1,
  },
});
