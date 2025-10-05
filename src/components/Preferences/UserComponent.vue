<template>
    <div>
        <div class="card-grid">
            <div class="card-anim-wrapper">
                <q-card
                    key="data-add"
                    class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm"
                    v-ripple
                    @click="NewDialog()"
                >
                    <q-card-section class="text-center">
                        <q-avatar size="75px" font-size="52px" color="grey" text-color="white" icon="add" />
                    </q-card-section>
                </q-card>
            </div>
            
            <div
                v-for="(data, index) in rows"
                :key="`data-${data.id}`"
                class="card-anim-wrapper"
                :style="{ animationDelay: `${index * 120}ms` }"
            >
                <q-card
                    @click="ModifyDialog(data)"
                    class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm"
                    v-ripple
                    >
                    <q-card-section class="text-center full-width">
                        <div class="text-subtitle2 text-uppercase">{{ formatName(data.profile) }}</div>
                    </q-card-section>
                    <q-card-section class="full-width">
                        <div class="text-caption text-uppercase">{{ data.role?.name }}</div>
                        <div class="text-caption text-grey">{{ data.level }}</div>
                    </q-card-section>
                    <div
                        class="absolute-top-left q-ma-sm"
                        style="width: 7px; height: 7px; border-radius: 50%;"
                        :class="data.isActive ? 'bg-positive' : 'bg-negative'"
                    ></div>
                </q-card>
            </div>
        </div>
        <q-dialog v-model="dialog" full-height position="right" persistent square>
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">{{ isEdit ? 'modify user' : 'create new user' }}</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-3">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">search employee</span>
                                <q-icon
                                    :name="Errors.profileId.type ? 'error' : 'info'"
                                    :color="Errors.profileId.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.profileId.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.profileId.type">
                                            <div 
                                                v-for="(msg, i) in Errors.profileId.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-select 
                                outlined 
                                v-model="profileId" 
                                emit-value 
                                map-options 
                                use-input 
                                input-debounce="300" 
                                :options="filteredProfiles" 
                                @filter="filterProfileFn" 
                                :error="Errors.profileId.type"
                                hide-dropdown-icon
                                :no-error-icon="true"
                                clearable
                            >
                            </q-select>
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-2">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">username</span>
                                <q-icon
                                    :name="Errors.username.type ? 'error' : 'info'"
                                    :color="Errors.username.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.username.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.username.type">
                                            <div 
                                                v-for="(msg, i) in Errors.username.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-input 
                                v-model="username" 
                                outlined 
                                :error="Errors.username.type" 
                                :no-error-icon="true"
                            />
                        </div>
                        <div class="col-2">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">password</span>
                                <q-icon
                                    :name="Errors.password.type ? 'error' : 'info'"
                                    :color="Errors.password.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.password.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.password.type">
                                            <div 
                                                v-for="(msg, i) in Errors.password.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-input 
                                v-model="password" 
                                :type="showPassword ? 'text' : 'password'"
                                outlined 
                                :error="Errors.password.type" 
                                :no-error-icon="true"
                            >
                                <template v-slot:append>
                                    <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="showPassword = !showPassword" style="font-size: 1rem;" />
                                </template>
                            </q-input>
                        </div>
                    </div>
                    <div class="q-mb-md">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">access level</span>
                            <q-icon
                                :name="Errors.level.type ? 'error' : 'info'"
                                :color="Errors.level.type ? 'negative' : 'grey'"
                                class="cursor-pointer"
                                size="xs"
                            >
                                <q-tooltip anchor="top middle" self="center middle" :class="Errors.level.type ? 'bg-negative' : 'bg-grey'">
                                    <template v-if="Errors.level.type">
                                        <div 
                                            v-for="(msg, i) in Errors.level.messages" 
                                            :key="i" 
                                            class="text-capitalize"
                                        >
                                            <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="text-capitalize">
                                            <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                        </div>
                                    </template>
                                </q-tooltip>
                            </q-icon>
                        </div>
                        <q-radio v-model="level" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Management" label="Management"  class="text-uppercase" />
                        <q-radio v-model="level" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Employee" label="Employee"  class="text-uppercase" />
                    </div>
                    <div class="q-mb-md">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">user role</span>
                            <q-icon
                                :name="Errors.level.type ? 'error' : 'info'"
                                :color="Errors.level.type ? 'negative' : 'grey'"
                                class="cursor-pointer"
                                size="xs"
                            >
                                <q-tooltip anchor="top middle" self="center middle" :class="Errors.level.type ? 'bg-negative' : 'bg-grey'">
                                    <template v-if="Errors.level.type">
                                        <div 
                                            v-for="(msg, i) in Errors.level.messages" 
                                            :key="i" 
                                            class="text-capitalize"
                                        >
                                            <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="text-capitalize">
                                            <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                        </div>
                                    </template>
                                </q-tooltip>
                            </q-icon>
                        </div>
                        <q-radio 
                            v-for="(v, index) in roles" 
                            v-model="roleId" 
                            checked-icon="task_alt" 
                            unchecked-icon="panorama_fish_eye" 
                            :val="v.value" 
                            :label="v.label" 
                            class="text-uppercase" 
                            :disable="isDisabled(v.value)"
                        />
                    </div>
                </q-card-section>
                
                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <q-btn v-if="!isEdit || isActive" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
                        <q-btn v-if="isEdit" unelevated size="md" color="primary" class="btn text-capitalize" :label="isActive ? 'disable' : 'enable'" @click="Toggle"/>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { dialog = false; }" outline/>
                    </div>
                </q-card-actions>
                <q-inner-loading :showing="submitLoading">
                    <div class="text-center">
                        <q-spinner-puff size="md"/>
                        <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                    </div>
                </q-inner-loading>
            </q-card>
        </q-dialog>
        <q-footer class="bg-white no-shadow q-mx-lg q-mb-md q-py-sm radius-xs text-grey">
            <q-toolbar>
                <q-toolbar-title class="text-caption text-uppercase">
                    <div>© 2025 WORKFORCE. All Rights Reserved.</div>
                </q-toolbar-title>
                <q-input outlined dense debounce="1000" v-model="filter" placeholder="Search...">
                    <template v-slot:before>
                        <div class="text-caption text-uppercase">{{ `page ${meta.CurrentPage} of ${meta.TotalPages}` }}</div>
                    </template>
                    <template v-slot:after>
                        <q-btn unelevated size="xs" round color="primary" icon="first_page" :disable="page <= 1" @click="FirstPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">First Page</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="xs" round color="primary" icon="arrow_back" :disable="page <= 1" @click="PreviousPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Previous</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="xs" round color="primary" icon="arrow_forward" :disable="page >= meta.TotalPages" @click="NextPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Next</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="xs" round color="primary" icon="last_page" :disable="page >= meta.TotalPages" @click="LastPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Last Page</q-tooltip>
                        </q-btn>
                    </template>
                    <template v-slot:prepend>
                        <q-icon name="search" style="font-size: 1rem;" />
                    </template>
                </q-input>
                <q-inner-loading :showing="loading">
                    <q-spinner-puff size="md" />
                </q-inner-loading>
            </q-toolbar>
        </q-footer>
    </div>
