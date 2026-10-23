import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {IMovie} from '../../../core/entities/movie.entity';
import {MoviePoster} from '../MoviePoster';

interface Props {
  movies: IMovie[];
  title?: string;
  loadMore?: () => void;
}

export const HorizontalCarousel = ({movies, title, loadMore}: Props) => {
  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      {movies.length === 0 ? (
        <Text style={styles.empty}>No hay películas</Text>
      ) : (
        <FlatList
          data={movies}
          renderItem={({item}) => (
            <MoviePoster movie={item} width={140} height={200} />
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          onEndReached={() => {
            if (loadMore && movies.length > 0) {
              loadMore();
            }
          }}
          onEndReachedThreshold={0.6}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 260,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '300',
    marginLeft: 10,
    marginBottom: 10,
  },
  empty: {
    marginLeft: 10,
    opacity: 0.7,
  },
});
