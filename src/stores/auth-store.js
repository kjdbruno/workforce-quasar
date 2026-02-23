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
        hasRole: (state) => (roles = []) => roles.includes(state.user?.role),
        // optional helpers
        isHR: (state) => state.user?.role === 'HR',

        // ✅ check if a specific user is online
        isUserOnline: (state) => (userId) => {
            const id = Number(userId);
            return state.onlineUsers.some(u => Number(u.user_id) === id);
        },

        // ✅ check if YOU are online
        amIOnline: (state) => {
            const myId = Number(state.user?.id);
            if (!myId) return false;
            return state.onlineUsers.some(u => Number(u.user_id) === myId);
        },

        // optional: get online users list only
        onlineUserIds: (state) =>
            state.onlineUsers
            .filter(u => u.is_online)
            .map(u => Number(u.user_id)),

        onlineUsersDetailed: (state) =>
            state.onlineUsers
                .filter(u => u.is_online)
                .map(u => ({
                    id: u.user_id,
                    name: u.User?.name,
                    role: u.User?.role,
                    avatar: u.User?.avatar,
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
        upsertOnlineUser(record) {
            if (!record?.user_id) return;

            const id = Number(record.user_id);
            const idx = this.onlineUsers.findIndex(u => Number(u.user_id) === id);

            if (idx >= 0) {
            this.onlineUsers[idx] = { ...this.onlineUsers[idx], ...record };
            } else {
            this.onlineUsers.push(record);
            }
        },

        // ✅ mark offline (soft)
        markUserOffline(userId) {
            const id = Number(userId);
            const idx = this.onlineUsers.findIndex(u => Number(u.user_id) === id);

            if (idx >= 0) {
            this.onlineUsers[idx].is_online = false;
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