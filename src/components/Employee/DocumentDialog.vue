<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">document information</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div class="q-mb-lg">
                    <div class="row q-col-gutter-xs">
                        <div class="col-3">
                            <q-file 
                                v-model="file" 
                                label="Upload File"
                                outlined 
                                :error="Errors.file.type"
                                :no-error-icon="true"
                            />
                        </div>
                    </div>
                </div>
                <div class="card-grid">
                    <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-if="!SubmitLoading && rows.length === 0">
                        <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" >
                            <q-card-section class="text-center">
                                <div class="text-caption text-uppercase text-grey">no data found</div>
                            </q-card-section>
                        </q-card>
                    </div>
                    <div v-for="(app, index) in rows" :key="`data-${app.id}`" class="card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }" @click="ViewDocument(app)" v-else>
                        <q-card class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" >
                            <q-card-section class="text-center full-width">
                                <div class="text-subtitle2 text-uppercase">{{ app?.filename }}</div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="SaveProfile()" />
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null); }" outline/>
                </div>
            </q-card-actions>
            <q-inner-loading :showing="SubmitLoading">
                <div class="text-center">
                    <q-spinner-puff size="md"/>
                    <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                </div>
            </q-inner-loading>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive, computed } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import { Toast } from 'src/boot/sweetalert'; 
import { useEmployeeStore } from 'src/stores/employee-store'
const EmployeeStore = useEmployeeStore();

const props = defineProps({
    modelValue: String,
    dialogName: String
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
    get: () => props.modelValue === props.dialogName,
    set: (val) => {
        if (!val) emit('update:modelValue', null)
    }
})

const SubmitLoading = ref(false);
const rows = ref([]);

const file = ref('');

const GetDocument = async (id) => {
    SubmitLoading.value = true;
    try {
        const response = await api.get(`/employee/document`, {
            params: { 
                id: id
            }
        });
        rows.value = response.data.record

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
        SubmitLoading.value = false;
    }
}

const PopulateData = () => {
    GetDocument(EmployeeStore.data?.id)
}

const Errors = reactive({
    file: { type: null, msg: '' },
})

const Validations = () => {

    let isError = false;

    if (!file.value) {
        Errors.file.type = true;
        Errors.file.msg = ('file is required');
        isError = true;
    } else {
        Errors.file.type = null;
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

const ViewDocument = (app) => {
    const file = `${process.env.VUE_APP_BACKEND_URL}${app.document}`;
    window.open(file, '_blank');
}

</script>

<style scoped lang="css">
    .card
    {
        box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px !important;
    }
</style>