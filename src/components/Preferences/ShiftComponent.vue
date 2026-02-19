<template>
    <div>
        <div class="card-grid">
            <div class="card-anim-wrapper">
                <q-card key="data-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-ripple @click="NewDialog()">
                    <q-card-section>
                        <q-icon name="bi-plus-circle" size="xl" color="grey"/>
                    </q-card-section>
                </q-card>
            </div>
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-if="loading">
                <q-card key="data-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" >
                    <q-card-section>
                        <q-spinner-ios color="dark"/>
                        <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-else-if="!loading && rows.length === 0">
                <q-card key="data-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" >
                    <q-card-section>
                        <div class="text-caption text-uppercase text-grey">no data found</div>
                    </q-card-section>
                </q-card>
            </div>
            <div v-for="(data, index) in rows" :key="`data-${data.id}`" class="card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }">
                <q-card @click="ModifyDialog(data)" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-ripple>
                    <q-card-section>
                        <div class="text-subtitle2 text-uppercase">{{ data.name }}</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="text-caption text-grey text-uppercase">{{ FormatTimeRange(data?.start_time, data?.end_time) }}</div>
                    </q-card-section>
                    <div class="absolute-top-left q-ma-sm" style="width: 7px; height: 7px; border-radius: 50%;" :class="data.is_active ? 'bg-positive' : 'bg-negative'"></div>
                </q-card>
            </div>
        </div>
        <q-dialog v-model="dialog" full-height position="right" persistent square class="dialog">
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">{{ isEdit ? 'modify shift' : 'create new shift' }}</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-1">
                            <div class="text-caption text-uppercase" :class="Errors.code.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.code.type ? Errors.code.msg : 'code' }}</div>
                            <q-input 
                                v-model="code" 
                                label="Enter Code"
                                outlined 
                                :error="Errors.code.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="Errors.name.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.name.type ? Errors.name.msg : 'name' }}</div>
                            <q-input 
                                v-model="name" 
                                label="Enter Name"
                                outlined 
                                :error="Errors.name.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-2">
                            <div class="text-caption text-uppercase" :class="Errors.starttime.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.starttime.type ? Errors.starttime.msg : 'start time' }}</div>
                            <q-input outlined v-model="starttime" label="Enter Time" mask="time" :error="Errors.starttime.type" :no-error-icon="true">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                    <q-time v-model="starttime" mask="HH:mm">
                                        <div class="row items-center justify-end">
                                            <q-btn size="sm" v-close-popup label="Okay" color="primary" flat />
                                        </div>
                                    </q-time>
                                </q-popup-proxy>
                            </q-input>
                        </div>
                        <div class="col-2">
                            <div class="text-caption text-uppercase" :class="Errors.endtime.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.endtime.msg ? Errors.endtime.msg : 'end time' }}</div>
                            <q-input outlined v-model="endtime" label="Enter Time" mask="time" :error="Errors.endtime.type" :no-error-icon="true">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                    <q-time v-model="endtime" mask="HH:mm">
                                        <div class="row items-center justify-end">
                                            <q-btn size="sm" v-close-popup label="Okay" color="primary" flat />
                                        </div>
                                    </q-time>
                                </q-popup-proxy>
                            </q-input>
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-1">
                            <div class="text-caption text-uppercase" :class="Errors.breakminutes.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.breakminutes.type ? Errors.breakminutes.msg : 'break mins' }}</div>
                            <q-input 
                                v-model="breakminutes" 
                                label="Enter Minutes"
                                outlined 
                                :error="Errors.breakminutes.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                        <div class="col-1">
                            <div class="text-caption text-uppercase" :class="Errors.graceminutes.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.graceminutes.type ? Errors.graceminutes.msg : 'grace mins' }}</div>
                            <q-input 
                                v-model="graceminutes" 
                                label="Enter Minutes"
                                outlined 
                                :error="Errors.graceminutes.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                        <div class="col-1">
                            <div class="text-caption text-uppercase" :class="Errors.earliestminutes.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.earliestminutes.type ? Errors.earliestminutes.msg : 'earliest mins' }}</div>
                            <q-input 
                                v-model="earliestminutes" 
                                label="Enter Minutes"
                                outlined 
                                :error="Errors.earliestminutes.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                        <div class="col-1">
                            <div class="text-caption text-uppercase" :class="Errors.latestminutes.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.latestminutes.type ? Errors.latestminutes.msg : 'latest mins' }}</div>
                            <q-input 
                                v-model="latestminutes" 
                                label="Enter Minutes"
                                outlined 
                                :error="Errors.latestminutes.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey" >crosses midnight</div>
                        <q-checkbox right-label v-model="crossesmidnight" label="crosses midnight" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" class="text-capitalize" />
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase" :class="Errors.days.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.days.type ? Errors.days.msg : 'shift day/s' }}</div>
                        <div class="q-gutter-sm">
                            <q-checkbox right-label v-model="days" :val="1" label="monday" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" class="text-capitalize" />
                            <q-checkbox right-label v-model="days" :val="2" label="tuesday" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" class="text-capitalize" />
                            <q-checkbox right-label v-model="days" :val="3" label="wednesday" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" class="text-capitalize" />
                            <q-checkbox right-label v-model="days" :val="4" label="thursday" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" class="text-capitalize" />
                            <q-checkbox right-label v-model="days" :val="5" label="friday" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" class="text-capitalize" />
                            <q-checkbox right-label v-model="days" :val="6" label="saturday" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" class="text-capitalize" />
                            <q-checkbox right-label v-model="days" :val="7" label="sunday" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" class="text-capitalize" />
                        </div>
                    </div>
                </q-card-section>
                
                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <q-btn v-if="!isEdit || isActive" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save()" />
                        <q-btn v-if="isEdit" unelevated size="md" color="primary" class="btn text-capitalize" :label="isActive ? 'disable' : 'enable'" @click="Toggle"/>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { dialog = false; }" outline/>
                    </div>
                </q-card-actions>
                <q-inner-loading :showing="submitLoading">
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
                        <q-btn unelevated size="sm" round color="primary" icon="bi-arrow-bar-left" :disable="page <= 1" @click="FirstPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">First Page</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="sm" round color="primary" icon="bi-arrow-left-short" :disable="page <= 1" @click="PreviousPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Previous</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="sm" round color="primary" icon="bi-arrow-right-short" :disable="page >= meta.TotalPages" @click="NextPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Next</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="sm" round color="primary" icon="bi-arrow-bar-right" :disable="page >= meta.TotalPages" @click="LastPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Last Page</q-tooltip>
                        </q-btn>
                    </template>
                    <template v-slot:prepend>
                        <q-icon name="bi-search" style="font-size: 1rem;" />
                    </template>
                </q-input>
            </q-toolbar>
        </q-footer>
        <transition name="glass-fade">
            <div id="glass-overlay" v-show="PageLoading">
                <q-card class="no-shadow radius-md q-pa-md">
                    <q-card-section class="text-center">
                        <div>
                            <q-spinner-ios color="dark"/>
                        </div>
                        <div class="text-dark text-uppercase text-caption">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </div>
        </transition>
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
    watch,
    onBeforeMount
} from 'vue';

