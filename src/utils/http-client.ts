import { SendRequestFunction } from "@/interfaces/HttpRequest";

const httpClient: SendRequestFunction = async (requestConfig) => {
  const httpAbortCtrl = new AbortController();
  try {
    const response = await fetch(
      requestConfig.isCustomUrl
        ? requestConfig.url
        : `${process.env.NEXTAUTH_URL}${requestConfig.url}`,
      {
        method: requestConfig.method || "GET",
        credentials: requestConfig.isCustomUrl
          ? requestConfig.credentials
          : "include",
        headers: requestConfig.headers || {},
        body: requestConfig.body || null,
        mode: requestConfig.mode,
        cache: requestConfig.cache || "no-cache",
        signal: httpAbortCtrl.signal,
      }
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (error: any) {
    throw error;
  }
};

export default httpClient;
