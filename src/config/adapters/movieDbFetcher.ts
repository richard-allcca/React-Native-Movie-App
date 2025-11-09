import { THE_MOVIE_DB_KEY } from "@env";
// import { AxiosAdapter } from "./http/axios.adapter";
import { FetchAdapter } from './http/fetch.adapter';

// Puede utilizarse AxiosAdapter o FetchAdapter según preferencia
export const movieDbFetcher = new FetchAdapter({
  baseUrl: 'https://api.themoviedb.org/3/movie',
  params: {
    // api_key: 'e928d06fdb99aa428f609f48b22098d5',
    api_key: THE_MOVIE_DB_KEY, // utilizando react-native-dotenv
    language: 'es'
  }
})