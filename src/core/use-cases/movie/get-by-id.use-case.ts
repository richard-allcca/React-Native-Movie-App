import type {IFullMovie} from '../../entities/movie.entity';
import type {MovieRepository} from '../../repositories/movie.repository';

export const getMovieByIdUseCase = (
  repository: MovieRepository,
  movieId: number,
): Promise<IFullMovie> => repository.getById(movieId);
