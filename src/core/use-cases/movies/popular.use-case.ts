import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import type { IPopularResponse } from "../../../infrastructure/interfaces/movie-db.responses";
import { MovieMapper } from "../../../infrastructure/mappers/movie.mapper";
import type { IMovie } from "../../entities/movie.entity";

interface Options {
  page?: number
}

export const moviesPopularPlayingUseCase = async (fetcher: HttpAdapter, options?: Options): Promise<IMovie[]> => {

  const { page = 1 } = options || {};

  try {
    const popular = await fetcher.get<IPopularResponse>('/popular', {
      params: { page }
    })

    return popular.results.map(result => MovieMapper.fromMovieDbResultToEntity(result))

  } catch (error) {
    console.log(error)
    throw new Error('Error fetching movies')
  }

}