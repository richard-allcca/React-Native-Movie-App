import type {ICast} from '../../entities/cast.entity';
import type {MovieRepository} from '../../repositories/movie.repository';

export const getMovieCastUseCase = (
  repository: MovieRepository,
  movieId: number,
): Promise<ICast[]> => repository.getCast(movieId);
