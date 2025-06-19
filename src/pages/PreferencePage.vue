<template>
    <div>
        <q-card square class="no-shadow">
            <q-card-section>
                <header class="header">
                    <div class="tabs row items-center">
                        <div @click="PreferenceStore.component = 'UserPreferenceComponent'" class="tab text-uppercase cursor-pointer" :class="PreferenceStore.component == 'UserPreferenceComponent' ? 'active' : null" href="#">user</div>
                        <div @click="PreferenceStore.component = 'OfficePreferenceComponent'" class="tab text-uppercase cursor-pointer" :class="PreferenceStore.component == 'OfficePreferenceComponent' ? 'active' : null" href="#">office</div>
                    </div>
                </header>
            </q-card-section>
        </q-card>
        <div class="q-mt-md">
            <component :is="components[PreferenceStore.component]" :key="PreferenceStore.component" />
        </div>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-card class="no-shadow" square>
                <q-card-section>
                    <q-input outlined dense square debounce="300" v-model="PreferenceStore.filter" placeholder="Search...">
                        <template v-slot:prepend>
                            <q-icon name="search" style="font-size: 1rem;" />
                        </template>
                        <template v-slot:after>
                            <q-btn unelevated size="md" square color="primary" label="new" @click="() => { PreferenceStore.dialog = true; PreferenceStore.isEdit = false; }" />
                        </template>
                    </q-input>
                </q-card-section>
            </q-card>
        </q-page-sticky>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePreferenceStore } from '../stores/preference-store';
import UserPreferenceComponent from '../components/UserPreferenceComponent.vue';
import OfficePreferenceComponent from '../components/OfficePreferenceComponent.vue';

const PreferenceStore = usePreferenceStore();

const components = {
    UserPreferenceComponent,
    OfficePreferenceComponent,
};
</script>

<style scoped>

</style>