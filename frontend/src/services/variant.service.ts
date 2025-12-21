/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiService } from "./api-client";

class VariantService extends ApiService {
    constructor() {
        super("/api/variants");
    }

    getByProduct(productId: number) {
        return this.get(`/product/${productId}`);
    }

    getAll() {
        return this.get("");
    }

    getById(id: number) {
        return this.get(`/${id}`);
    }

    create(data: any) {
        return this.post("", data);
    }

    update(id: number, data: any) {
        return this.put(`/${id}`, data);
    }

    remove(id: number) {
        return this.delete(`/${id}`);
    }
}

export const variantService = new VariantService();
