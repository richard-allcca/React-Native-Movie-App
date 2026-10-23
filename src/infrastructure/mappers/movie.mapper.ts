import type {IFullMovie, IMovie} from '../../core/entities/movie.entity';
import {IMovieDbByIdResponse} from '../interfaces/movie-db-by-id-response';

interface MovieDbSummary {
  id: number;
  title: string;
  overview: string | null;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
}

export class MovieMapper {
  static fromMovieDbResultToEntity(result: MovieDbSummary): IMovie {
    return {
      id: result.id,
      title: result.title,
      description: result.overview ?? '',
      releaseDate: new Date(result.release_date),
      rating: result.vote_average,
      posterPath: result.poster_path,
      backdropPath: result.backdrop_path,
    };
  }

  static fromMovieDBToEntity(movie: IMovieDbByIdResponse): IFullMovie {
    return {
      ...this.fromMovieDbResultToEntity(movie),
      genres: movie.genres?.map(genre => genre.name) ?? [],
      duration: movie.runtime ?? 0,
      budget: movie.budget ?? 0,
      originalTitle: movie.original_title,
      productionCompanies:
        movie.production_companies?.map(company => company.name) ?? [],
    };
  }
}
