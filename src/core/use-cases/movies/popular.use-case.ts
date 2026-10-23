import type {IMovie} from '../../entities/movie.entity';
import type {MovieRepository} from '../../repositories/movie.repository';

export const moviesPopularUseCase = (
  repository: MovieRepository,
  page = 1,
): Promise<IMovie[]> => repository.getPopular(page);
