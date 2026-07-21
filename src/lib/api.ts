export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ErrorPayload = {
  error?: unknown;
  message?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getPayloadMessage = (payload: unknown) => {
  if (!isRecord(payload)) return null;

  const { error, message } = payload as ErrorPayload;
  if (typeof error === "string") return error;
  if (typeof message === "string") return message;

  return null;
};

export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  let payload: unknown;

  if (!isJson) {
    const text = await response.text();
    const trimmed = text.trim();

    if (trimmed) {
      try {
        payload = JSON.parse(trimmed);
      } catch {
        const errorMessage = response.ok
          ? "The server returned an unexpected non-JSON response."
          : `Request failed with status ${response.status}.`;
        throw new ApiError(errorMessage, response.status);
      }
    } else {
      payload = {};
    }
  } else {
    payload = await response.json();
  }

  if (!response.ok) {
    throw new ApiError(
      getPayloadMessage(payload) ?? `Request failed with status ${response.status}.`,
      response.status
    );
  }

  return payload as T;
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);
  return parseJsonResponse<T>(response);
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof Error && error.message) return error.message;
  if (error instanceof ApiError) return error.message;
  return fallback;
}
