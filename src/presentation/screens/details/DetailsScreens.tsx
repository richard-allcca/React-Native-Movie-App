import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MovieDetails } from '../../components/movie/MovieDetails';
import { MovieHeader } from '../../components/movie/MovieHeader';
import { useMovie } from '../../hooks/useMovie';
import { RootStackParams } from '../../navigation/Navigation';
import { FullScreenLoader } from '../../components/loaders/FullScreenLoader';

// NOTE - Example 1: for get params

// export const DetailsScreens = () => {
// const { movieId } = useRoute().params as { movieId: number };
// console.log("🚀 ~ DetailsScreens ~ movieId:", movieId)

// return (
//   <Text>DetailsScreens</Text>
// )
// }

interface Props extends StackScreenProps<RootStackParams, 'Details'>{}

// NOTE - Example 2: for get params

export const DetailsScreens = ({ route }: Props) => {

  const { movieId } = route.params;

  const { isLoading ,movie, cast } = useMovie(movieId);

  if(isLoading) return <FullScreenLoader/>;

  return (
    <ScrollView>
      <MovieHeader movie={movie!} />

      <MovieDetails  movie={movie!} cast={cast!} />
    </ScrollView>
  )
}
