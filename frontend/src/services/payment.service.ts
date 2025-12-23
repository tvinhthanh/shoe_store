/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiService } from "./api-client";

class PaymentService extends ApiService {
    constructor() {
        super("/api/payments");
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

    getByOrder(orderId: any) {
        return this.get(`/order/${orderId}`);
    }

    updateStatus(id: any, status: string) {
        return this.put(`/${id}/status`, { status });
    }

    remove(id: number) {
        return this.delete(`/${id}`);
    }
}

export const paymentService = new PaymentService();

