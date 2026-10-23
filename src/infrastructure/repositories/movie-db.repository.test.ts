import {describe, expect, it, jest} from '@jest/globals';
import type {HttpAdapter} from '../../config/adapters/http/http.adapter';
import {moviesPopularUseCase} from '../../core/use-cases/movies/popular.use-case';
import type {IResult} from '../interfaces/movie-db-responses';
import {MovieDbRepository} from './movie-db.repository';

const result = {
  id: 10,
  title: 'Dune',
  overview: 'Arena',
  release_date: '2021-10-22',
  vote_average: 8.2,
  poster_path: '/p.jpg',
  backdrop_path: '/b.jpg',
} as IResult;

describe('MovieDbRepository', () => {
  it('pide la página indicada y devuelve películas de dominio', async () => {
    const get = jest.fn(async () => ({
      page: 2,
      results: [result],
      total_pages: 3,
      total_results: 40,
    }));
    const repository = new MovieDbRepository({get} as unknown as HttpAdapter);

    const movies = await moviesPopularUseCase(repository, 2);

    expect(get).toHaveBeenCalledWith('/movie/popular', {params: {page: 2}});
    expect(movies).toEqual([
      expect.objectContaining({
        id: 10,
        title: 'Dune',
        posterPath: '/p.jpg',
        backdropPath: '/b.jpg',
        description: 'Arena',
      }),
    ]);
  });
});
