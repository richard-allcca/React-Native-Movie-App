import { useEffect, useState } from "react";
import type { IMovie } from "../../core/entities/movie.entity";

import { movieDbFetcher } from "../../config/adapters/movieDbFetcher";
import * as UseCases from './../../core/use-cases';

let popularPageNumber = 1;

export const useMovies = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [nowPlaying, setNowPlaying] = useState<IMovie[]>([]);
  const [upcoming, setUpcoming] = useState<IMovie[]>([]);
  const [topRated, setTopRated] = useState<IMovie[]>([]);
  const [popular, setPopular] = useState<IMovie[]>([]);

  useEffect(() => {
    initialLoad()
  }, [])

  const initialLoad = async () => {
    const promises = [
      UseCases.moviesNowPlayingUseCase(movieDbFetcher),
      UseCases.moviesUpComingUseCase(movieDbFetcher),
      UseCases.moviesTopRatedUseCase(movieDbFetcher),
      UseCases.moviesPopularPlayingUseCase(movieDbFetcher)
    ];

    const results = await Promise.allSettled(promises);

    const nowPlayingMovies = results[0].status === 'fulfilled' ? results[0].value : [];
    const upcomingMovies = results[1].status === 'fulfilled' ? results[1].value : [];
    const topRatedMovies = results[2].status === 'fulfilled' ? results[2].value : [];
    const popularMovies = results[3].status === 'fulfilled' ? results[3].value : [];

    setNowPlaying(nowPlayingMovies);
    setUpcoming(upcomingMovies);
    setTopRated(topRatedMovies);
    setPopular(popularMovies);

    setIsLoading(false);
  }

  const loadMorePopularMovies = async () => {
    popularPageNumber++;
    const movies = await UseCases.moviesPopularPlayingUseCase(movieDbFetcher, { page: popularPageNumber });
    setNowPlaying(prev => [...prev, ...movies]);
  }

  return {
    isLoading,
    nowPlaying,
    upcoming,
    topRated,
    popular,

    loadMorePopularMovies
  }
}
