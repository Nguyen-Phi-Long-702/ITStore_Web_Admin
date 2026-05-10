const BASE_URL = "http://localhost:3000";
const TIMEOUT_MS = 30000;
function getAuthHeaders(extra) {
    const token = localStorage.getItem("auth_access_token");
    return {
        ...(extra ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}
async function request(path, init) {
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
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.message ?? `HTTP ${res.status}`);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    }
    finally {
        clearTimeout(timeoutId);
    }
}
function jsonRequest(path, method, body) {
    return request(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}
function formRequest(path, method, data) {
    return request(path, { method, body: data });
}
export function unwrapList(res) {
    if (Array.isArray(res))
        return res;
    if (res && typeof res === "object") {
        const obj = res;
        if (Array.isArray(obj.data))
            return obj.data;
        if (Array.isArray(obj.items))
            return obj.items;
    }
    return [];
}
export function unwrapData(res) {
    if (res && typeof res === "object") {
        const obj = res;
        if (obj.data !== undefined)
            return obj.data;
    }
    return res;
}
export const api = {
    get: (path) => request(path),
    post: (path, body) => jsonRequest(path, "POST", body),
    patch: (path, body) => jsonRequest(path, "PATCH", body),
    put: (path, body) => jsonRequest(path, "PUT", body),
    delete: (path) => request(path, { method: "DELETE" }),
    postForm: (path, data) => formRequest(path, "POST", data),
    putForm: (path, data) => formRequest(path, "PUT", data),
    patchForm: (path, data) => formRequest(path, "PATCH", data),
};
