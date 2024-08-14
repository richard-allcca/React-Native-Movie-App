import React from 'react'
import { Text, View } from 'react-native';
import { IMovie } from '../../core/entities/movie.entity';
import { ScrollView } from 'react-native-gesture-handler';
import { MoviePoster } from './MoviePoster';

interface Props {
  movies: IMovie[];
  height?: number;
}

export const PosterCarousel = ({ height = 440, movies }: Props) => {
  return (
    <View style={{height: height}} >
      <ScrollView
        horizontal // type scroll
        showsHorizontalScrollIndicator={false} // show scroll
      >
        {
          movies.map(movie => (
            <View key={movie.id}>
              <Text>{movie.title}</Text>
              <MoviePoster path={movie.poster} />
            </View>
          ))
        }
      </ScrollView>
    </View>
  )
}
