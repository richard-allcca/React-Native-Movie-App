
import React, { useEffect, useId, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { IMovie } from '../../../core/entities/movie.entity';
import { MoviePoster } from '../MoviePoster';

interface Props {
  movies: IMovie[];
  title?: string;
  loadMore?: () => void;
}


export const HorizontalCarousel = ( { movies, title, loadMore }: Props ) => {

  const uuid = useId()

  const isLoading = useRef(false);

  useEffect(() => {

    setTimeout(() => {
      isLoading.current = false;
    }, 200);

  }, [movies])


  // FIXME - Comentado por falla con los id de los elementos
  // const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent> ) => {
  //   if (isLoading.current) return;

  //   // Size of scroll - layout measurement - total width content
  //   const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
  //   const endReached = contentOffset.x + layoutMeasurement.width >= contentSize.width;

  //   if (!endReached) return null;

  //   isLoading.current = true;

  //   // Cargar las siguientes películas
  //   loadMore && loadMore();
  // }

  const getTitle = () => {
    if (!title) return null;
    return (
      <Text
        style={{
          fontSize: 30,
          fontWeight: 300,
          marginLeft: 10,
          marginBottom: 10
        }}
      >
        {title}
      </Text>
    )
  }

  return (
    <View
      style={{ height: title ? 260 : 220 }}
    >
      { getTitle() }

      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MoviePoster movie={item} width={140} height={200} />
        )}
        // keyExtractor={(item, index) => `${item.title}-${index}-${item.id}`}
        keyExtractor={(item, index) => {
          // const key = `${uuid}-${item.id}`
          const key = `${item.title}-${index}-${item.id}`
          return key
        }

        }
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        // onScroll={(event) => onScroll(event) }
      />
    </View>
  )
}
