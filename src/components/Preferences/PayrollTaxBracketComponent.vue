<template>
    <div>
        <div class="q-gutter-sm row q-col-gutter-sm">
            <q-card key="data-add" class="card card-hover-animate col-xs-12 col-sm-4 col-md-3 col-lg-3 flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" v-ripple @click="NewDialog()">
                <q-card-section class="text-center">
                    <q-avatar size="75px" font-size="52px" color="grey" text-color="white" icon="add" />
                </q-card-section>
            </q-card>
            <q-card v-for="(data, index) in rows" :key="`data-${data.id}`" class="card card-hover-animate custom-anim col-xs-12 col-sm-4 col-md-3 col-lg-3 flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" :style="{ animationDelay: `${index * 120}ms` }">
                <q-card-section class="text-center">
                    <div class="text-subtitle2 text-uppercase">{{ data.name }}</div>
                </q-card-section>
                <q-card-section>
                    <div class="text-caption text-grey">{{ data.alias }}</div>
                </q-card-section>
                <div class="card-overlay absolute-full flex flex-center text-center">
                    <div class="q-gutter-xs">
                        <q-btn unelevated size="xs" color="primary" label="more" @click="ModifyDialog(data)" />
                    </div>
                </div>
                <div class="absolute-top-left q-ma-sm" style="width: 7px; height: 7px; border-radius: 50%;" :class="data.isActive ? 'bg-positive' : 'bg-negative'" />
            </q-card>
        </div>
        <q-page-sticky position="bottom-left" :offset="[18, 18]">
            <q-card class="no-shadow radius-xs">
                <q-card-section>
                    <q-input outlined dense debounce="1000" v-model="filter" placeholder="Search...">
                        <template v-slot:before>
                            <q-btn unelevated size="sm" round color="primary" icon="arrow_back" :disable="page <= 1" @click="PreviousPage">
                                <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Previous</q-tooltip>
                            </q-btn>
                            <q-btn v-if="rows.length" unelevated size="sm" round color="primary" :label="meta.CurrentPage" outline>
                                <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Current Page</q-tooltip>
                            </q-btn>
                            <q-btn v-if="rows.length" unelevated size="sm" round color="primary" :label="meta.TotalPages" outline>
                                <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Total Page</q-tooltip>
                            </q-btn>
                            <q-btn unelevated size="sm" round color="primary" icon="arrow_forward" :disable="page >= meta.TotalPages" @click="NextPage">
                                <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Next</q-tooltip>
                            </q-btn>
                        </template>
                        <template v-slot:prepend>
                            <q-icon name="search" style="font-size: 1rem;" />
                        </template>
                    </q-input>
                </q-card-section>
            </q-card>
        </q-page-sticky>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-card class="no-shadow radius-xs q-pa-md" v-if="loading">
                <q-card-section class="text-center">
                    <q-spinner-puff size="md"/>
                    <div class="text-caption text-grey text-uppercase q-mt-md">we're working on it!</div>
                </q-card-section>
            </q-card>
        </q-page-sticky>
        <q-dialog v-model="dialog" full-height position="right" persistent>
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">{{ isEdit ? 'modify tax code' : 'create new tax code' }}</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg">
                    <div>
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-3">
                                <q-input v-model="name" outlined label="Name" :error="formErrors.name.type"/>
                            </div>
                            <div class="col-2">
                                <q-input v-model="alias" outlined label="Alias" :error="formErrors.alias.type"/>
                            </div>
                        </div>
                    </div>
                </q-card-section>
                
                <q-card-section>
                    <div class="q-gutter-sm">
                        <q-btn v-if="!isEdit || isActive" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
                        <q-btn v-if="isEdit" unelevated size="md" color="primary" class="btn text-capitalize" :label="isActive ? 'disable' : 'enable'" @click="Toggle"/>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { dialog = false; }" outline/>
                    </div>
                </q-card-section>
                <q-inner-loading :showing="submitLoading">
                    <div class="text-center">
                        <q-spinner-puff size="md"/>
                        <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                    </div>
                </q-inner-loading>
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
    ref, 
    watch
} from 'vue';

import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

const PreferenceStore = usePreferenceStore();

const dialog = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);

const id = ref('');
const name = ref('');
const alias = ref('');
const isActive = ref(false);

const errors = ref([]);

const formErrors = reactive({
    name: { 
        type: null 
    },
    alias: {
        type: null
    }
});

