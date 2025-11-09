import { HttpAdapter } from "./http.adapter";

interface Options {
  baseUrl: string;
  params?: Record<string, string>;
}

export class FetchAdapter implements HttpAdapter {
  private baseUrl: string;
  private params?: Record<string, string>;

  constructor(options: Options) {
    this.baseUrl = options.baseUrl;
    this.params = options.params;
  }

  private buildUrl(url: string): string {
    // Unir baseUrl y url correctamente
    let fullUrl = url.startsWith('http')
      ? url
      // Elimina la barra final de baseUrl y la barra inicial de url
      : [this.baseUrl.replace(/\/$/, ''), url.replace(/^\//, '')].join('/');

    if (this.params) {
      const searchParams = new URLSearchParams(this.params).toString();
      if (searchParams) {
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + searchParams;
      }
    }
    return fullUrl;
  }

  async get<T>(url: string, options?: Record<string, unknown>): Promise<T> {
    try {
      const fullUrl = this.buildUrl(url);
      const response = await fetch(fullUrl, { ...options, method: 'GET' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      throw new Error(`Error fetching data from ${url}: ${error}`);
    }
  }
}
