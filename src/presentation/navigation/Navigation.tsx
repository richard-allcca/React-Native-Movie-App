import { createStackNavigator } from '@react-navigation/stack';
import { DetailsScreens } from '../screens/details/DetailsScreens';
import { HomeScreen } from '../screens/home/HomeScreen';

export type RootStackParams = {
  Home: undefined;
  Details: { movieId: number };
};

const Stack = createStackNavigator<RootStackParams>();

export const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreens} />
    </Stack.Navigator>
  );
}