import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

const PreferenceStore = usePreferenceStore();

const dialog = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);

const id = ref('');
const code = ref('');
const name = ref('');
const starttime = ref('');
const endtime = ref('');
const breakminutes = ref('');
const graceminutes = ref('');
const earliestminutes = ref('');
const latestminutes = ref('');
const crossesmidnight = ref(false);
const days = ref([]);
const isActive = ref(false);

const Errors = reactive({
    code: { type: null, msg: '' },
    name: { type: null, msg: '' },
    starttime: { type: null, msg: '' },
    endtime: { type: null, msg: '' },
    breakminutes: { type: null, msg: '' },
    graceminutes: { type: null, msg: '' },
    earliestminutes: { type: null, msg: '' },
    latestminutes: { type: null, msg: '' },
    days: { type: null, msg: '' }
});

const Validations = () => {
    
    let isError = false;

    if (!code.value) { Errors.code.type = true; Errors.code.msg = 'required'; isError = true; } else { Errors.code.type = null; }
    if (!name.value) { Errors.name.type = true; Errors.name.msg = 'required'; isError = true; } else { Errors.name.type = null; }
    if (!starttime.value) { Errors.starttime.type = true; Errors.starttime.msg = 'required'; isError = true; } else { Errors.starttime.type = null; }
    if (!endtime.value) { Errors.endtime.type = true; Errors.endtime.msg = 'required'; isError = true; } else { Errors.endtime.type = null; }
    if (!breakminutes.value) { Errors.breakminutes.type = true; Errors.breakminutes.msg = 'required'; isError = true; } else { Errors.breakminutes.type = null; }
    if (!graceminutes.value) { Errors.graceminutes.type = true; Errors.graceminutes.msg = 'required'; isError = true; } else { Errors.graceminutes.type = null; }
    if (!earliestminutes.value) { Errors.earliestminutes.type = true; Errors.earliestminutes.msg = 'required'; isError = true; } else { Errors.earliestminutes.type = null; }
    if (!latestminutes.value) { Errors.latestminutes.type = true; Errors.latestminutes.msg = 'required'; isError = true; } else { Errors.latestminutes.type = null; }
    if (!days.value.length) { Errors.days.type = true; Errors.days.msg = 'required'; isError = true; } else { Errors.days.type = null; }

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
        const { data } = await api.get(`/shift`, {
            params: { 
                Page: page.value, 
                Limit: limit.value,
                Filter: filter.value || ''
            }
        });
        rows.value = data.data;
        meta.value = data.meta;
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
}

