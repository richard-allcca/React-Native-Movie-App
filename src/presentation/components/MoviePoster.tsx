import React from 'react'
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  path: string;
}

export const MoviePoster = ({ path = '' }: Props) => {
  return (
    <View style={{...Styles.imageContainer, width: 300, height: 400}} >
      <Image
        style={Styles.image}
        source={{ uri: path }}
      />
    </View>
  )
}

const Styles = StyleSheet.create({
  image: {
    flex: 1,
    borderRadius: 18,
  },

  imageContainer: {
    flex: 1,
    borderRadius: 18,
    // backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.24,
    shadowRadius: 7,
    elevation: 9,
  }
})
