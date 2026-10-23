import {movieDbFetcher} from '../config/adapters/movieDbFetcher';
import * as UseCases from '../core/use-cases';
import {MovieDbRepository} from '../infrastructure/repositories/movie-db.repository';

const movieRepository = new MovieDbRepository(movieDbFetcher);

export const Movies = {
  nowPlaying: () => UseCases.moviesNowPlayingUseCase(movieRepository),
  upcoming: () => UseCases.moviesUpcomingUseCase(movieRepository),
  topRated: () => UseCases.moviesTopRatedUseCase(movieRepository),
  popular: (page?: number) =>
    UseCases.moviesPopularUseCase(movieRepository, page),
  byId: (movieId: number) =>
    UseCases.getMovieByIdUseCase(movieRepository, movieId),
  cast: (movieId: number) =>
    UseCases.getMovieCastUseCase(movieRepository, movieId),
  search: (query: string) =>
    UseCases.searchMoviesUseCase(movieRepository, query),
};
