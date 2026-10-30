import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {movieImageUri} from '../../config/helpers/movie-image';
import {IMovie} from '../../core/entities/movie.entity';
import {RootStackParams} from '../navigation/Navigation';

interface Props {
  movie: IMovie;
  height?: number;
  width?: number;
}

export const MoviePoster = ({movie, height = 420, width = 300}: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const uri = movieImageUri(movie.posterPath, 'w300');

  const renderImage = () => {
    if (uri) {
      return <Image style={styles.image} source={{uri}} />;
    }
    return <View style={[styles.image, styles.placeholder]} />;
  };

  return (
    <Pressable
      onPress={() => navigation.navigate('Details', {movieId: movie.id})}
      style={({pressed}) => ({
        ...styles.imageContainer,
        width,
        height,
        marginHorizontal: 8,
        paddingBottom: 8,
        paddingHorizontal: 5,
        opacity: pressed ? 0.9 : 1,
      })}>
      <View style={styles.image}>
        {renderImage()}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    borderRadius: 18,
  },
  placeholder: {
    backgroundColor: '#d9d9d9',
  },
  imageContainer: {
    flex: 1,
    borderRadius: 18,
    shadowColor: 'rgba(0, 0, 0, 0.82)',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 4,
  },
});
