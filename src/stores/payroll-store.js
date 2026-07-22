import { defineStore, acceptHMRUpdate } from 'pinia'

export const usePayrollStore = defineStore('payrollStore', {
  state: () => ({
    component: null,
    data: null,
    month: null,
    year: null
  }),

  getters: {
    
  },

  
  actions: {
    
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePayrollStore, import.meta.hot))
}
