import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { LocalStorage } from 'quasar';
import { useRouter } from 'vue-router';
import { Router } from 'src/router/index';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token'),
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        //
        onlineUsers: [],
        employees: [],
        notifications: [],
        count: 0,
        hasNotifications: null,
    }),
    getters: {
        hasRole: (state) => (roles = []) => {
        const userRole = state.user?.role
        if (!userRole) return false

        const roleList = Array.isArray(roles) ? roles : [roles]

        return roleList.some(r =>
            String(r).toLowerCase() === String(userRole).toLowerCase()
        )
        },
        // ✅ check if a specific user is online (NEW SHAPE)
        isUserOnline: (state) => (userId) => {
            const id = Number(userId);
            return state.onlineUsers.some(u => Number(u.id) === id && !!u.UserLog?.is_online);
        },

        // ✅ check if YOU are online (NEW SHAPE)
        amIOnline: (state) => {
            const myId = Number(state.user?.id);
            if (!myId) return false;
            return state.onlineUsers.some(u => Number(u.id) === myId && !!u.UserLog?.is_online);
        },

        // ✅ list of online user ids
        onlineUserIds: (state) =>
            state.onlineUsers
            .filter(u => !!u.UserLog?.is_online)
            .map(u => Number(u.id)),

        // ✅ detailed list for UI
        onlineUsersDetailed: (state) =>
            state.onlineUsers
            .filter(u => !!u.UserLog?.is_online)
            .map(u => ({
                id: u.id,
                name: u.name,
                role: u.role,
                avatar: u.avatar, // base64 string if you converted server-side
            })),
    },
    actions: {
        async login(username, password) {
            try {
                const response = await api.post('/login', {
                  username, password
                });
                this.token = response.data.token;
                this.user = response.data.user;
                this.isAuthenticated = true;

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                // The socket connection and authentication will be handled by the $subscribe in src/boot/socket.js
                // once isAuthenticated becomes true.

                return true;
            } catch (error) {
                console.error('Login failed:', error.response?.data?.error || error.message);
                this.clearAuthData();
                throw error;
            }
        },
        async logout() {
            try {
                await api.post('/logout'); // If you have server-side logout
                this.clearAuthData();
                // Use the globally exported Router instance
                if (Router) { // Check if Router is defined
                    Router.push('/');
                } else {
                    console.error('Router instance not available for redirect (exported method).');
                }
                return true;
            } catch (error) {
                console.error('Logout failed (client-side cleanup anyway):', error);
                this.clearAuthData();
                // Ensure Router is available even on error paths
                if (Router) {
                    Router.push('/');
                } else {
                    console.error('Router instance not available for redirect after error (exported method).');
                }
                throw error;
            }
        },
        clearAuthData() {
            this.token = null;
            this.isAuthenticated = false;
            this.user = null;
            LocalStorage.remove('jwt_token');
            LocalStorage.remove('user_data');
            // The socket's disconnect will be triggered by the $subscribe in src/boot/socket.js
        },
        async checkAuthStatus() {
            // This method remains primarily for HTTP-based token validation
            if (!this.token) {
                this.clearAuthData();
                return false;
            }
            try {
                await api.get('/check-token');
                this.isAuthenticated = true;
                return true;
            } catch (error) {
                console.error('JWT validation failed on client startup or explicit check:', error);
                this.clearAuthData(); // Interceptor also does this, but good to ensure
                return false;
            }
        },
        async readNotification() {
            this.count = 0;
            this.socket.emit('ReadNotification', { id: this.user.id });
        },
        // ✅ set online users from API/socket payload (your exact array format)
        setOnlineUsers(list = []) {
            this.onlineUsers = Array.isArray(list) ? list : [];
        },

        // ✅ mark online (if you receive 1 record only)
        upsertOnlineUser(user) {
            if (!user?.id) return;

            const id = Number(user.id);
            const idx = this.onlineUsers.findIndex(u => Number(u.id) === id);

            if (idx >= 0) {
                this.onlineUsers[idx] = { ...this.onlineUsers[idx], ...user };
            } else {
                this.onlineUsers.push(user);
            }
        },

        // ✅ mark offline (soft)
        markUserOffline(userId) {
            const id = Number(userId);
            const idx = this.onlineUsers.findIndex(u => Number(u.id) === id);

            if (idx >= 0) {
                // ensure UserLog exists then set is_online false
                this.onlineUsers[idx].UserLog = {
                ...(this.onlineUsers[idx].UserLog || {}),
                is_online: false
                };
            }
        },

        // ✅ function you can call anywhere
        checkIfOnline(userId) {
            if (!userId) return this.amIOnline;
            return this.isUserOnline(userId);
        },
    },
    persist: true,
});