import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';
import { GuidedCookingScreen } from '../screens/GuidedCookingScreen';
import { ShoppingListScreen } from '../screens/ShoppingListScreen';
import { NewRecipeChooseScreen } from '../screens/NewRecipeChooseScreen';
import { NewRecipeFormScreen } from '../screens/NewRecipeFormScreen';
import { RateRecipeScreen } from '../screens/RateRecipeScreen';
import { Screen } from '../components';
import { colors } from '../theme';
import { useSession } from '../state/SessionContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Auth flow, following the standard React Navigation v7 pattern of
 * conditionally rendering a different set of `Stack.Screen`s based on
 * session state, inside a single `NavigationContainer` (already provided by
 * `App.tsx`) — see https://reactnavigation.org/docs/auth-flow.
 */
export function RootNavigator() {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <Screen>
        <View style={styles.splash}>
          <ActivityIndicator color={colors.ink} />
        </View>
      </Screen>
    );
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Tabs">
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="GuidedCooking"
        component={GuidedCookingScreen}
        options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
      <Stack.Screen
        name="NewRecipeChoose"
        component={NewRecipeChooseScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="NewRecipeForm" component={NewRecipeFormScreen} />
      <Stack.Screen
        name="RateRecipe"
        component={RateRecipeScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
