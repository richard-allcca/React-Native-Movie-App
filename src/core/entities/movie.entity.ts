export interface IMovie {
  id: number;
  title: string;
  description: string;
  releaseDate: Date;
  rating: number;
  posterPath: string | null;
  backdropPath: string | null;
}

export interface IFullMovie extends IMovie {
  genres: string[];
  duration: number;
  budget: number;
  originalTitle: string;
  productionCompanies: string[];
}
