import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FavoritesProvider } from './src/context/FavoritesContext';
import AppNavigation from './src/navigation/AppNavigation';

export default function App() {
  return (
    <View style={styles.screen}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <FavoritesProvider>
          <AppNavigation />
        </FavoritesProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
});
