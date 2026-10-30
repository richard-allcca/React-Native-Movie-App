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
import {SafeAreaView} from 'react-native-safe-area-context';
import {MoviePoster} from '../../components/MoviePoster';
import {ErrorState} from '../../components/feedback/ErrorState';
import {useSearch} from '../../hooks/useSearch';
import {RootStackParams} from '../../navigation/Navigation';

interface Props extends StackScreenProps<RootStackParams, 'Search'> {}

export const SearchScreen = ({navigation}: Props) => {
  const [term, setTerm] = useState('');
  const {movies, isLoading, error, tooShort, retry} = useSearch(term);

  const renderTooShort = () => {
    if (!tooShort) return null;
    return <Text style={styles.hint}>Escribe al menos 2 caracteres</Text>;
  }

  const renderIsLoading = () => {
    if (!isLoading) return null;
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  const renderEmpty = () => {
    if (movies.length > 0) return null;
    return <Text style={styles.hint}>Sin resultados</Text>;
  }

  const renderError = () => {
    if (!error) return null;
    return <ErrorState message={error} onRetry={retry} />;
  }

  const renderContent = () => {
    if (tooShort) return renderTooShort();
    if (error) return renderError();
    if (isLoading) return renderIsLoading();
    if (movies.length === 0) return renderEmpty();
    return (
      <FlatList
        data={movies}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={({item}) => (
          <MoviePoster movie={item} width={160} height={240} />
        )}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']} >
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

      {renderContent()}
    </SafeAreaView>
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
