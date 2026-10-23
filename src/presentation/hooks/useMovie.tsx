import {useCallback, useEffect, useState} from 'react';
import {Movies} from '../../composition/movies';
import {ICast} from '../../core/entities/cast.entity';
import {IFullMovie} from '../../core/entities/movie.entity';

export const useMovie = (movieId: number) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<IFullMovie>();
  const [cast, setCast] = useState<ICast[]>();

  const loadMovie = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [movieData, castData] = await Promise.all([
        Movies.byId(movieId),
        Movies.cast(movieId),
      ]);
      setMovie(movieData);
      setCast(castData);
    } catch (err) {
      setMovie(undefined);
      setCast(undefined);
      setError(
        err instanceof Error ? err.message : 'No se pudo cargar la película',
      );
    } finally {
      setIsLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    loadMovie();
  }, [loadMovie]);

  return {
    isLoading,
    error,
    movie,
    cast,
    retry: loadMovie,
  };
};
