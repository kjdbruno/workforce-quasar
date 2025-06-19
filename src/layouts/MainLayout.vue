<template>
    <q-layout view="lHh Lpr lFf">
        <q-drawer
            v-model="leftDrawerOpen"
            show-if-above
            class="transparent"
            :width="150"
            v-if="authStore.isAuthenticated && router.currentRoute.value.name != 'login'"
        >
            <div class="full-height">
                <div>
                    <div v-html="indexStore.logo" />
                </div>
            </div>
            
        </q-drawer>
        <q-page-container class="">
            <q-page padding>
                <q-card 
                    square
                    v-if="authStore.isAuthenticated && router.currentRoute.value.name != 'login'"
                    class="no-shadow card-radius q-mb-md"
                    >
                    <q-card-section>
                        <div 
                        class="row items-center no-wrap"
                        >
                        <div 
                            class="col"
                        >
                            <div 
                            class="text-h5 text-capitalize"
                            >
                            <q-btn 
                                round 
                                flat 
                                size="sm" 
                                icon="arrow_back" 
                                @click="router.push('/home')" 
                                class="q-mr-sm"
                                v-if="router.currentRoute.value.name != 'home'"
                            />
                            {{ router.currentRoute.value.name.split('-').join(' ') }}
                            </div>
                        </div>
                        <div 
                            class="col-auto q-gutter-xs"
                        >
                        
                        <q-btn 
                            size="1em" 
                            icon="notifications" 
                            text-color="grey" 
                            class="bg-accent" 
                            flat 
                            round
                            >
                            <q-badge 
                                color="negative" 
                                floating 
                                rounded
                            >
                                {{ authStore.notificationCount }}
                            </q-badge>
                            <q-menu
                                :offset="[5, 5]"
                                class="card-radius card-shadow" 
                                square
                                @hide="readNotification()"
                            >
                                <q-card 
                                square
                                class="no-shadow card-radius card-border-top card-border-left" 
                                style="width: 350px;"
                                >
                                <q-card-section>
                                    <div 
                                    class="text-uppercase text-h6 text-center"
                                    >
                                    my notifications
                                    </div>
                                </q-card-section>
                                <q-separator />
                                <q-card-section
                                    class="q-pa-none"
                                >
                                    <q-list>
                                    <q-item v-for="(dt, index) in authStore.notificationList" :key="index" class="q-mb-sm">
                                        <q-item-section avatar>
                                        <q-avatar>
                                            <q-icon name="account_circle" size="lg" color="grey"/>
                                        </q-avatar>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>{{ dt.content }}</q-item-label>
                                            <q-item-label caption lines="1">{{ formatDate(dt.createdAt) }}</q-item-label>
                                        </q-item-section>
                                        <!-- <q-item-section side>
                                        <q-icon :name="dt.type == 'chat' ? 'mail' : (dt.type == 'alert' ? 'error' : (dt.type == 'reminder' ? 'alarm' : null)) " size="xs" />
                                        </q-item-section> -->
                                    </q-item>
                                    </q-list>
                                </q-card-section>
                                </q-card>
                            </q-menu>
                        </q-btn>
                            <q-btn 
                            size="1em" 
                            icon="mail" 
                            text-color="grey" 
                            class="bg-accent" 
                            flat 
                            round
                            >
                            <!-- <q-badge 
                                color="negative" 
                                floating 
                                rounded
                                v-if="(Object.values(socketStore.unread).reduce((sum, value) => sum + value, 0))"
                            >
                                {{ Object.values(socketStore.unread).reduce((sum, value) => sum + value, 0) }}
                            </q-badge> -->
                            <!-- <q-menu>
                                <q-card 
                                class="no-shadow" 
                                style="width: 350px;"
                                >
                                <q-card-section>
                                    <div 
                                    class="text-uppercase text-h6 text-center"
                                    >
                                    my notifications
                                    </div>
                                </q-card-section>
                                <q-card-section
                                    class="q-pa-none"
                                >
                                    {{ socketStore.messages }}
                                </q-card-section>
                                </q-card>
                            </q-menu> -->
                            </q-btn>
                            <q-btn 
                            size="1em" 
                            text-color="grey" 
                            class="relative-position q-ml-lg" 
                            flat 
                            round
                            >
                            <q-avatar>
                                <img 
                                :src="`${baseURL}/${authStore.user.profile.avatar}`"
                                >
                            </q-avatar>
                            <q-icon 
                                :name="socket.connected ? 'check_circle' : 'cancel'" 
                                :color="socket.connected ? 'positive' : 'negative'" 
                                class="status-icon" 
                                size="xs"
                            />
                            </q-btn>
                        </div>
                        </div>
                    </q-card-section>
                    </q-card>
                <router-view />
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useIndexStore } from 'src/stores/index-store';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { useSocketStore } from 'src/stores/socket-store';
import moment from 'moment';
import { socket } from 'src/boot/socket';

const indexStore = useIndexStore();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const socketStore = useSocketStore();

const baseURL = process.env.VUE_APP_BACKEND_URL;

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

// const isOnline = computed(() => socketStore.isOnline(authStore.id));

const formatDate = (timestamp) => {
    return moment(timestamp).fromNow();
};

const readNotification = () => {
    authStore.readNotification();
}

onMounted(() => {
    console.log(process.env.VUE_APP_BACKEND_URL);
});

</script>
