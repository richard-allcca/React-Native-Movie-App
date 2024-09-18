import { useEffect, useState } from "react";
import { movieDbFetcher } from "../../config/adapters/movieDbFetcher";
import { ICast } from "../../core/entities/cast.entity";
import { IFullMovie } from "../../core/entities/movie.entity";
import * as UseCases from "../../core/use-cases";



export const useMovie = (movieId: number) => {

  const [isLoading, setIsLoading] = useState(true)
  const [movie, setMovie] = useState<IFullMovie>()
  const [cast, setCast] = useState<ICast[]>()

  useEffect(() => {
    loadMovie();
  }, [movieId])


  const loadMovie = async () => {
    setIsLoading(true)

    const moviePromise = await UseCases.getMovieByIdUseCAse(movieDbFetcher, movieId)
    const castPromise = await UseCases.getMovieCastUseCase(movieDbFetcher, movieId)

    const [movie, cast] = await Promise.all([moviePromise, castPromise])

    setMovie(movie)
    setCast(cast)

    setIsLoading(false)
  }

  return {
    isLoading,
    movie,
    cast
  }
}
