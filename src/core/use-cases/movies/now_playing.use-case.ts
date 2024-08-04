import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import type { INowPlayingResponse } from "../../../infrastructure/interfaces/movie-db.responses";
import { MovieMapper } from "../../../infrastructure/mappers/movie.mapper";
import type { IMovie } from "../../entities/movie.entity";


export const moviesNowPlayingUseCase = async (fetcher: HttpAdapter ): Promise<IMovie[]> => {

  try {
    const nowPlaying = await fetcher.get<INowPlayingResponse>('/now_playing')

    return nowPlaying.results.map(result => MovieMapper.fromMovieDbResultToEntity(result))

  } catch (error) {
    console.log(error)
    throw new Error('Error fetching movies')
  }
}