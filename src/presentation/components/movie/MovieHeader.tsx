import React from 'react';
import { StyleSheet, useWindowDimensions, Image, View, Text, Pressable } from 'react-native';
import { IFullMovie } from '../../../core/entities/movie.entity';
import { useNavigation } from '@react-navigation/native';

interface Props {
  movie: IFullMovie;
}

export const MovieHeader = ({ movie }: Props) => {
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const navigation = useNavigation();

  return (
    <>
      <View style={{ ...Styles.imageContainer, height: screenHeight * 0.7 }} >
        <View style={Styles.imageBorder} >
          <Image source={{ uri: movie.poster }} style={Styles.posterImage} />
        </View>
      </View>


        <View style={Styles.marginContainer} >
          <Text style={Styles.subTitle} >{movie.title}</Text>
          <Text style={Styles.title} >{movie.title}</Text>
        </View>

        <View style={Styles.backButton} >
          <Pressable onPress={() => navigation.goBack()} >
            <Text style={Styles.backButtonText}>Regresar</Text>
          </Pressable>
        </View>
    </>
  )
}

const Styles = StyleSheet.create({
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
  backButton: {
    backgroundColor: 'rgba(17, 25, 40, 0.52)',
    borderRadius: 10,
    elevation: 9,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'absolute',
    top: 35,
    zIndex: 999,
    cursor: 'pointer',
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
