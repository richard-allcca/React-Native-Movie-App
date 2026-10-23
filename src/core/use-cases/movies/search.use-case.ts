import type {IMovie} from '../../entities/movie.entity';
import type {MovieRepository} from '../../repositories/movie.repository';

export const searchMoviesUseCase = (
  repository: MovieRepository,
  query: string,
): Promise<IMovie[]> => repository.search(query);
