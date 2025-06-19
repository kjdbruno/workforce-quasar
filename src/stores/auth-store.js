// import { defineStore, acceptHMRUpdate } from 'pinia';
// import { api } from 'src/boot/axios';
// import { useSocketStore } from '../stores/socket-store';
// import { LocalStorage } from 'quasar';

// export const useAuthStore = defineStore('authStore', {
//   state: () => ({
//     token: LocalStorage.getItem('jwt_token') || null, // Initialize from LocalStorage
//     isAuthenticated: !!LocalStorage.getItem('jwt_token'), // Set based on token presence
//     user: LocalStorage.getItem('user_data') ? JSON.parse(LocalStorage.getItem('user_data')) : null,
//     id: null
//   }),

//   getters: {
//     userRole: (state) => state.user.user_details ? state.user.user_details.roleId : null,
//   },

//   actions: {
//     async login(username, password) {
//       const response = await api.post('/login', {
//         username, password
//       });
//       this.token = response.data.token;
//       this.user = response.data.user;
//       this.isAuthenticated = true;
//       this.id = response.data.user.id;
      
//       LocalStorage.set('jwt_token', this.token); // Store token
//       LocalStorage.set('user_data', JSON.stringify(this.user)); // Store user data

//       return true;

//       // const socketStore = useSocketStore();
//       // socketStore.connect(this.id);
      
//     },
//     async logout () {
//       try {
//         // Optionally call the backend logout endpoint if you implement token blacklisting
//         // await api.post('/api/logout');

//         this.clearAuthData();
//         // Redirect to login page
//         this.$router.push('/'); // Assuming you have access to router
//         return true;
//       } catch (error) {
//         console.error('Logout failed (client-side cleanup anyway):', error);
//         this.clearAuthData(); // Always clear client-side data
//         this.$router.push('/');
//         throw error;
//       }
//     },
//     // A method to clear all authentication related data
//     clearAuthData() {
//       this.token = null;
//       this.isAuthenticated = false;
//       this.user = null;
//       LocalStorage.remove('jwt_token');
//       LocalStorage.remove('user_data');
//     },
//     // This is a more robust way to check if the current token is still valid
//     async checkAuthStatus() {
//       if (!this.token) {
//         this.clearAuthData();
//         return false;
//       }
//       try {
//         // Make a call to a protected endpoint that verifies the token
//         await api.get('/api/check-token');
//         this.isAuthenticated = true; // If successful, token is valid
//         return true;
//       } catch (error) {
//         console.error('JWT validation failed on client startup:', error);
//         // If token is expired or invalid, the interceptor will handle the logout and redirect
//         this.clearAuthData(); // Clear client state if token is bad
//         return false;
//       }
//     }
//   },
//   persist: true,
// })

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
// }
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { LocalStorage } from 'quasar';
import { useRouter } from 'vue-router';
import { Router } from 'src/router/index';
// import { socket } from 'src/boot/socket'; // Not needed to import directly here for subscription

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token'),
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        //
        loggedUsers: [],
        notificationCount: 0,
        notificationList: [],
        hasNotifications: null,
    }),
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
            this.notificationCount = 0;
            // this.socket.emit('readNotification', { id });
        },
    },
    persist: true,
});