import { useAuthStore } from 'src/stores/auth-store';
import { usePreferenceStore } from 'src/stores/preference-store';
import { useEmployeeStore } from 'src/stores/employee-store';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/IndexPage.vue'), name: 'login' }
    ]
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/HomePage.vue'), name: 'home' }
    ]
  },
  {
    path: '/preferences',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      const preference = usePreferenceStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        preference.component = preference.component ?? 'UserComponent'
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/PreferencePage.vue'), name: 'preferences' }
    ]
  },
  {
    path: '/recruitment',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/RecruitmentPage.vue'), name: 'recruitment' }
    ]
  },
  {
    path: '/employee',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      const employee = useEmployeeStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        employee.component = employee.component ?? 'EmployeeComponent'
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/EmployeePage.vue'), name: 'employee' }
    ]
  },
  {
    path: '/leave',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/LeavePage.vue'), name: 'leave' }
    ]
  },
  {
    path: '/dtr',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/DailyTimeRecordPage.vue'), name: 'dtr' }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
