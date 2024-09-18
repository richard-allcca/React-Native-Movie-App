import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { IMovieDbByIdResponse } from "../../../infrastructure/interfaces/movie-db-by-id-response";
import { IMovieDBCastResponse } from "../../../infrastructure/interfaces/movie-db-cast-response";
import { CastMapper } from "../../../infrastructure/mappers/cast.mapper";
import { ICast } from "../../entities/cast.entity";

export const getMovieCastUseCase =async ( fetcher: HttpAdapter, movieId: number ):Promise<ICast[]> => {

  try {

    const { cast } = await fetcher.get<IMovieDBCastResponse>(`/${ movieId }/credits`);

    const actors = cast.map( CastMapper.fromMovieDBCastToEntity );

    return actors;



  } catch (error) {
    throw new Error(`Cannot get movie cast ${ movieId }`);
  }

}