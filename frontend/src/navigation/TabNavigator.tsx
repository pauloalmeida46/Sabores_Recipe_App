import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { TabParamList } from './types';
import { colors } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { PantryScreen } from '../screens/PantryScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { PlanScreen } from '../screens/PlanScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, keyof typeof Feather.glyphMap> = {
  Home: 'home',
  Pantry: 'archive',
  Search: 'search',
  Plan: 'calendar',
  Profile: 'user',
};

const LABELS: Record<keyof TabParamList, string> = {
  Home: 'Início',
  Pantry: 'Despensa',
  Search: 'Buscar',
  Plan: 'Planejar',
  Profile: 'Perfil',
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, size }) => (
          <Feather name={ICONS[route.name as keyof TabParamList]} size={size ?? 22} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: LABELS.Home }} />
      <Tab.Screen name="Pantry" component={PantryScreen} options={{ title: LABELS.Pantry }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: LABELS.Search }} />
      <Tab.Screen name="Plan" component={PlanScreen} options={{ title: LABELS.Plan }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: LABELS.Profile }} />
    </Tab.Navigator>
  );
}
