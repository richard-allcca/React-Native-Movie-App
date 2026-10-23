import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  message?: string | null;
  onRetry?: () => void;
  onBack?: () => void;
}

export const ErrorState = ({message, onRetry, onBack}: Props) => {
  const {top} = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: top + 24}]}>
      {onBack ? (
        <Pressable onPress={onBack} style={[styles.backButton, {top: top + 8}]}>
          <Text style={styles.backText}>Regresar</Text>
        </Pressable>
      ) : null}
      <Text style={styles.message}>
        {message || 'No se pudo cargar la información'}
      </Text>
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#111928',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  backText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
