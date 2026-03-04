const BASE_URL = import.meta.env.VITE_API_URL ?? "https://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include", // required for HttpOnly cookie auth
        ...options,
    });

    if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Request failed with status ${res.status}`);
}

    // 204 No Content: don't try to parse JSON
    if (res.status === 204) return undefined as T;

    return res.json() as Promise<T>;
}

export default request;