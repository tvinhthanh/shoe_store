import { RegisterFormData } from "../pages/Register";
import { SignInFormData } from "../pages/SignIn";
import { ApiService } from "./api-client";

class AuthService extends ApiService {
    constructor() {
        super("/api/auth");
    }

    signIn(data: SignInFormData) {
        return this.post("/login", data);
    }

    register(data: RegisterFormData) {
        return this.post("/register", data);
    }

    validateToken() {
        return this.get("/validate-token");
    }

    signOut() {
        return this.post("/logout");
    }
}

export const authService = new AuthService();
