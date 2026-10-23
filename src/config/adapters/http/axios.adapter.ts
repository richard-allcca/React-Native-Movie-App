import axios, {AxiosInstance} from 'axios';
import {
  HTTP_TIMEOUT_MS,
  HttpAdapter,
  HttpError,
  HttpRequestOptions,
  QueryParams,
} from './http.adapter';

interface Options {
  baseUrl: string;
  params?: QueryParams;
}

export class AxiosAdapter implements HttpAdapter {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;

  constructor(options: Options) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      params: options.params,
      timeout: 0,
    });
  }

  private resolveUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return [this.baseUrl, url.replace(/^\//, '')].join('/');
  }

  private bindCallerSignal(controller: AbortController, signal?: AbortSignal) {
    if (!signal) {
      return;
    }
    if (signal.aborted) {
      controller.abort();
      return;
    }
    signal.addEventListener('abort', () => controller.abort(), {once: true});
  }

  async get<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    const fullUrl = this.resolveUrl(url);
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, HTTP_TIMEOUT_MS);
    this.bindCallerSignal(controller, options?.signal);

    try {
      const {data} = await this.axiosInstance.get<T>(url, {
        params: options?.params,
        headers: options?.headers,
        signal: controller.signal,
      });

      if (data === undefined) {
        throw new HttpError(
          'La respuesta no es JSON válido',
          undefined,
          fullUrl,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const body = error.response?.data as
          | {status_message?: unknown}
          | undefined;
        const statusMessage =
          typeof body?.status_message === 'string'
            ? body.status_message
            : undefined;

        if (status) {
          throw new HttpError(
            statusMessage ?? `Error HTTP ${status}`,
            status,
            fullUrl,
            statusMessage,
          );
        }

        throw new HttpError(
          this.networkMessage(timedOut, options?.signal, error.message),
          undefined,
          fullUrl,
        );
      }

      throw new HttpError(
        error instanceof Error ? error.message : 'Error fetching data',
        undefined,
        fullUrl,
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private networkMessage(
    timedOut: boolean,
    signal: AbortSignal | undefined,
    fallback: string,
  ): string {
    if (timedOut) {
      return 'La petición superó el tiempo de espera';
    }
    if (signal?.aborted) {
      return 'La petición fue cancelada';
    }
    return fallback || 'Error fetching data';
  }
}
