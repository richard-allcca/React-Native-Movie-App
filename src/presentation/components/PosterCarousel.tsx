import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {IMovie} from '../../core/entities/movie.entity';
import {MoviePoster} from './MoviePoster';

interface Props {
  movies: IMovie[];
  height?: number;
}

export const PosterCarousel = ({height = 440, movies}: Props) => {

  const renderIsEmpty = () => {
    if (movies.length !== 0) return null;
    return <Text style={styles.empty}>No hay películas</Text>;
  };

  const renderMovies = () => {
    if (movies.length === 0) return null;
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {movies.map(movie => (
          <View key={movie.id}>
            <MoviePoster movie={movie} />
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={{height}}>
      {renderIsEmpty()}
      {renderMovies()}
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    marginLeft: 10,
    opacity: 0.7,
  },
});
