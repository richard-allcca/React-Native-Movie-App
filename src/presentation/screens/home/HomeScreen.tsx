import React from 'react';
import { Text } from 'react-native';
import { useMovies } from '../../hooks/useMovies';

export const HomeScreen = () => {
  const { nowPlaying, upcoming, topRated, popular, isLoading } = useMovies();
  console.log(nowPlaying[0], upcoming[0], topRated[0], popular[0], isLoading );

  return <Text>HomeScreen</Text>;
};
