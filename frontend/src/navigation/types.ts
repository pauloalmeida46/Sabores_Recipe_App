import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Tabs: undefined;
  RecipeDetail: { recipeId: string };
  GuidedCooking: { recipeId: string };
  ShoppingList: undefined;
  NewRecipeChoose: undefined;
  NewRecipeForm: { photoUri?: string } | undefined;
  RateRecipe: { recipeId: string };
};

export type TabParamList = {
  Home: undefined;
  Pantry: undefined;
  Search: undefined;
  Plan: undefined;
  Profile: undefined;
};

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