const showErrors = (errorsList) => {

    let errorHtml = "";
    const grouped = errorsList.reduce((acc, err) => {
        const field = err.path || err.field || "Field";
        const msg = err.msg || err.message || "";
        const cleanMsg = msg
        .replace(new RegExp(`^${field}\\s*`, "i"), "")
        .trim();
        if (!acc[cleanMsg]) acc[cleanMsg] = [];
        acc[cleanMsg].push(field.charAt(0).toUpperCase() + field.slice(1));
        return acc;
    }, {});
    for (const [msg, fields] of Object.entries(grouped)) {
        const fieldList =
        fields.length > 1
            ? fields.slice(0, -1).join(" and ") + " and " + fields.slice(-1)
            : fields[0];
        errorHtml += `<div class="text-caption text-negative">${fieldList} ${msg}</div>`;
    }
    Toast.fire({
        icon: "error",
        html: `
            <div class="text-h6 text-bold text-uppercase">Request Failed</div>
            ${errorHtml}
        `,
    });
};

const formValidations = () => {

    errors.value = [];
    let isError = false;

    if (!name.value) {
        formErrors.name.type = true
        errors.value.push({ field: 'Name', msg: 'is required' })
        isError = true
    } else {
        formErrors.name.type = null
    }
    if (!alias.value) {
        formErrors.alias.type = true
        errors.value.push({ field: 'Alias', msg: 'is required' })
        isError = true
    } else {
        formErrors.alias.type = null
    }

    if (isError) showErrors(errors.value)

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
        const { data } = await api.get(`/taxcode`, {
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

const NewDialog = () => {
    ResetForm();
    dialog.value = true;
    isEdit.value = false;
}

const ModifyDialog = (data) => {
    ResetForm();
    dialog.value = true;
    isEdit.value = true;
    id.value = data.id;
    name.value = data.name;
    alias.value = data.alias;
    isActive.value = (data.isActive ? true : false);
}

const ResetForm = () => {
    id.value = '';
    name.value = '';
    alias.value = '';
    isActive.value = false;
    formErrors.name.type = null;
    formErrors.alias.type = null;
}

const Save = async () => {

    if (!formValidations()) return;
    submitLoading.value = true;
    try {
        const response = id.value && isEdit
            ? await api.post(`/taxcode/${id.value}/update`, {
                name: name.value,
                alias: alias.value
            })
            : await api.post('/taxcode', {
                name: name.value,
                alias: alias.value
            });
        if (id.value && isEdit) {
            UpdateList(response.data.taxcode);
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

        const rawErrors = e.response?.data?.errors || []
        if (rawErrors.length) {
            const mappedErrors = rawErrors.map(err => ({
                field: err.path
                    ? err.path.charAt(0).toUpperCase() + err.path.slice(1)
                    : "Field",
                msg: err.msg
            }))
            showErrors(mappedErrors, "Request Failed")
        } else {
            Toast.fire({
                icon: "error",
                html: `
                    <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                    <div class="text-caption">Something went wrong. Please try again.</div>
                `
            })
        }

    } finally {

        ResetForm();
        dialog.value = false;
        submitLoading.value = false;

    }
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
            ? await api.post(`/taxcode/${id.value}/disable`)
            : await api.post(`/taxcode/${id.value}/enable`)

        UpdateList(response.data.taxcode)
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.message}<div>
            `
        });

    } catch (e) {
        
        const rawErrors = e.response?.data?.errors || e.response?.data?.message;
        if (rawErrors) {
            const mappedErrors = Array.isArray(rawErrors)
            ? rawErrors.map(err => ({
                field: err.path
                    ? err.path.charAt(0).toUpperCase() + err.path.slice(1)
                    : "",
                msg: err.msg
                }))
            : rawErrors;
            showErrors(mappedErrors, "Request Failed");
        } else {
            Toast.fire({
                icon: "error",
                html: `
                    <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                    <div class="text-caption">Something went wrong. Please try again.</div>
                `
            });
        }

    } finally {

        submitLoading.value = false;
        dialog.value = false;

    }
}

onMounted(() => {
    LoadAll();
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
}
.card-hover-animate {
    transition: border-color 0.3s ease, transform 0.2s ease;
}

.card-hover-animate:hover {
  transform: scale(1.02); /* optional zoom effect */
}

.card-overlay {
    backdrop-filter: blur(6px);
    background: rgba(255, 255, 255, 0.6);
    opacity: 0;
    transition: opacity 0.5s ease;
}
.card:hover .card-overlay {
    opacity: 1;
}
/* Smooth fade + slide */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

@keyframes fadeSlideUp {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.9);
    }
    60% {
        opacity: 1;
        transform: translateY(-4px) scale(1.02);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.custom-anim {
    opacity: 0;
    animation: fadeSlideUp 0.6s ease-out forwards;
}
</style>