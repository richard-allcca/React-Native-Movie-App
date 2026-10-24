import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ErrorState} from '../../components/feedback/ErrorState';
import {FullScreenLoader} from '../../components/loaders/FullScreenLoader';
import {MovieDetails} from '../../components/movie/MovieDetails';
import {MovieHeader} from '../../components/movie/MovieHeader';
import {useMovie} from '../../hooks/useMovie';
import {RootStackParams} from '../../navigation/Navigation';

interface Props extends StackScreenProps<RootStackParams, 'Details'> {}

export const DetailsScreen = ({route, navigation}: Props) => {
  const {movieId} = route.params;
  const {top} = useSafeAreaInsets();
  const {isLoading, error, movie, cast, retry} = useMovie(movieId);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (error || !movie || !cast) {
    return (
      <ErrorState
        message={error ?? 'No se pudo cargar la película'}
        onRetry={retry}
        onBack={() => navigation.goBack()}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView>
        <MovieHeader movie={movie} />
        <MovieDetails movie={movie} cast={cast} />
      </ScrollView>
      <Pressable
        onPress={() => navigation.goBack()}
        style={[styles.backButton, {top: top + 8}]}>
        <Text style={styles.backButtonText}>Regresar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backButton: {
    backgroundColor: 'rgba(17, 25, 40, 0.52)',
    borderRadius: 10,
    elevation: 9,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'absolute',
    zIndex: 999,
  },
  backButtonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});
