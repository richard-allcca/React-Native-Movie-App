import {HttpAdapter} from '../../../config/adapters/http/http.adapter';
import {IMovieDbByIdResponse} from '../../../infrastructure/interfaces/movie-db-by-id-response';
import {MovieMapper} from '../../../infrastructure/mappers/movie.mapper';
import {IFullMovie} from '../../entities/movie.entity';

export const getMovieByIdUseCAse = async ( fetcher: HttpAdapter, movieId: number ): Promise<IFullMovie> => {
  try {
    // usar el fetcher
    const response = await fetcher.get<IMovieDbByIdResponse>(`/${movieId}`);

    // mapear la respuesta a un objeto de tipo Movie
    const movie = MovieMapper.fromMovieDBToEntity(response);

    return movie;
  } catch (error) {
    throw new Error('Error getting movie');
  }
};
