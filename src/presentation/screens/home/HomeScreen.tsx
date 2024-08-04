import React from 'react';
import { Text } from 'react-native';
import { useMovies } from '../../hooks/useMovies';

export const HomeScreen = () => {
  const { nowPlaying } = useMovies();
  // console.log(nowPlaying[0]);

  return <Text>HomeScreen</Text>;
};
