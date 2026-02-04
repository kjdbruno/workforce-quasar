import { defineStore, acceptHMRUpdate } from 'pinia'

export const useLeaveStore = defineStore('leaveStore', {
  state: () => ({
    component: null,
    data: null,
    isEdit: false
  }),

  getters: {
    
  },

  
  actions: {
    
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLeaveStore, import.meta.hot))
}
