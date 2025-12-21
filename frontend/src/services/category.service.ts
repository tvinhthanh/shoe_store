/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiService } from "./api-client";

class CategoryService extends ApiService {
    constructor() {
        super("/api/categories");
    }

    getAll() {
        return this.get();
    }

    create(data: any) {
        return this.post("", data);
    }

    update(id: number, data: any) {
        return this.put(`/${id}`, data);
    }

    deleteCategory(id: number) {
        return super.delete(`/${id}`);
    }
}

export const categoryService = new CategoryService();
