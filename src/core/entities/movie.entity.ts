export interface IMovie {
    id: number;
    title: string;
    description: string;
    releaseDate: Date;
    rating: number;
    poster: string;
    backdrop: string;
}

export interface IFullMovie extends IMovie {
    genres: string[];
    duration: number;
    budget: number; // presupuesto
    originalTitle: string;
    productionsCompany: string[];
}
