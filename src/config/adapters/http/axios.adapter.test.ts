import {afterEach, describe, expect, it, jest} from '@jest/globals';
import axios from 'axios';
import {AxiosAdapter} from './axios.adapter';
import {HTTP_TIMEOUT_MS, HttpError} from './http.adapter';

jest.mock('axios', () => {
  const get = jest.fn();
  const create = jest.fn(() => ({get}));
  return {
    __esModule: true,
    default: {
      create,
      isAxiosError: (error: {isAxiosError?: boolean}) =>
        Boolean(error?.isAxiosError),
    },
  };
});

type MockFn = ReturnType<typeof jest.fn>;

const mockedAxios = axios as unknown as {
  create: MockFn;
};

const options = {
  baseUrl: 'https://api.themoviedb.org/3/',
  params: {
    api_key: 'k',
    language: 'es',
  },
};

const setup = () => {
  const adapter = new AxiosAdapter(options);
  const get = mockedAxios.create.mock.results.at(-1)?.value.get as MockFn;
  return {adapter, get};
};

describe('AxiosAdapter', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('conserva los params base y envía los de la petición a Axios', async () => {
    const {adapter, get} = setup();
    get.mockResolvedValue({data: {results: []}});

    await adapter.get('/movie/popular', {params: {page: 2}});

    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://api.themoviedb.org/3',
        params: {api_key: 'k', language: 'es'},
      }),
    );
    expect(get).toHaveBeenCalledWith(
      '/movie/popular',
      expect.objectContaining({
        params: {page: 2},
      }),
    );
    expect(get.mock.calls[0][1].params).not.toHaveProperty('api_key');
  });

  it('expone el status HTTP y el mensaje de TMDB', async () => {
    const {adapter, get} = setup();
    get.mockRejectedValue({
      isAxiosError: true,
      message: 'Request failed with status code 401',
      response: {
        status: 401,
        data: {status_message: 'Invalid API key'},
      },
    });

    await expect(adapter.get('/movie/1')).rejects.toMatchObject({
      status: 401,
      statusMessage: 'Invalid API key',
      message: 'Invalid API key',
      url: 'https://api.themoviedb.org/3/movie/1',
    });
  });

  it('aborta a los 10 segundos', async () => {
    jest.useFakeTimers();
    const {adapter, get} = setup();
    get.mockImplementation((_url: string, config: {signal: AbortSignal}) => {
      return new Promise((_resolve, reject) => {
        config.signal.addEventListener('abort', () => {
          reject({
            isAxiosError: true,
            message: 'canceled',
            code: 'ERR_CANCELED',
          });
        });
      });
    });

    const captured = adapter.get('/movie/popular').then(
      () => ({failed: false as const}),
      (error: unknown) => ({failed: true as const, error}),
    );

    await jest.advanceTimersByTimeAsync(HTTP_TIMEOUT_MS);
    const result = await captured;

    expect(result.failed).toBe(true);
    if (result.failed) {
      expect(result.error).toBeInstanceOf(HttpError);
      expect(result.error).toMatchObject({
        message: 'La petición superó el tiempo de espera',
      });
    }
  });
});
