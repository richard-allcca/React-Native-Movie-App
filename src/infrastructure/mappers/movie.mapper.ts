import type{ IFullMovie, IMovie } from "../../core/entities/movie.entity";
import { IMovieDbByIdResponse } from "../interfaces/movie-db-by-id-response";
import type { IResult } from "../interfaces/movie-db-responses";


export class MovieMapper {

  static fromMovieDbResultToEntity(result: IResult): IMovie {

    return {
      id: result.id,
      title: result.title,
      description: result.overview,
      releaseDate: new Date(result.release_date),
      rating: result.vote_average,
      poster: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/w500${result.backdrop_path}`,
    }
  }

  static fromMovieDBToEntity(movie: IMovieDbByIdResponse): IFullMovie {
    return {
      ...this.fromMovieDbResultToEntity(movie),
      genres: movie.genres.map((g) => g.name),
      duration: movie.runtime,
      budget: movie.budget, // presupuesto
      originalTitle: movie.original_title,
      productionsCompany: movie.production_companies.map(pc => pc.name)
    }
  }
}