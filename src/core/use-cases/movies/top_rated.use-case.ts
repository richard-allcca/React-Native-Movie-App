import type {IMovie} from '../../entities/movie.entity';
import type {MovieRepository} from '../../repositories/movie.repository';

export const moviesTopRatedUseCase = (
  repository: MovieRepository,
): Promise<IMovie[]> => repository.getTopRated();
