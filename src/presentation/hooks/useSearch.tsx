import {useEffect, useState} from 'react';
import {Movies} from '../../composition/movies';
import type {IMovie} from '../../core/entities/movie.entity';

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

export const useSearch = (term: string) => {
  const [debounced, setDebounced] = useState('');
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestIndex, setRequestIndex] = useState(0);

  const query = term.trim();
  const tooShort = query.length < MIN_QUERY_LENGTH;
  const isDebouncing = !tooShort && query !== debounced;

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (debounced.length < MIN_QUERY_LENGTH) {
      setMovies([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Movies.search(debounced)
      .then(results => {
        if (!cancelled) {
          setMovies(results);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setMovies([]);
          setError(err instanceof Error ? err.message : 'No se pudo buscar');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, requestIndex]);

  return {
    movies,
    isLoading: isLoading || isDebouncing,
    error,
    tooShort,
    retry: () => setRequestIndex(index => index + 1),
  };
};
