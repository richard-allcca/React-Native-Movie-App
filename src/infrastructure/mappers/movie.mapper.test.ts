import {describe, expect, it} from '@jest/globals';
import {movieImageUri} from '../../config/helpers/movie-image';
import type {IMovieDbByIdResponse} from '../interfaces/movie-db-by-id-response';
import type {IResult} from '../interfaces/movie-db-responses';
import {MovieMapper} from './movie.mapper';

const listItem = {
  id: 7,
  title: 'Dune',
  overview: 'Arena',
  release_date: '2021-10-22',
  vote_average: 8.1,
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
} as IResult;

describe('MovieMapper', () => {
  it('conserva el path del póster cuando existe', () => {
    const movie = MovieMapper.fromMovieDbResultToEntity(listItem);

    expect(movie.posterPath).toBe('/poster.jpg');
    expect(movieImageUri(movie.posterPath, 'w300')).toBe(
      'https://image.tmdb.org/t/p/w300/poster.jpg',
    );
    expect(movieImageUri(movie.backdropPath, 'w780')).toBe(
      'https://image.tmdb.org/t/p/w780/backdrop.jpg',
    );
  });

  it('no construye una URL cuando el póster viene vacío', () => {
    const movie = MovieMapper.fromMovieDbResultToEntity({
      ...listItem,
      poster_path: null,
      backdrop_path: null,
    });

    expect(movie.posterPath).toBeNull();
    expect(movie.backdropPath).toBeNull();
    expect(movieImageUri(movie.posterPath, 'w500')).toBeNull();
    expect(JSON.stringify(movie)).not.toContain('w500null');
  });

  it('deja la fecha inválida como fecha inválida y conserva presupuesto 0', () => {
    const movie = MovieMapper.fromMovieDBToEntity({
      id: 1,
      title: 'Sin fecha',
      original_title: 'No Date',
      overview: '',
      release_date: 'fecha-invalida',
      vote_average: 0,
      poster_path: null,
      backdrop_path: null,
      genres: [],
      runtime: 90,
      budget: 0,
      production_companies: [],
    } as unknown as IMovieDbByIdResponse);

    expect(Number.isNaN(movie.releaseDate.getTime())).toBe(true);
    expect(movie.budget).toBe(0);
    expect(movie.productionCompanies).toEqual([]);
    expect(movie.originalTitle).toBe('No Date');
  });
});
