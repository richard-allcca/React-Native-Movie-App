import {afterEach, describe, expect, it, jest} from '@jest/globals';
import {FetchAdapter} from './fetch.adapter';
import {HTTP_TIMEOUT_MS, HttpError} from './http.adapter';

const options = {
  baseUrl: 'https://api.themoviedb.org/3/',
  params: {
    api_key: 'k',
    language: 'es',
  },
};

describe('FetchAdapter', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
  });

  it('fusiona los params base con los de la petición y no los pasa a fetch', async () => {
    const fetchMock = jest.fn(async (_url: string, _init?: RequestInit) => ({
      ok: true,
      status: 200,
      json: async () => ({results: []}),
    }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const adapter = new FetchAdapter(options);
    await adapter.get('/movie/popular', {params: {page: 2, language: 'en'}});

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('https://api.themoviedb.org/3/movie/popular?');
    expect(url).toContain('api_key=k');
    expect(url).toContain('page=2');
    expect(url).toContain('language=en');
    expect(url.match(/language=/g)).toHaveLength(1);
    expect(init?.method).toBe('GET');
    expect(init && 'params' in init).toBe(false);
  });

  it('expone el status HTTP y el mensaje de TMDB', async () => {
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 401,
      json: async () => ({status_message: 'Invalid API key'}),
    })) as unknown as typeof fetch;

    const adapter = new FetchAdapter(options);

    await expect(adapter.get('/movie/1')).rejects.toMatchObject({
      name: 'HttpError',
      status: 401,
      statusMessage: 'Invalid API key',
      message: 'Invalid API key',
    });
  });

  it('aborta a los 10 segundos', async () => {
    jest.useFakeTimers();
    global.fetch = jest.fn((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          const error = new Error('The operation was aborted');
          error.name = 'AbortError';
          reject(error);
        });
      });
    }) as typeof fetch;

    const adapter = new FetchAdapter(options);
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
