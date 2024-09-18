import React from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PosterCarousel } from '../../components/PosterCarousel';
import { HorizontalCarousel } from '../../components/movies/HorizontalCarousel';
import { useMovies } from '../../hooks/useMovies';
import { FullScreenLoader } from '../../components/loaders/FullScreenLoader';

export const HomeScreen = () => {
  // Necesario para dar espacio en el top del area segura
  const { top } = useSafeAreaInsets();

  const {
    nowPlaying, upcoming, topRated, popular, isLoading, loadMorePopularMovies
  } = useMovies();

  if(isLoading) return <FullScreenLoader/>

  return (
    <ScrollView>
      <View style={{ marginTop: top + 20 }} >
        <PosterCarousel movies={nowPlaying} />
        <HorizontalCarousel movies={popular} title="Popular" loadMore={loadMorePopularMovies } />
        <HorizontalCarousel movies={upcoming} title="Upcoming" />
        <HorizontalCarousel movies={topRated} title="Top Rated" />
      </View>
    </ScrollView>
  )
};
