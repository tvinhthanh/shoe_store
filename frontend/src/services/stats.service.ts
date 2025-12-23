/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiService } from "./api-client";

class StatsService extends ApiService {
    constructor() {
        super("/api/stats");
    }

    getDashboard() {
        return this.get("/dashboard");
    }
}

export const statsService = new StatsService();

