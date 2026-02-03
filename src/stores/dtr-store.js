import { defineStore, acceptHMRUpdate } from 'pinia'

export const useDTRStore = defineStore('dtrStore', {
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
  import.meta.hot.accept(acceptHMRUpdate(useDTRStore, import.meta.hot))
}
