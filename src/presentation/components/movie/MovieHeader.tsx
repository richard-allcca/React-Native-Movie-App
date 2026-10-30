import React from 'react';
import {Image, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {movieImageUri} from '../../../config/helpers/movie-image';
import {IFullMovie} from '../../../core/entities/movie.entity';

interface Props {
  movie: IFullMovie;
}

export const MovieHeader = ({movie}: Props) => {
  const {height: screenHeight} = useWindowDimensions();
  const uri = movieImageUri(movie.posterPath, 'w780');
  const showOriginalTitle =
    movie.originalTitle.length > 0 && movie.originalTitle !== movie.title;

  const renderImage = () => {
    if (!uri) {
      return <View style={[styles.posterImage, styles.placeholder]} />;
    }
    return <Image source={{uri}} style={styles.posterImage} />;
  };

  const renderTitle = () => {
    if (!showOriginalTitle) {
      return <Text style={styles.title}>{movie.title}</Text>;
    }
    return (
      <>
        <Text style={styles.subTitle}>{movie.originalTitle}</Text>
        <Text style={styles.title}>{movie.title}</Text>
      </>
    );
  };

  return (
    <>
      <View style={{...styles.imageContainer, height: screenHeight * 0.7}}>
        <View style={styles.imageBorder}>
          {renderImage()}
        </View>
      </View>

      <View style={styles.marginContainer}>
        {renderTitle()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.24,
    shadowRadius: 7,
    elevation: 10,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  imageBorder: {
    flex: 1,
    overflow: 'hidden',
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  posterImage: {
    flex: 1,
  },
  placeholder: {
    backgroundColor: '#d9d9d9',
  },
  marginContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  subTitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
