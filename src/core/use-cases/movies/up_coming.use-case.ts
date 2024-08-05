import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import type { IUpComingResponse } from "../../../infrastructure/interfaces/movie-db.responses";
import { MovieMapper } from "../../../infrastructure/mappers/movie.mapper";
import type { IMovie } from "../../entities/movie.entity";


export const moviesUpComingUseCase = async (fetcher: HttpAdapter): Promise<IMovie[]> => {

  try {
    const upcoming = await fetcher.get<IUpComingResponse>('/upcoming')

    return upcoming.results.map(result => MovieMapper.fromMovieDbResultToEntity(result))

  } catch (error) {
    console.log(error)
    throw new Error('Error fetching movies')
  }
}