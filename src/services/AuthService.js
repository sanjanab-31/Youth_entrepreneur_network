// Mock Auth Service
const DELAY = 800;

const getUsers = () => {
    const usersStr = localStorage.getItem('yen_users');
    return usersStr ? JSON.parse(usersStr) : [];
};

const saveUsers = (users) => {
    localStorage.setItem('yen_users', JSON.stringify(users));
};

export const AuthService = {
    login: async (email, password, role) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getUsers();
                const user = users.find(u => u.email === email);

                if (!user) {
                    // Scenario: Account not found
                    reject(new Error("Account not found. Please create an account."));
                    return;
                }

                // Scenario: Wrong password
                if (user.password !== password) {
                    if (role === 'student' && user.role === 'student') {
                        reject(new Error("Invalid founder credentials."));
                    } else if (role === 'investor' && user.role === 'investor') {
                        reject(new Error("Invalid credentials"));
                    } else {
                        reject(new Error("Invalid credentials"));
                    }
                    return;
                }

                // Scenario: Correct Credentials BUT Wrong Role (Cross-Role Login)
                if (user.role !== role) {
                    if (role === 'investor' && user.role === 'student') {
                        reject(new Error("This account belongs to a Founder. Please use the Founder Login."));
                    } else if (role === 'student' && user.role !== 'student') {
                        // Trying to login as Founder but account is not Founder
                        reject(new Error(`This account belongs to a ${user.role}. Please use the ${user.role} Login.`));
                    } else {
                        // General fallback for other cross-role attempts
                        reject(new Error(`This account belongs to a ${user.role}. Please use the ${user.role} Login.`));
                    }
                    return;
                }

                // Success
                const token = `mock-jwt-${role}-${Date.now()}`;
                localStorage.setItem('yen_token', token);
                localStorage.setItem('yen_user', JSON.stringify(user));
                resolve({ user, token });

            }, DELAY);
        });
    },

    signup: async (userData, role) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getUsers();
                const existingUser = users.find(u => u.email === userData.email);

                if (existingUser) {
                    reject(new Error("An account with this email already exists."));
                    return;
                }

                const token = `mock-jwt-${role}-${Date.now()}`;
                const newUser = {
                    ...userData,
                    role,
                    id: `user-${Date.now()}`,
                    createdAt: new Date().toISOString()
                };

                // Save to registry (all user data including mentor-specific fields)
                users.push(newUser);
                saveUsers(users);

                // Set current session
                localStorage.setItem('yen_token', token);
                localStorage.setItem('yen_user', JSON.stringify(newUser));
                resolve({ user: newUser, token });
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
