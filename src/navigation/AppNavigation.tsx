import React from 'react';
import { Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PixabayImage } from '../api/pixabay';
import GalleryScreen from '../screens/GalleryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ImageDetailsScreen from '../screens/ImageDetailsScreen';

export type TabsParamList = {
  Gallery: undefined;
  Favorites: undefined;
};

export type RootParamList = {
  MainTabs: undefined;
  ImageDetails: { image: PixabayImage };
};

const Tabs = createBottomTabNavigator<TabsParamList>();
const Stack = createNativeStackNavigator<RootParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2EC66D',
        tabBarInactiveTintColor: '#8A8F98',
      }}
    >
      <Tabs.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          title: 'Галерея',
          tabBarIcon: ({ color, size }) => <Feather name="image" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Обране',
          tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} />,
        }}
      />
    </Tabs.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ImageDetails" component={ImageDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
