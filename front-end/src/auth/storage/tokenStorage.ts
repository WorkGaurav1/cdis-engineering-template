const ACCESS_TOKEN_KEY = "access_token";

export const tokenStorage = {
    saveToken(token: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    getToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    clearToken(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    },
};