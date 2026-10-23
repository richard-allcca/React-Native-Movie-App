import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {DetailsScreen} from '../screens/details/DetailsScreen';
import {HomeScreen} from '../screens/home/HomeScreen';
import {SearchScreen} from '../screens/search/SearchScreen';

export type RootStackParams = {
  Home: undefined;
  Details: {movieId: number};
  Search: undefined;
};

const Stack = createStackNavigator<RootStackParams>();

export const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};
