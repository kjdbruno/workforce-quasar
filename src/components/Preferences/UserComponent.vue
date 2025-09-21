<template>
    <div>
        <transition-group name="fade-slide" tag="div" class="q-gutter-md row q-col-gutter-md">
            <q-card v-for="(data, index) in filteredUsers" :key="index" class="card col-xs-12 col-sm-4 col-md-3 col-lg-3 flex flex-center q-pa-md no-shadow cursor-pointer radius-sm">
                <q-card-section class="text-center">
                    <div class="text-body1 text-uppercase">{{ data.name }}</div>
                </q-card-section>
                <q-card-actions>
                    <div class="text-caption">{{ data.level }}</div>
                </q-card-actions>
                <div class="card-overlay absolute-full flex flex-center text-center">
                    <div class="q-gutter-xs">
                        <q-btn v-if="data.isActive" unelevated size="sm" round color="primary" icon="edit" @click="() => { dialog = true; isEdit = true; OpenDialog(data); }">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">modify</q-tooltip>
                        </q-btn>
                        <q-btn v-if="data.isActive" unelevated size="sm" round color="primary" icon="delete">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">disable</q-tooltip>
                        </q-btn>
                        <q-btn v-if="!data.isActive" unelevated size="sm" round color="primary" icon="check">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">enable</q-tooltip>
                        </q-btn>
                    </div>
                </div>
            </q-card>
        </transition-group>
        <q-page-sticky position="bottom-left" :offset="[18, 18]">
            <q-card class="no-shadow radius-xs">
                <q-card-section>
                    <q-input outlined dense debounce="300" v-model="filter" placeholder="Search...">
                        <template v-slot:before>
                            <q-btn unelevated size="sm" round color="primary" icon="arrow_back" :disable="page <= 1" @click="PreviousPage">
                                <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Previous</q-tooltip>
                            </q-btn>
                            <q-btn unelevated size="sm" round color="primary" :label="meta.CurrentPage" outline>
                                <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Current Page</q-tooltip>
                            </q-btn>
                            <q-btn unelevated size="sm" round color="primary" :label="meta.TotalPages" outline>
                                <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Total Page</q-tooltip>
                            </q-btn>
                            <q-btn unelevated size="sm" round color="primary" icon="arrow_forward" :disable="page >= meta.TotalPages" @click="NextPage">
                                <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Next</q-tooltip>
                            </q-btn>
                        </template>
                        <template v-slot:prepend>
                            <q-icon name="search" style="font-size: 1rem;" />
                        </template>
                        <template v-slot:after>
                            <q-btn unelevated size="md" color="primary" label="new record" @click="() => { dialog = true; isEdit = false; OpenDialog() }" />
                        </template>
                    </q-input>
                </q-card-section>
            </q-card>
        </q-page-sticky>
        <q-dialog v-model="dialog" full-height position="right" persistent>
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">{{ isEdit ? 'modify user' : 'create new user' }}</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg">
                    <div>
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-3">
                                <q-select outlined v-model="level" emit-value map-options use-input input-debounce="300" :options="filteredLevels" label="Choose Level" @filter="filterLevel">
                                    <template v-slot:option="scope">
                                        <q-item v-bind="scope.itemProps">
                                            <q-item-section>
                                                <q-item-label class="text-uppercase">{{ scope.opt.label }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </template>
                                </q-select>
                            </div>
                            <div class="col-6">
                                <q-input v-if="level == 'Management'" v-model="name" outlined label="Name" />
                                <q-select v-if="level == 'Employee'" outlined v-model="employee" emit-value map-options use-input fill-input input-debounce="300" :options="filteredEmployees" label="Choose Employee" @filter="filterEmployee">
                                    <template v-slot:option="scope">
                                        <q-item v-bind="scope.itemProps">
                                            <q-item-section>
                                                <q-item-label class="text-uppercase">{{ scope.opt.label }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </template>
                                </q-select>
                            </div>
                        </div>
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-3">
                                <q-select outlined v-model="roleId" emit-value map-options :options="filteredRoles" label="Choose Role" fill-input input-debounce="300" @filter="filterRole"/>
                            </div>
                            
                            <div class="col-3">
                                <q-select outlined v-model="roleId" emit-value map-options :options="filteredDepartments" label="Choose Department" @filter="filterDepartment"/>
                            </div>
                        </div>
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-3">
                                <q-input v-model="employeeNo" outlined label="Employee No." autofocus />
                            </div>
                            <div class="col-3">
                                <q-input v-model="name" outlined label="Name" />
                            </div>
                            <div class="col-3">
                                <q-input v-model="name" outlined label="Name" />
                            </div>
                        </div>
                    </div>
                </q-card-section>
                
                <q-card-section>
                    <div class="q-gutter-sm">
                        <q-btn unelevated size="md" color="primary" class="text-capitalize" label="save" @click="Save" />
                        <q-btn unelevated size="md" color="primary" class="text-capitalize" label="discard" @click="() => { dialog = false; }" outline/>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
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
    ref 
} from 'vue';

import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

const PreferenceStore = usePreferenceStore();

const dialog = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);
const toggleLoading = ref(false);

