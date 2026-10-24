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

// Probado en emulador: fetch y axios cargan las mismas listas y páginas.
// Sin red, fetch muestra "Network request failed" y axios "Network Error".
const activeAdapter = 'fetch' as 'fetch' | 'axios';

const createMovieDbFetcher = (): HttpAdapter => {
  if (activeAdapter === 'axios') {
    return new AxiosAdapter(movieDbOptions);
  }

  return new FetchAdapter(movieDbOptions);
};

export const movieDbFetcher = createMovieDbFetcher();
