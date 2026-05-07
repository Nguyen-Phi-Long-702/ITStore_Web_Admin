const BASE_URL = "http://localhost:3000";
const TIMEOUT_MS = 30000;

function getAuthHeaders(extra?: HeadersInit): HeadersInit {
  const token = localStorage.getItem("auth_access_token");
  return {
    ...(extra ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      credentials: "include",
      ...init,
      headers: getAuthHeaders(init?.headers),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as Record<string, unknown>;
      throw new Error((body?.message as string) ?? `HTTP ${res.status}`);
    }

    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (null as unknown as T);
  } finally {
    clearTimeout(timeoutId);
  }
}

function jsonRequest<T>(path: string, method: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function formRequest<T>(path: string, method: string, data: FormData): Promise<T> {
  return request<T>(path, { method, body: data });
}

export function unwrapList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  if (res && typeof res === "object") {
    const obj = res as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.items)) return obj.items as T[];
  }
  return [];
}

export function unwrapData<T>(res: unknown): T {
  if (res && typeof res === "object") {
    const obj = res as Record<string, unknown>;
    if (obj.data !== undefined) return obj.data as T;
  }
  return res as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => jsonRequest<T>(path, "POST", body),
  patch: <T>(path: string, body: unknown) => jsonRequest<T>(path, "PATCH", body),
  put: <T>(path: string, body: unknown) => jsonRequest<T>(path, "PUT", body),
  delete: (path: string) => request<void>(path, { method: "DELETE" }),
  postForm: <T>(path: string, data: FormData) => formRequest<T>(path, "POST", data),
  putForm: <T>(path: string, data: FormData) => formRequest<T>(path, "PUT", data),
  patchForm: <T>(path: string, data: FormData) => formRequest<T>(path, "PATCH", data),
};
