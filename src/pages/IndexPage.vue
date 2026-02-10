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
                        <q-input v-model="username" :error="formErrors.username.type" :error-message="formErrors.username.msg" outlined label="Username" class="full-width" autofocus @keyup.enter="login" />
                    </div>
                    <div class="col-6">
                        <q-input v-model="password" :error="formErrors.password.type" :error-message="formErrors.password.msg" :type="showPassword ? 'text' : 'password'" outlined label="Password" class="full-width" @keyup.enter="login">
                            <template v-slot:append>
                                <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="showPassword = !showPassword" style="font-size: 1rem;" />
                            </template>
                        </q-input>
                    </div>
                </div>
            </q-card-section>
            <q-card-section>
                <q-btn unelevated color="primary" label="sign in" size="lg" class="full-width" :loading="loading" @click="login">
                    <template v-slot:loading>
                        <q-spinner-puff size=".5em"/>
                    </template>
                </q-btn>
                <q-banner v-if="errors.length" class="bg-red-1 text-negative shadow-md banner-radius q-pa-sm q-mt-md radius-md"dense inline-actions>
                    <q-list>
                        <q-item clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="error" color="negative" />
                            </q-item-section>
                            <q-item-section v-for="(dt, index) in errors" :key="index">
                                {{ dt.msg }}
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-banner>
            </q-card-section>
            <q-card-actions align="center">

            </q-card-actions>
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

const errors = ref([]);

const userValidator = () => {
    let isError = false;
    if (username.value == '' || username.value == '') {
        formErrors.username.msg = 'Username is required!';
        formErrors.username.type = true;
        isError = true;
    } else {
        formErrors.username.msg = null;
        formErrors.username.type = null;
    }
    if (password.value == '' || password.value == null) {
        formErrors.password.msg = 'Password is required!'
        formErrors.password.type = true;
        isError = true;
    } else if (password.value.length > 0 && password.value.length < 4) {
        formErrors.password.msg = 'Minimum password length is 4!';
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
        errors.value = e.response.data.errors;
        console.log(e.response.data.errors);
    }
}
</script>

<style scoped>

</style>