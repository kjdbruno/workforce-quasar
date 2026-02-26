<template>
    <q-page class="full-height flex flex-center">
        <q-card class="justify-center items-center no-shadow q-pa-xl radius-md border" style="width: 600px;">
            <q-card-section>
                <div class="text-center">
                    <img src="~assets/logo.png" alt="Login Image" style="width: 100%; height: auto;" />
                </div>
            </q-card-section>
            <q-card-section>
                <div class="row q-col-gutter-xs">
                    <div class="col-6">
                        <div class="text-caption text-uppercase" :class="formErrors.username.type ? 'text-negative text-italic' : 'text-grey'">{{ formErrors.username.type ? formErrors.username.msg : 'username' }}</div>
                        <q-input v-model="username" :error="formErrors.username.type" outlined label="Username" no-error-icon class="full-width" autofocus @keyup.enter="login" />
                    </div>
                    <div class="col-6">
                        <div class="text-caption text-uppercase" :class="formErrors.password.type ? 'text-negative text-italic' : 'text-grey'">{{ formErrors.password.type ? formErrors.password.msg : 'password' }}</div>
                        <q-input v-model="password" :error="formErrors.password.type" :type="showPassword ? 'text' : 'password'" outlined no-error-icon label="Password" class="full-width" @keyup.enter="login">
                            <template v-slot:append>
                                <q-icon :name="showPassword ? 'bi-eye' : 'bi-eye-slash'" class="cursor-pointer" @click="showPassword = !showPassword" style="font-size: 1rem;" />
                            </template>
                        </q-input>
                    </div>
                </div>
            </q-card-section>
            <q-card-section>
                <q-btn unelevated color="primary" label="sign in" size="lg" class="full-width" @click="login"/>
            </q-card-section>
            <q-inner-loading :showing="loading">
                <q-card class="no-shadow radius-md q-pa-md">
                    <q-card-section class="text-center">
                        <div>
                            <q-spinner-ios color="dark"/>
                        </div>
                        <div class="text-dark text-uppercase text-caption">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </q-inner-loading>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store';
import { useIndexStore } from 'src/stores/index-store';
import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const indexStore = useIndexStore();

const username = ref('');
const password = ref('');

const showPassword = ref(false);

const loading = ref(false);

const formErrors = reactive({
    username: { msg: null, type: null },
    password: { msg: null, type: null }
});

const userValidator = () => {
    let isError = false;
    if (username.value == '' || username.value == '') {
        formErrors.username.msg = 'required!';
        formErrors.username.type = true;
        isError = true;
    } else {
        formErrors.username.msg = null;
        formErrors.username.type = null;
    }
    if (password.value == '' || password.value == null) {
        formErrors.password.msg = 'required!'
        formErrors.password.type = true;
        isError = true;
    } else if (password.value.length > 0 && password.value.length < 4) {
        formErrors.password.msg = 'invalid!';
        formErrors.password.type = true;
        isError = true;
    } else {
        formErrors.password.msg = null;
        formErrors.password.type = null;
    }
    return isError;
}

const login = async () => {
    const isError = userValidator();
    if (isError) return false;
    loading.value = true;
    try {
        await authStore.login(username.value, password.value);
        router.push('/home');
        loading.value = false;
    } catch (e) {
        loading.value = false;
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">Error</div>
                <div class="text-caption text-capitalize;">${e.response.data.errors[0]?.msg}</div>
            `
        });
    }
}
</script>

<style scoped>

</style>