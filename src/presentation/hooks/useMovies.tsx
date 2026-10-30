import {useCallback, useEffect, useRef, useState} from 'react';
import {Movies} from '../../composition/movies';
import type {IMovie} from '../../core/entities/movie.entity';

const sectionNames = [
  'Cartelera',
  'Próximos estrenos',
  'Mejor valoradas',
  'Populares',
] as const;

const errorMessage = (reason: unknown, fallback: string) => {
  if (reason instanceof Error && reason.message) {
    return reason.message;
  }
  return fallback;
};

export const useMovies = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partialError, setPartialError] = useState<string | null>(null);
  const [nowPlaying, setNowPlaying] = useState<IMovie[]>([]);
  const [upcoming, setUpcoming] = useState<IMovie[]>([]);
  const [topRated, setTopRated] = useState<IMovie[]>([]);
  const [popular, setPopular] = useState<IMovie[]>([]);

  const popularPage = useRef(1);
  const loadingMore = useRef(false);
  const reachedEnd = useRef(false);
  const hasContent = useRef(false);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    const results = await Promise.allSettled([
      Movies.nowPlaying(),
      Movies.upcoming(),
      Movies.topRated(),
      Movies.popular(1),
    ]);

    if (currentRequest !== requestId.current) {
      return;
    }

    const failed = results.flatMap((result, index) =>
      result.status === 'rejected' ? [sectionNames[index]] : [],
    );

    // If all sections failed and we have no content yet, set the error state to indicate a full failure
    if (failed.length === results.length && hasContent.current) {
      setError(null);
      setPartialError('No se pudo actualizar. Toca para reintentar.');
      return;
    }

    setNowPlaying(results[0].status === 'fulfilled' ? results[0].value : []);
    setUpcoming(results[1].status === 'fulfilled' ? results[1].value : []);
    setTopRated(results[2].status === 'fulfilled' ? results[2].value : []);
    setPopular(results[3].status === 'fulfilled' ? results[3].value : []);

    // Reset popular movies pagination if the popular section was successfully fetched
    if (results[3].status === 'fulfilled') {
      popularPage.current = 1;
      reachedEnd.current = false;
    }

    // Mark that we have content if any section was successfully fetched
    if (results.some(result => result.status === 'fulfilled')) {
      hasContent.current = true;
    }

    // If some sections failed but not all, set the partial error message
    if (failed.length === results.length) {
      const reason = results.find(result => result.status === 'rejected');
      setError(
        errorMessage(
          reason?.status === 'rejected' ? reason.reason : undefined,
          'No se pudieron cargar las películas',
        ),
      );
      setPartialError(null);
      return;
    }

    setError(null);
    setPartialError(
      failed.length > 0
        ? `No se pudo cargar: ${failed.join(', ')}. Toca para reintentar.`
        : null,
    );
  }, []);

  useEffect(() => {
    let active = true;

    load().finally(() => {
      if (active) {
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [load]);

  const retry = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await load();
    setIsLoading(false);
  }, [load]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await load();
    setIsRefreshing(false);
  }, [load]);

  const loadMorePopularMovies = useCallback(async () => {
    if (loadingMore.current || reachedEnd.current) return;

    loadingMore.current = true;
    const currentRequest = requestId.current;
    const nextPage = popularPage.current + 1;

    try {
      const movies = await Movies.popular(nextPage);
      if (currentRequest !== requestId.current) return;
      if (movies.length === 0) {
        reachedEnd.current = true;
        return;
      }

      popularPage.current = nextPage;
      setPopular(prev => {
        const ids = new Set(prev.map(movie => movie.id));
        return [...prev, ...movies.filter(movie => !ids.has(movie.id))];
      });
    } catch {
      // La página no avanza si la petición falla.
    } finally {
      loadingMore.current = false;
    }
  }, []);

  return {
    isLoading,
    isRefreshing,
    error,
    partialError,
    nowPlaying,
    upcoming,
    topRated,
    popular,
    loadMorePopularMovies,
    refresh,
    retry,
  };
};
