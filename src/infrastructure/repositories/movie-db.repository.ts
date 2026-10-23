import {
  HttpAdapter,
  HttpError,
  QueryParams,
} from '../../config/adapters/http/http.adapter';
import type {ICast} from '../../core/entities/cast.entity';
import type {IFullMovie, IMovie} from '../../core/entities/movie.entity';
import type {MovieRepository} from '../../core/repositories/movie.repository';
import {IMovieDbByIdResponse} from '../interfaces/movie-db-by-id-response';
import {IMovieDBCastResponse} from '../interfaces/movie-db-cast-response';
import type {IMovieDbListResponse} from '../interfaces/movie-db-responses';
import {CastMapper} from '../mappers/cast.mapper';
import {MovieMapper} from '../mappers/movie.mapper';

export class MovieDbRepository implements MovieRepository {
  constructor(private readonly fetcher: HttpAdapter) {}

  getNowPlaying(): Promise<IMovie[]> {
    return this.getList('/movie/now_playing');
  }

  getPopular(page = 1): Promise<IMovie[]> {
    return this.getList('/movie/popular', {page});
  }

  getUpcoming(): Promise<IMovie[]> {
    return this.getList('/movie/upcoming');
  }

  getTopRated(): Promise<IMovie[]> {
    return this.getList('/movie/top_rated');
  }

  search(query: string): Promise<IMovie[]> {
    return this.getList('/search/movie', {query});
  }

  async getById(movieId: number): Promise<IFullMovie> {
    const path = `/movie/${movieId}`;
    try {
      const response = await this.fetcher.get<IMovieDbByIdResponse>(path);
      return MovieMapper.fromMovieDBToEntity(response);
    } catch (error) {
      throw this.asHttpError(error, path);
    }
  }

  async getCast(movieId: number): Promise<ICast[]> {
    const path = `/movie/${movieId}/credits`;
    try {
      const {cast} = await this.fetcher.get<IMovieDBCastResponse>(path);
      return cast.map(CastMapper.fromMovieDBCastToEntity);
    } catch (error) {
      throw this.asHttpError(error, path);
    }
  }

  private async getList(path: string, params?: QueryParams): Promise<IMovie[]> {
    try {
      const response = await this.fetcher.get<IMovieDbListResponse>(
        path,
        params ? {params} : undefined,
      );

      return response.results.map(result =>
        MovieMapper.fromMovieDbResultToEntity(result),
      );
    } catch (error) {
      throw this.asHttpError(error, path);
    }
  }

  private asHttpError(error: unknown, url: string): HttpError {
    if (error instanceof HttpError) {
      return error;
    }

    return new HttpError(
      error instanceof Error ? error.message : 'Error fetching movies',
      undefined,
      url,
    );
  }
}
