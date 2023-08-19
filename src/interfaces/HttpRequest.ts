export interface RequestConfig {
  url: string;
  method?: "GET" | "PUT" | "PATCH" | "POST" | "DELETE";
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  body?: BodyInit | null;
  mode?: RequestMode;
  cache?: RequestCache;
  isCustomUrl?: boolean;
}

export type SendRequestFunction = <T = any>(
  requestConfig: RequestConfig
) => Promise<T>;
