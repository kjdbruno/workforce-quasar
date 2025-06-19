<template>
    <div>
        <div class="q-gutter-md row q-col-gutter-md">
            <q-card v-for="(dt, index) in feedbacks" :key="index" @click="viewOffice(dt)" class="card col-xs-12 col-sm-4 col-md-3 col-lg-3 flex flex-center q-pa-md no-shadow cursor-pointer" square>
                <q-card-section class="text-center">
                    <div class="text-h5 text-uppercase">{{ dt.alias }}</div>
                    <div class="text-caption">{{ dt.name }}</div>
                </q-card-section>
                <q-card-actions>
                    <div>
                        <div class="text-h6">{{ formatPercentage(dt.averageSqdPercentage) }}</div>
                        <div class="text-caption text-uppercase text-grey">average rating</div>
                    </div>
                </q-card-actions>
            </q-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';

import { useFeedbackStore } from '../stores/feedback-store';

const FeedbackStore = useFeedbackStore();

const feedbacks = ref([]);
const details = ref(null);

const dialog = ref(false);

const getAllFeedbacks = async () => {
    try {
        const response = await api.get(`/feedback`);
        feedbacks.value = response.data;
    } catch (error) {
        console.error("Error fetching all feedbacks:", error);
    }
}

const formatPercentage = (value) => {
    return (value == null ? `0%` : `${value.toFixed(2)}%`);
}

const viewOffice = (dt) => {
    //
    FeedbackStore.details = dt;
    FeedbackStore.component = 'FeedbackOfficeComponent';
}

onMounted(() => {
    getAllFeedbacks()
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
</style>