const ModifyDialog = (data) => {
    ResetForm();
    dialog.value = true;
    isEdit.value = true;
    id.value = data.id;
    code.value = data.code;
    name.value = data.name;
    starttime.value = data.start_time;
    endtime.value = data.end_time;
    breakminutes.value = data.break_minutes;
    graceminutes.value = data.grace_minutes;
    earliestminutes.value = data.earliest_minutes;
    latestminutes.value = data.latest_minutes;
    crossesmidnight.value = (data.crosses_midnight ? true : false);
    isActive.value = (data.is_active ? true : false);
    days.value = data.days.map(d => Number(d.day_of_week));
}

const ResetForm = () => {
    id.value = '';
    code.value = '';
    name.value = '';
    starttime.value = '';
    endtime.value = '';
    breakminutes.value = '';
    graceminutes.value = '';
    earliestminutes.value = '';
    latestminutes.value = '';
    crossesmidnight.value = false;
    isActive.value = false;
    days.value = [];
    ResetErrors()
}

const ResetErrors = () =>
    Object.values(Errors).forEach(e => {
        e.type = null;
        e.msg = null;
});

const Save = async () => {
    if (!Validations()) return;
    submitLoading.value = true;
    try {
        const response = id.value && isEdit
            ? await api.post(`/shift/${id.value}/update`, {
                code: code.value,
                name: name.value,
                starttime: starttime.value,
                endtime: endtime.value,
                breakminutes: breakminutes.value,
                graceminutes: graceminutes.value,
                earliestminutes: earliestminutes.value,
                latestminutes: latestminutes.value,
                crossesmidnight: crossesmidnight.value,
                days: days.value,
            })
            : await api.post('/shift', {
                code: code.value,
                name: name.value,
                starttime: starttime.value,
                endtime: endtime.value,
                breakminutes: breakminutes.value,
                graceminutes: graceminutes.value,
                earliestminutes: earliestminutes.value,
                latestminutes: latestminutes.value,
                crossesmidnight: crossesmidnight.value,
                days: days.value,
            });
        dialog.value = false;
        if (id.value && isEdit) {
            UpdateList(response.data.shift);
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
        Errors[key].msg = ''     // ✅ string
    })

    errorsArray.forEach(err => {
        if (Errors[err.path] !== undefined) {
            Errors[err.path].type = true
            Errors[err.path].msg = err.msg  // ✅ assign string
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
            ? await api.post(`/shift/${id.value}/disable`)
            : await api.post(`/shift/${id.value}/enable`)
        dialog.value = false;
        UpdateList(response.data.shift)
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

onBeforeMount(() => {
    LoadAll();
})

const FormatTimeRange = (start, end) => {
    if (!start || !end) return '';

    const format = (time) => {
        const [h, m] = time.split(':').map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);

        return d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return `${format(start)} - ${format(end)}`;
};

const PageLoading = ref(true);
onMounted(() => {
    setTimeout(() => {
        PageLoading.value = false
    }, 1000)
})

</script>

<style scoped>

</style>