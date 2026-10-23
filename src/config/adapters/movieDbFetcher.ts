import {THE_MOVIE_DB_KEY} from '@env';
import {AxiosAdapter} from './http/axios.adapter';
import {FetchAdapter} from './http/fetch.adapter';
import {HttpAdapter} from './http/http.adapter';

const movieDbOptions = {
  baseUrl: 'https://api.themoviedb.org/3',
  params: {
    api_key: THE_MOVIE_DB_KEY,
    language: 'es',
  },
};

// Pendiente de pruebas manuales. Cambiar a 'axios' para usar AxiosAdapter.
const activeAdapter = 'fetch' as 'fetch' | 'axios';

const createMovieDbFetcher = (): HttpAdapter => {
  if (activeAdapter === 'axios') {
    return new AxiosAdapter(movieDbOptions);
  }

  return new FetchAdapter(movieDbOptions);
};

export const movieDbFetcher = createMovieDbFetcher();
