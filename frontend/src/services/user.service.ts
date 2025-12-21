/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiService } from "./api-client";

class UserService extends ApiService {
    constructor() {
        super("/api/users");
    }

    getAll() {
        return this.get();
    }

    getById(id: string) {
        return this.get(`/${id}`);
    }

    updateUser(id: string, data: any) {
        return this.put(`/${id}`, data);
    }

    deleteUser(id: string) {
        return this.delete(`/${id}`);
    }
}

export const userService = new UserService();