const id = ref('');
const employeeNo = ref('');
const name = ref('');
const username = ref('');
const password = ref('');
const roleId = ref('');
const level = ref('');
const avatar = ref('');

const errors = ref([]);

const formErrors = reactive({
    employeeNo: { 
        type: null 
    },
    name: { 
        type: null 
    },
    username: { 
        type: null 
    },
    password: { 
        type: null 
    },
    roleId: {
        type: null
    },
    level: {
        type: null
    },
    avatar: {
        type: null
    }
});

const formValidations = () => {

    errors.value = [];

    let isError = false;

    if (!employeeNo.value) {
        formErrors.employeeNo.type = true
        errors.value.push({
            type: 'field',
            value: employeeNo.value,
            msg: 'This field is required',
            path: 'employeeNo',
            location: 'body'
        });
        isError = true;
    } else {
        formErrors.employeeNo.type = null
    }

    if (!name.value) {
        formErrors.name.type = true
        errors.value.push({
            type: 'field',
            value: name.value,
            msg: 'This field is required',
            path: 'name',
            location: 'body'
        });
        isError = true;
    } else {
        formErrors.name.type = null
    }

    if (!username.value) {
        formErrors.username.type = true
        errors.value.push({
            type: 'field',
            value: username.value,
            msg: 'This field is required',
            path: 'username',
            location: 'body'
        });
        isError = true;
    } else {
        formErrors.username.type = null
    }

    if (!password.value) {
        formErrors.password.type = true
        errors.value.push({
            type: 'field',
            value: password.value,
            msg: 'This field is required',
            path: 'password',
            location: 'body'
        });
        isError = true;
    } else if (password.value.length < 4) {
        formErrors.password.type = true;
        errors.value.push({
            type: 'field',
            value: password.value,
            msg: 'Password must be at least 4 characters long',
            path: 'password',
            location: 'body'
        });
        isError = true;
    } else {
        formErrors.password.type = null;
    }

    if (!roleId.value) {
        formErrors.roleId.type = true
        errors.value.push({
            type: 'field',
            value: roleId.value,
            msg: 'This field is required',
            path: 'roleId',
            location: 'body'
        });
        isError = true;
    } else {
        formErrors.roleId.type = null
    }

    if (!level.value) {
        formErrors.level.type = true
        errors.value.push({
            type: 'field',
            value: level.value,
            msg: 'This field is required',
            path: 'level',
            location: 'body'
        });
        isError = true;
    } else {
        formErrors.level.type = null
    }

    if (!avatar.value || !avatar.value.files || avatar.value.files.length === 0) {
        formErrors.avatar.type = true;
        errors.value.push({
            type: 'field',
            value: null,
            msg: 'This field is required',
            path: 'file',
            location: 'body'
        });
        isError = true;
    } else {
        const file = avatar.value.files[0];
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            formErrors.avatar.type = true;
            errors.value.push({
                type: 'field',
                value: avatar.value,
                msg: 'File size must not exceed 2MB',
                path: 'file',
                location: 'body'
            });
            isError = true;
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            formErrors.avatar.type = true;
            errors.value.push({
                type: 'field',
                value: avatar.value,
                msg: 'Only JPG, PNG, or PDF files are allowed',
                path: 'file',
                location: 'body'
            });
            isError = true;
        }
    }

    return !isError
}

const users = ref([]);

const meta = ref({});
const page = ref(1);
const limit = ref(15);
const loading = ref(false);

const filter = ref('');

