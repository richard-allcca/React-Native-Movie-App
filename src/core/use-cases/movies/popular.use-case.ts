import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import type { IPopularResponse } from "../../../infrastructure/interfaces/movie-db.responses";
import { MovieMapper } from "../../../infrastructure/mappers/movie.mapper";
import type { IMovie } from "../../entities/movie.entity";


export const moviesPopularPlayingUseCase = async (fetcher: HttpAdapter): Promise<IMovie[]> => {

  try {
    const popular = await fetcher.get<IPopularResponse>('/popular')

    return popular.results.map(result => MovieMapper.fromMovieDbResultToEntity(result))

  } catch (error) {
    console.log(error)
    throw new Error('Error fetching movies')
  }

}