</template>

<script setup>
import { 
    usePreferenceStore 
} from 'src/stores/preference-store';

import { 
    reactive,
    computed,
    onMounted,
    ref, 
    watch
} from 'vue';

import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

const PreferenceStore = usePreferenceStore();

const dialog = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);
const showPassword = ref(false);

const id = ref('');
const profileId = ref('');
const username = ref('');
const password = ref('');
const roleId = ref('');
const level = ref('');
const isActive = ref(false);

const Errors = reactive({
    profileId: { 
        type: null, messages: []
    },
    username: {
        type: null, messages: []
    },
    password: {
        type: null, messages: []
    },
    roleId: {
        type: null, messages: []
    },
    level: {
        type: null, messages: []
    }
});

const Validations = () => {

    let isError = false;

    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].messages = [];
    });

    if (!profileId.value) {
        Errors.profileId.type = true;
        Errors.profileId.messages.push('Employee is required')
        isError = true
    } else {
        Errors.profileId.type = null
    }

    if (!username.value) {
        Errors.username.type = true;
        Errors.username.messages.push('Username is required')
        isError = true
    } else {
        Errors.username.type = null
    }

    if (isEdit) {
        if (!password.value) {
            Errors.password.type = true;
            Errors.password.messages.push('Password is required')
            isError = true
        } else {
            Errors.password.type = null
        }
    }

    if (!roleId.value) {
        Errors.roleId.type = true;
        Errors.roleId.messages.push('Role is required')
        isError = true
    } else {
        Errors.roleId.type = null
    }

    if (!level.value) {
        Errors.level.type = true;
        Errors.level.messages.push('Level is required')
        isError = true
    } else {
        Errors.level.type = null
    }

    if (isError) {
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                <div class="text-caption">Something went wrong.</div>
            `
        })
    }

    return !isError
}

const rows = ref([]);

const meta = ref({});
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

const filter = ref('');

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/user`, {
            params: { 
                Page: page.value, 
                Limit: limit.value,
                Filter: filter.value || ''
            }
        });
        rows.value = data.data;
        meta.value = data.meta;

        if (!rows.value.length) {
            Toast.fire({
                icon: "info",
                html: `
                <div class="text-h6 text-bold text-uppercase">Notice</div>
                <div class="text-caption text-capitalize;">No records found!</div>
                `
            });
        }
    } catch (error) {
        console.error("Error fetching all data:", error);
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">Error</div>
                <div class="text-caption text-capitalize;">Unable to fetch records</div>
            `
        });
    } finally {
        loading.value = false;
    }
}

watch(filter, () => {
    page.value = 1;
    LoadAll();
})

const NextPage = () => {
    if (page.value < meta.value.TotalPages) {
        page.value++
        LoadAll()
    }
}

const PreviousPage = () => {
    if (page.value > 1) {
        page.value--
        LoadAll()
    }
}

const FirstPage = () => {
    if (page.value > 1) {
        page.value = 1
        LoadAll()
    }
}

const LastPage = () => {
    if (page.value < meta.value.TotalPages) {
        page.value = meta.value.TotalPages
        LoadAll()
    }
}


const NewDialog = () => {
    ResetForm();
    dialog.value = true;
    isEdit.value = false;
    LoadProfile();
    LoadRole();
}

const ModifyDialog = async (data) => {
    ResetForm();
    dialog.value = true;
    isEdit.value = true;
    id.value = data.id;
    if (!profiles.value.length) {
        await LoadProfile();
    }
    filteredProfiles.value = [...profiles.value];
    profileId.value = profiles.value.find(p => p.value === data.profileId)?.value || null;
    username.value = data.username;
    if (!roles.value.length) {
        await LoadRole();
    }
    roleId.value = data.roleId;
    level.value = data.level;
    isActive.value = (data.isActive ? true : false);
}

const ResetForm = () => {
    id.value = '';
    profileId.value = '';
    username.value = '';
    password.value = '';
    roleId.value = '';
    level.value = '';
    isActive.value = false;
    Errors.profileId.type = null;
    Errors.username.type = null;
    Errors.password.type = null;
    Errors.roleId.type = null;
    Errors.level.type = null;
}

const Save = async () => {
    if (!Validations()) return;
    submitLoading.value = true;
    try {
        const response = id.value && isEdit
            ? await api.post(`/user/${id.value}/update`, {
                profileId: profileId.value,
                username: username.value,
                password: password.value,
                roleId: roleId.value,
                level: level.value
            })
            : await api.post('/user', {
                profileId: profileId.value,
                username: username.value,
                password: password.value,
                roleId: roleId.value,
                level: level.value
            });
        dialog.value = false;
        if (id.value && isEdit) {
            UpdateList(response.data.user);
        } else {
            LoadAll();
        }
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.message}<div>
            `
        });
    } catch (e) {
        if (e.response && e.response.data) {
            applyBackendErrors(e.response.data);
            Toast.fire({
                icon: "error",
                html: `
                    <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                    <div class="text-caption">Something went wrong.</div>
                `
            })
        }
    } finally {
        submitLoading.value = false;
    }
}

