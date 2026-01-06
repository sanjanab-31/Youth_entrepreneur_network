// Mock Auth Service
const DELAY = 800;

export const AuthService = {
    login: async (email, password, role) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const token = `mock-jwt-${role}-${Date.now()}`;
                    const user = {
                        name: "Test User",
                        email,
                        role,
                        id: "user-123"
                    };
                    localStorage.setItem('yen_token', token);
                    localStorage.setItem('yen_user', JSON.stringify(user));
                    resolve({ user, token });
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, DELAY);
        });
    },

    signup: async (userData, role) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const token = `mock-jwt-${role}-${Date.now()}`;
                const user = { ...userData, role, id: `user-${Date.now()}` };
                localStorage.setItem('yen_token', token);
                localStorage.setItem('yen_user', JSON.stringify(user));
                resolve({ user, token });
            }, DELAY);
        });
    },

    logout: () => {
        localStorage.removeItem('yen_token');
        localStorage.removeItem('yen_user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('yen_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('yen_token');
    }
};
