/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiService } from "./api-client";

class OrderItemService extends ApiService {
    constructor() {
        super("/api/order-items");
    }

    getByOrder(orderId: number) {
        return this.get(`/${orderId}`);
    }

    createMany(items: any[]) {
        return this.post("/", { items });
    }
}

export const orderItemService = new OrderItemService();