const LoadAllUsers = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/user`, {
            params: { 
                Page: page.value, 
                Limit: limit.value 
            }
        });
        users.value = data.data
        meta.value = data.meta
    } catch (error) {
        console.error("Error fetching all users:", error);
    } finally {
        loading.value = false
    }
}

const filteredUsers = computed(() => {
    let data = users.value
    if (filter.value) {
        data = data.filter(v =>
            v.name.toLowerCase().includes(filter.value.toLowerCase()) ||
            v.username.toLowerCase().includes(filter.value.toLowerCase())
        )
    }
    return data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const NextPage = () => {
    if (page.value < meta.value.TotalPages) {
        page.value++
        LoadAllUsers()
    }
}

const PreviousPage = () => {
    if (page.value > 1) {
        page.value--
        LoadAllUsers()
    }
}

const OpenDialog = (data) => {
    ResetForm();
    if (isEdit) {
        id.value = data.id;
        employeeNo.value = data.employeeNo;
        name.value = data.name;
        username.value = data.username;
        roleId.value = data.roleId;
        level.value = data.level;
        avatar.value = data.avatar;
    }
}

const ResetForm = () => {
    id.value = '';
    employeeNo.value = '';
    name.value = '';
    username.value = '';
    password.value = '';
    roleId.value = '';
    level.value = '';
    avatar.value = '';
    formErrors.employeeNo.type = null;
    formErrors.name.type = null;
    formErrors.username.type = null;
    formErrors.password.type = null;
    formErrors.roleId.type = null;
    formErrors.level.type = null;
    formErrors.avatar.type = null;
}

const Save = async () => {
    if (!formValidations()) return;
    submitLoading.value = true;
    try {
        const response = isEdit
            ? await api.post(`/user/${id.value}/update`, {
                employeeNo: employeeNo.value,
                name: name.value,
                username: username.value,
                password: password.value,
                roleId: roleId.value,
                level: level.value,
                avatar: avatar.value
            })
            : await api.post('/user', {
                employeeNo: employeeNo.value,
                name: name.value,
                username: username.value,
                password: password.value,
                roleId: roleId.value,
                level: level.value,
                avatar: avatar.value
            });
            (isEdit ? UpdateList(response.data.user) : PushList(response.data.user))
            ResetForm();
            Toast.fire({
                icon: "success",
                html: `
                    <div class="text-h6 text-bold text-uppercase">granted!</div>
                    <div class="text-caption;">${response.data.message}<div>
                `
            });
    } catch (e) {
        errors.value = [];
        errors.value = e.response.data.errors;
    } finally {
        submitLoading.value = false;
    }
}

const PushList = (data) => {
    users.value.push(data);
}

const UpdateList = (data) => {
    const index = users.value.findIndex(item => item.id === data.id)
    if (index !== -1) {
        users.value[index] = data
    }
}

const Toggle = async (data) => {
    toggleLoading.value = true;
    try {
        const response = data.isActive
            ? await api.post(`/user/${data.id}/disable`)
            : await api.post(`/user/${data.id}/enable`)
        UpdateList(response.data.user)
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption;">${response.data.message}<div>
            `
        });
    } catch (e) {
        console.log(e);
    } finally {
        toggleLoading.value = false;
    }
}

const levels = ref([
    { 
        label: 'Management', 
        value: 'Management' 
    },
    { 
        label: 'Employee', 
        value: 'Employee' 
    }
]);
const employees = ref([]);
const roles = ref([]);
const departments = ref([]);

const filteredRoles = ref(roles.value);
const filteredEmployees = ref(employees.value);
const filteredLevels = ref(levels.value);
const filteredDepartments = ref(departments.value);

const filterRole = (val, update) => {
    if (val === '') {
        update(() => {
            filteredRoles.value = roles.value
        })
        return
    }
    update(() => {
        const needle = val.toLowerCase()
        filteredRoles.value = roles.value.filter(v =>
            v.label.toLowerCase().includes(needle)
        )
    })
}

const filterEmployee = (val, update) => {
    if (val === '') {
        update(() => {
            filteredEmployees.value = employees.value
        })
        return
    }
    update(() => {
        const needle = val.toLowerCase()
        filteredEmployees.value = employees.value.filter(v =>
            v.label.toLowerCase().includes(needle)
        )
    })
}

const filterLevel = (val, update) => {
    if (val === '') {
        update(() => {
            filteredLevels.value = levels.value
        })
        return
    }
    update(() => {
        const needle = val.toLowerCase()
        filteredLevels.value = levels.value.filter(v =>
            v.label.toLowerCase().includes(needle)
        )
    })
}

const filterDepartment = (val, update) => {
    if (val === '') {
        update(() => {
            filteredDepartments.value = departments.value
        })
        return
    }
    update(() => {
        const needle = val.toLowerCase()
        filteredDepartments.value = departments.value.filter(v =>
            v.label.toLowerCase().includes(needle)
        )
    })
}

const LoadOptions = async () => {
    try {
        const response = await api.get(`/option`);

    } catch (error) {
        console.error("Error fetching all options:", error);
    } finally {

    }
}

onMounted(() => {
    LoadAllUsers();
    LoadOptions();
})

</script>

<style scoped>
.card {
    height: 250px;
    width: 225px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    overflow: hidden;
}
.card-overlay {
    backdrop-filter: blur(6px);
    background: rgba(255, 255, 255, 0.4);
    opacity: 0;
    transition: opacity 0.5s ease;
}

.card:hover .card-overlay {
  opacity: 1;
}
/* Smooth fade + slide */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.4s ease;
}
.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
}
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-15px) scale(0.98);
}
</style>