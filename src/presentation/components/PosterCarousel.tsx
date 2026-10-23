import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {IMovie} from '../../core/entities/movie.entity';
import {MoviePoster} from './MoviePoster';

interface Props {
  movies: IMovie[];
  height?: number;
}

export const PosterCarousel = ({height = 440, movies}: Props) => {
  return (
    <View style={{height}}>
      {movies.length === 0 ? (
        <Text style={styles.empty}>No hay películas</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movies.map(movie => (
            <View key={movie.id}>
              <MoviePoster movie={movie} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    marginLeft: 10,
    opacity: 0.7,
  },
});
