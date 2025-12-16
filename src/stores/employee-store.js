import { defineStore, acceptHMRUpdate } from 'pinia'

export const useEmployeeStore = defineStore('employeeStore', {
  state: () => ({
    component: null,
    activeTab: 'Employee',
    activeSubTab: 'Profile',
    subComponent: null,
    loading: false,
    //
    employment: null,
    profileId: null,
    //
    isEmployeeProfile: false,
    isEmployeeEmployment: false,
    isEmployeeEducation: false,
    isEmployeeTraining: false,

    saveEventCounter: 0
  }),

  getters: {
    
  },

  
  actions: {
    triggerChildSave() {
      this.saveEventCounter++;
    }
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEmployeeStore, import.meta.hot))
}
