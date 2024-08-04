import type{ IMovie } from "../../core/entities/movie.entity";
import type { IResult } from "../interfaces/movie-db.responses";


export class MovieMapper {

  static fromMovieDbResultToEntity(result: IResult): IMovie {

    return {
      id: result.id,
      title: result.title,
      description: result.overview,
      releaseDate: new Date(result.release_date),
      rating: result.vote_average,
      poster: `https://image.tmdb.ord/t/p/w500${result.poster_path}`,
      backdrop: `https://image.tmdb.ord/t/p/w500${result.backdrop_path}`,
    }
  }

}