import { defineStore, acceptHMRUpdate } from 'pinia'

export const useApplicationStore = defineStore('applicationStore', {
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
  import.meta.hot.accept(acceptHMRUpdate(useApplicationStore, import.meta.hot))
}
