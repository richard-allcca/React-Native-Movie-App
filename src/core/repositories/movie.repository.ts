import type {ICast} from '../entities/cast.entity';
import type {IFullMovie, IMovie} from '../entities/movie.entity';

export interface MovieRepository {
  getNowPlaying(): Promise<IMovie[]>;
  getPopular(page?: number): Promise<IMovie[]>;
  getUpcoming(): Promise<IMovie[]>;
  getTopRated(): Promise<IMovie[]>;
  getById(movieId: number): Promise<IFullMovie>;
  getCast(movieId: number): Promise<ICast[]>;
  search(query: string): Promise<IMovie[]>;
}
