/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiService } from "./api-client";

class ProductService extends ApiService {
  constructor() {
    super("/api/products");
  }

  getAll() {
    return this.get();
  }

  getById(id: number) {
    return this.get(`/${id}`);
  }

  create(formData: FormData) {
    return fetch(this.baseUrl, {
      method: "POST",
      body: formData,
      credentials: "include"
    }).then(async (res) => {
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message || "Create failed");
      return body;
    });
  }

  // UPDATE PRODUCT + IMAGE (nếu có)
  update(id: number, formData: FormData) {
    return fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include"
    }).then(async (res) => {
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message || "Update failed");
      return body;
    });
  }

  remove(id: number) {
    return this.delete(`/${id}`);
  }

  getByCategory(id: number) {
    return this.get(`/category/${id}`);
  }

  search(keyword: string) {
    if (!keyword || keyword.trim() === "") {
      return this.getAll();
    }
    return this.get(`/search/${encodeURIComponent(keyword.trim())}`);
  }
}

export const productService = new ProductService();
