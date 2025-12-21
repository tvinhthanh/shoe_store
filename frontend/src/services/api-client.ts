/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export class ApiService {
  protected baseUrl: string;

  constructor(path: string) {
    this.baseUrl = `${API_BASE_URL}${path}`;
  }

  private async request(url: string, options: RequestInit) {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    let body = null;

    try {
      body = await response.json();
    } catch { /* empty */ }

    if (!response.ok) {
      throw new Error(body?.message || "Request failed");
    }

    return body;
  }

  protected get(path = "") {
    return this.request(`${this.baseUrl}${path}`, {
      method: "GET"
    });
  }

  protected post(path = "", data?: any) {
    return this.request(`${this.baseUrl}${path}`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined
    });
  }

  protected put(path = "", data?: any) {
    return this.request(`${this.baseUrl}${path}`, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined
    });
  }

  protected delete(path = "") {
    return this.request(`${this.baseUrl}${path}`, {
      method: "DELETE"
    });
  }

  protected upload(path = "", file: File) {
    const formData = new FormData();
    formData.append("image", file);

    return fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      body: formData,
      credentials: "include"
      // KHÔNG SET headers Content-Type
    }).then(async (res) => {
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message || "Upload failed");
      return body;
    });
  }
}
