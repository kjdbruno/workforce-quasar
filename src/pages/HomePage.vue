<template>
    <div class="home-page">
        <div class="row q-col-gutter-md">
            <div class="col-9">
                <q-card class="card welcome-card no-shadow radius-sm">
                    <div class="row q-col-gutter-sm">
                        <div class="col-9">
                            <q-card-section class="q-pa-xl">
                                <div class="row q-gutter-sm q-mb-lg">
                                    <div class="col-8">
                                        <div class="text-body1 text-white text-capitalize">{{ greeting }}!</div>
                                        <div class="text-h5 text-white text-capitalize text-bold">{{ AuthStore.user?.name }}</div>
                                    </div>
                                    <div class="col">
                                        <div class="row q-col-gutter-xs items-center justify-start">
                                            <div>
                                                <q-avatar >
                                                    <img :src="weatherIcon"/>
                                                </q-avatar>
                                            </div>
                                            <div>
                                                <div class="text-caption text-white text-capitalize">{{ formattedDate  }}</div>
                                                <div class="text-body1 text-white text-capitalize text-bold">{{ weatherDescription }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-caption text-white text-uppercase">general information</div>
                                <div class="row q-gutter-sm">
                                    <div class="col">
                                        <div class="text-h6 text-white">{{ weather?.current_weather?.temperature }}{{ weather?.current_weather_units?.temperature }}</div>
                                        <div class="text-caption text-white text-capitalize">temperature</div>
                                    </div>
                                    <div class="col">
                                        <div class="text-h6 text-white">{{ weather?.current_weather?.winddirection }}{{ weather?.current_weather_units?.winddirection }}</div>
                                        <div class="text-caption text-white text-capitalize">wind direction</div>
                                    </div>
                                    <div class="col">
                                        <div class="text-h6 text-white">{{ weather?.current_weather?.windspeed }}{{ weather?.current_weather_units?.windspeed }}</div>
                                        <div class="text-caption text-white text-capitalize">wind speed</div>
                                    </div>
                                </div>
                            </q-card-section>
                        </div>
                        <div class="col-3">
                            <img
                                :src="AuthStore.user.role !== 'SuperAdmin' ? (AuthStore.employees[0]?.employee.photo.avatar) : '~assets/default.png'"
                                alt="Welcome"
                                />
                        </div>
                    </div>
                    <q-inner-loading :showing="WelcomeLoading" dark>
                        <q-spinner-puff />
                    </q-inner-loading>
                </q-card>
            </div>
            <div class="col-3">
                <q-card class="no-shadow radius-sm">
                    <q-card-section class="q-pa-none">
                        <q-date v-model="date" mask="YYYY-MM-DD" class="full-width no-shadow radius-sm"/>
                    </q-card-section>
                </q-card>
            </div>
        </div>
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
import { ref, reactive, onMounted, onBeforeMount } from 'vue';

import  { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore();

const WelcomeLoading = ref(false);
const date = ref(new Date().toISOString().split('T')[0]);

const greeting = ref('');
const formattedDate = ref('');
const weather = ref(null)
const weatherDescription = ref('')
const weatherIcon = ref('');

import Sunny from 'src/assets/icons/sunny.png';
import PartlyCloudy from 'src/assets/icons/partly-cloudy.png';
import Cloudy from 'src/assets/icons/cloudy.png';
import Foggy from 'src/assets/icons/foggy.png';
import LightRain from 'src/assets/icons/light_rain.png';
import HeavyRain from 'src/assets/icons/heavy-rain.png';
import Thunder from 'src/assets/icons/thunder.png';

const setGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) {
        greeting.value = 'Good Morning'
    } else if (hour < 18) {
        greeting.value = 'Good Afternoon'
    } else {
        greeting.value = 'Good Evening'
    }
}

const setDateInfo = () => {
    const now = new Date();
    formattedDate.value = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    })
}

const fetchWeather = async (lat, lon) => {
    WelcomeLoading.value = true;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    try {
        const response = await fetch(url)
        const data = await response.json()
        weather.value = data
        mapWeatherCode(data.current_weather.weathercode)
    } catch (error) {
        console.error('Weather fetch failed:', error)
    } finally {
        WelcomeLoading.value = false;
    }
}

const getLocationAndWeather = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords
            fetchWeather(latitude, longitude)
        },
            (err) => {
                console.warn('Location access denied:', err)
            }
        )
    }
}

function mapWeatherCode(code) {
    const mapping = {
        0: { desc: 'Clear sky', icon: Sunny },
        1: { desc: 'Mainly clear', icon: PartlyCloudy },
        2: { desc: 'Partly cloudy', icon: PartlyCloudy },
        3: { desc: 'Overcast', icon: Cloudy },
        45: { desc: 'Fog', icon: Foggy },
        48: { desc: 'Rime fog', icon: Foggy },
        51: { desc: 'Light drizzle', icon: LightRain },
        61: { desc: 'Light rain', icon: LightRain },
        71: { desc: 'Snow fall', icon: HeavyRain },
        80: { desc: 'Rain showers', icon: HeavyRain },
        95: { desc: 'Thunderstorm', icon: Thunder }
    }
    const result = mapping[code] || { desc: 'Unknown', icon: Cloudy }
    weatherDescription.value = result.desc
    weatherIcon.value = result.icon
}

const formatPhoto = (avatar) => {
    return `${process.env.VUE_APP_BACKEND_URL}${avatar}`
}

const PageLoading = ref(true);
onMounted(() => {
    setTimeout(() => {
        PageLoading.value = false
    }, 2000)
})

onBeforeMount(() => {
    setGreeting();
    setDateInfo();
    getLocationAndWeather();
    setInterval(setGreeting, 60000)
})
</script>