export interface INowPlayingResponse {
  dates:         IDates;
  page:          number;
  results:       IResult[];
  total_pages:   number;
  total_results: number;
}

export interface IPopularResponse {
  page:          number;
  results:       IResult[];
  total_pages:   number;
  total_results: number;
}

export interface ITopRatedResponse {
  page:          number;
  results:       IResult[];
  total_pages:   number;
  total_results: number;
}

export interface ITopRatedResponse {
  page:          number;
  results:       IResult[];
  total_pages:   number;
  total_results: number;
}

export interface IUpComingResponse {
  dates:         IDates;
  page:          number;
  results:       IResult[];
  total_pages:   number;
  total_results: number;
}

export interface IResult {
  adult:             boolean;
  backdrop_path:     string;
  genre_ids?:         number[];
  id:                number;
  original_language: OriginalLanguage;
  original_title:    string;
  overview:          string;
  popularity:        number;
  poster_path:       string;
  release_date:      Date;
  title:             string;
  video:             boolean;
  vote_average:      number;
  vote_count:        number;
}

export interface IDates {
  maximum: Date;
  minimum: Date;
}

export enum OriginalLanguage {
  En = "en",
  Es = "es",
  Ja = "ja",
  Zh = "zh",
  Fr = "fr",
  Ko = "ko",
}