const applyBackendErrors = (backendErrors) => {

    const errorsArray = Array.isArray(backendErrors)
        ? backendErrors
        : backendErrors?.errors || []
        
    Object.keys(Errors).forEach(key => {
        Errors[key].type = null
        Errors[key].messages = []
    })
    
    errorsArray.forEach(err => {
        if (Errors[err.path] !== undefined) {
            Errors[err.path].type = true
            Errors[err.path].messages.push(err.msg)
        }
    })
}

const UpdateList = (data) => {
    const index = rows.value.findIndex(item => item.id === data.id)
    if (index !== -1) {
        rows.value[index] = data
    }
}

const Toggle = async () => {
    submitLoading.value = true;
    try {
        const response = isActive.value
            ? await api.post(`/user/${id.value}/disable`)
            : await api.post(`/user/${id.value}/enable`)
        dialog.value = false;
        UpdateList(response.data.user)
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.message}<div>
            `
        });
    } catch (e) {
        if (e.response && e.response.data) {
            applyBackendErrors(e.response.data);
            Toast.fire({
                icon: "error",
                html: `
                    <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                    <div class="text-caption">Something went wrong.</div>
                `
            })
        }
    } finally {
        submitLoading.value = false;
    }
}


const profiles = ref([]);
const roles = ref([]);

const createFilterFn = (sourceRef, targetRef) => {
    return (val, update) => {
        update(() => {
            if (!val) {
                targetRef.value = [];
            } else {
                const needle = val.toLowerCase().trim()
                targetRef.value = sourceRef.value
                    .filter(v => (v.label ?? '').toLowerCase().includes(needle))
                    .slice(0, 5)
            }
        })
    }
}

const filteredProfiles = ref([]);
const filterProfileFn = createFilterFn(profiles, filteredProfiles);

const LoadProfile = async () => {
    try {
        const response = await api.get(`/option/profiles`);
        profiles.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
}

const LoadRole = async () => {
    try {
        const response = await api.get(`/option/roles`);
        roles.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
}

const formatName = (profile) => {
    if (!profile) return '';
    const firstname = profile.firstname || '';
    const middlename = profile.middlename
        ? profile.middlename.charAt(0).toUpperCase() + '.'
        : '';
    const lastname = profile.lastname || '';
    const suffix = profile.suffix ? ` ${profile.suffix}` : '';
    return `${firstname} ${middlename} ${lastname}${suffix}`.trim();
}

const isDisabled = (roleValue) => {
    if (roleValue === 1) return true
    if (level.value === 'Management') {
        return roleValue === 6
    } else if (level.value === 'Employee') {
        return roleValue >= 1 && roleValue <= 5
    }
    return false
}

watch(level, (val) => {
    if (val === 'Employee') {
        roleId.value = 6
    } else if (val === 'Management') {
        if (roleId.value === 6) roleId.value = null
    }
})

onMounted(() => {
    LoadAll();
})

</script>

<style scoped>

</style>