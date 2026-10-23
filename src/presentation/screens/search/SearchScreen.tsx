import {StackScreenProps} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MoviePoster} from '../../components/MoviePoster';
import {ErrorState} from '../../components/feedback/ErrorState';
import {useSearch} from '../../hooks/useSearch';
import {RootStackParams} from '../../navigation/Navigation';

interface Props extends StackScreenProps<RootStackParams, 'Search'> {}

export const SearchScreen = ({navigation}: Props) => {
  const {top} = useSafeAreaInsets();
  const [term, setTerm] = useState('');
  const {movies, isLoading, error, tooShort, retry} = useSearch(term);

  return (
    <View style={[styles.screen, {paddingTop: top + 12}]}>
      <View style={styles.bar}>
        <Text onPress={() => navigation.goBack()} style={styles.back}>
          Regresar
        </Text>
        <TextInput
          value={term}
          onChangeText={setTerm}
          placeholder="Buscar películas"
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
      </View>

      {tooShort ? (
        <Text style={styles.hint}>Escribe al menos 2 caracteres</Text>
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          ListEmptyComponent={<Text style={styles.hint}>Sin resultados</Text>}
          renderItem={({item}) => (
            <MoviePoster movie={item} width={160} height={240} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  back: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  hint: {
    marginHorizontal: 16,
    opacity: 0.7,
  },
  loader: {
    marginTop: 24,
  },
});
