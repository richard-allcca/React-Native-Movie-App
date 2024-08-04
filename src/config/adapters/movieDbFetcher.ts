import { AxiosAdapter } from "./http/axios.adapter";


export const movieDbFetcher = new AxiosAdapter({
  baseUrl: 'https://api.themoviedb.org/3/movie',
  params: {
    api_key: 'e928d06fdb99aa428f609f48b22098d5',
    language: 'es'
  }
})