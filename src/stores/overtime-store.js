import { defineStore, acceptHMRUpdate } from 'pinia'

export const useOvertimeStore = defineStore('overtimeStore', {
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
  import.meta.hot.accept(acceptHMRUpdate(useOvertimeStore, import.meta.hot))
}
