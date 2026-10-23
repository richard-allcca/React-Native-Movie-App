import type {IMovie} from '../../entities/movie.entity';
import type {MovieRepository} from '../../repositories/movie.repository';

export const moviesUpcomingUseCase = (
  repository: MovieRepository,
): Promise<IMovie[]> => repository.getUpcoming();
