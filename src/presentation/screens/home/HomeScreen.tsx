import React from 'react';
import { Text, View } from 'react-native';
import { useMovies } from '../../hooks/useMovies';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { PosterCarousel } from '../../components/PosterCarousel';

export const HomeScreen = () => {
  // Necesario para dar espacio en el top del area segura
  const { top } = useSafeAreaInsets();

  const { nowPlaying, upcoming, topRated, popular, isLoading } = useMovies();

  if(isLoading) return (<Text>Loading...</Text>)

  return (
    <ScrollView>
      <View style={{ marginTop: top + 20 }} >
        <PosterCarousel movies={nowPlaying} />
      </View>
    </ScrollView>
  )
};
