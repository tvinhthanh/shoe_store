import { ApiService } from "./api-client";

class ReviewService extends ApiService {
    constructor() {
        super("/api/reviews");
    }

    getAll() {
        return this.get();
    }

    getByProduct(productId: string) {
        return this.get(`/product/${productId}`);
    }

    remove(id: number | string) {
        return this.delete(`/${id}`);
    }

    create(payload: any) {
        return this.post(`/create`, payload);
    }
}

export const reviewService = new ReviewService();
