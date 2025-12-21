import { ApiService } from "./api-client";

class UploadService extends ApiService {
    constructor() {
        super("/upload");
    }

    uploadImage(file: File) {
        return this.upload("", file);
    }
}

export const uploadService = new UploadService();
