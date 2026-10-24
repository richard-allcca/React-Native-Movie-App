import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, RefreshControl, ScrollView, StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ErrorState} from '../../components/feedback/ErrorState';
import {FullScreenLoader} from '../../components/loaders/FullScreenLoader';
import {PosterCarousel} from '../../components/PosterCarousel';
import {HorizontalCarousel} from '../../components/movies/HorizontalCarousel';
import {useMovies} from '../../hooks/useMovies';
import {RootStackParams} from '../../navigation/Navigation';

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {
    nowPlaying,
    upcoming,
    topRated,
    popular,
    isLoading,
    isRefreshing,
    error,
    partialError,
    loadMorePopularMovies,
    refresh,
    retry,
  } = useMovies();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }>
        <Pressable
          onPress={() => navigation.navigate('Search')}
          style={styles.search}>
          <Text style={styles.searchText}>Buscar películas</Text>
        </Pressable>

        {partialError ? (
          <Pressable onPress={retry} style={styles.partialError}>
            <Text>{partialError}</Text>
          </Pressable>
        ) : null}

        <PosterCarousel movies={nowPlaying} />
        <HorizontalCarousel
          movies={popular}
          title="Populares"
          loadMore={loadMorePopularMovies}
        />
        <HorizontalCarousel movies={upcoming} title="Próximos estrenos" />
        <HorizontalCarousel movies={topRated} title="Mejor valoradas" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  search: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#000',
  },
  searchText: {
    color: '#666',
  },
  partialError: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
});
