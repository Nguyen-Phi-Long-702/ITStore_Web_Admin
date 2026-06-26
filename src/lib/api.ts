export const BASE_URL = "http://localhost:3000";
const TIMEOUT_MS = 30000;

function getAuthHeaders(extra?: HeadersInit): HeadersInit {
  const token = localStorage.getItem("auth_access_token");
  return {
    ...(extra ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: Error) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("auth_refresh_token");
  if (!refreshToken) throw new Error("No refresh token");

  const doRefresh = async (): Promise<string> => {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    if (!data.access_token) throw new Error("Refresh failed");

    return data.access_token;
  };

  try {
    return await doRefresh();
  } catch {
    // Thử lại 1 lần sau 600ms để xử lý lỗi tạm thời (ví dụ Redis connection idle timeout)
    await new Promise(resolve => setTimeout(resolve, 600));
    return await doRefresh();
  }
}

function clearAuthAndRedirect() {
  localStorage.removeItem("auth_access_token");
  localStorage.removeItem("auth_refresh_token");
  localStorage.removeItem("auth_user");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let res = await fetch(`${BASE_URL}${path}`, {
      credentials: "include",
      ...init,
      headers: getAuthHeaders(init?.headers),
      signal: controller.signal,
    });

    if (res.status === 401 && !path.includes("/auth/login") && !path.includes("/auth/refresh")) {
      let newToken: string;

      if (isRefreshing) {
        newToken = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      } else {
        // Mình sẽ refresh
        isRefreshing = true;
        try {
          newToken = await refreshAccessToken();
          localStorage.setItem("auth_access_token", newToken);
          processQueue(null, newToken);
        } catch (err) {
          processQueue(err as Error);
          isRefreshing = false;
          clearAuthAndRedirect();
          throw new Error("Session expired");
        }
        isRefreshing = false;
      }

      const retryController = new AbortController();
      const retryTimeout = setTimeout(() => retryController.abort(), TIMEOUT_MS);
      try {
        res = await fetch(`${BASE_URL}${path}`, {
          credentials: "include",
          ...init,
          // Dùng newToken trực tiếp thay vì đọc lại từ localStorage
          // để đảm bảo đúng token mới dù có race condition
          headers: {
            ...(init?.headers as Record<string, string> ?? {}),
            Authorization: `Bearer ${newToken!}`,
          },
          signal: retryController.signal,
        });
      } finally {
        clearTimeout(retryTimeout);
      }
    }

    if (!res.ok) {
      if (res.status === 401) {
        // Chỉ redirect khi KHÔNG có refresh token (session thực sự hết hạn)
        // Không redirect khi refresh đã thành công nhưng retry vẫn 401
        const hasRefresh = !!localStorage.getItem("auth_refresh_token");
        if (!hasRefresh) {
          clearAuthAndRedirect();
        }
      }
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