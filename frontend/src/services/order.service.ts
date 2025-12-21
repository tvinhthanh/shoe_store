/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiService } from "./api-client";

class OrderService extends ApiService {
    constructor() {
        super("/api/orders");
    }

    create(payload: any) {
        return this.post("", payload);
    }

    getAll() {
        return this.get("");
    }

    getById(id: any) {
        return this.get(`/${id}`);
    }

    updateStatus(id: any, status: string) {
        return this.put(`/${id}/status`, { status });
    }

    remove(id: number) {
        return this.delete(`/${id}`);
    }

    getByUser(id: any) {
        return this.get(`/user/${id}`);
    }
}

export const orderService = new OrderService();
