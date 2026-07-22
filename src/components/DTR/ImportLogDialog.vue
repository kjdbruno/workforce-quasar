<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">daily time records</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <q-file
                    v-model="file"
                    label="Select xlsx file"
                    accept=".xlsx,.xls"
                    outlined
                    use-chips
                >
                    <template v-slot:prepend>
                        <q-icon name="attach_file" />
                    </template>
                </q-file>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null) }" outline/>
                </div>
            </q-card-actions>
            <q-inner-loading :showing="SubmitLoading">
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
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive, computed } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import { Toast } from 'src/boot/sweetalert'; 
import { useDTRStore } from 'src/stores/dtr-store';
const DTRStore = useDTRStore();

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

const file = ref(null);

const SubmitLoading = ref(false);

const PopulateData = () => {
    // LoadLog()
}

const Save = async () => {
    SubmitLoading.value = true;
    try {
        
        const formData = new FormData()
        formData.append('file', file.value)

        const response = await api.post(`/log/import`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.message}<div>
            `
        });
        emit('update:modelValue', null)
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
</script>