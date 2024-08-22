import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { IMovie } from '../../core/entities/movie.entity';
import { RootStackParams } from '../navigation/Navigation';

interface Props {
  movie: IMovie;
  height?: number;
  width?: number;
}

// NOTE - This componente was refactored for me.

export const MoviePoster = ({ movie, height = 420, width = 300 }: Props) => {

  // 'Type' strict for remember the routes available
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  return (
    <Pressable
      onPress={() => navigation.navigate('Details', { movieId: movie.id })}
      // style={{ ...Styles.imageContainer, width, height }}
      style={ ({ pressed }) => ({
        ...Styles.imageContainer,
        width,
        height,
        marginHorizontal: 8,
        paddingBottom: 8,
        paddingHorizontal: 5,
        opacity: pressed ? 0.9 : 1,
      })
    }
    >
      <View
        style={Styles.image}
      >
        <Image
          style={Styles.image}
          source={{ uri: movie?.poster }}
        />
      </View>
    </Pressable>

  );
};

const Styles = StyleSheet.create({
  image: {
    flex: 1,
    borderRadius: 18,
  },

  imageContainer: {
    flex: 1,
    borderRadius: 18,
    shadowColor: "rgba(0, 0, 0, 0.82)",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    // shadowOpacity: 0.24,
    // shadowRadius: 7,
    elevation: 4,
  }
});
