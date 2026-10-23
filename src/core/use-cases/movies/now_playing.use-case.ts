import type {IMovie} from '../../entities/movie.entity';
import type {MovieRepository} from '../../repositories/movie.repository';

export const moviesNowPlayingUseCase = (
  repository: MovieRepository,
): Promise<IMovie[]> => repository.getNowPlaying();
