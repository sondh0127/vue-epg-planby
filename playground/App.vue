<script lang="ts" setup>
// import type { Channel, Program, Theme } from '../dist'
// import { Epg, Layout, useEpg } from '../dist'
// import '../dist/style.css'
import { addDays, addHours, endOfDay, format, parseISO, secondsToHours, startOfDay, subDays } from 'date-fns'
import type { Channel, Program, Theme } from '../src/Epg'
import { Epg, Layout, TIME_FORMAT, formatTime, useEpg } from '../src/Epg'

import { fetchChannels, fetchEpg } from './helpers'

const darkTheme: Theme = {
  primary: {
    600: '#1a202c',
    900: '#171923',
  },
  grey: { 300: '#d1d1d1' },
  white: '#fff',
  green: {
    300: '#2C7A7B',
  },
  loader: {
    teal: '#5DDADB',
    purple: '#3437A2',
    pink: '#F78EB6',
    bg: '#171923db',
  },
  scrollbar: {
    border: '#ffffff',
    thumb: {
      bg: '#e1e1e1',
    },
  },

  gradient: {
    blue: {
      300: '#002eb3',
      600: '#002360',
      900: '#051937',
    },
  },

  text: {
    grey: {
      300: '#a0aec0',
      500: '#718096',
    },
  },

  timeline: {
    divider: {
      bg: '#718096',
    },
  },
}

const themeLight: Theme = {
  primary: {
    600: '#f7fafc',
    900: '#cbd5e0',
  },
  grey: { 300: '#2d3748' },
  white: '#1a202c',
  green: {
    300: '#2C7A7B',
  },
  loader: {
    teal: '#5DDADB',
    purple: '#3437A2',
    pink: '#F78EB6',
    bg: '#171923db',
  },
  scrollbar: {
    border: '#ffffff',
    thumb: {
      bg: '#718096',
    },
  },

  gradient: {
    blue: {
      300: '#a0aec0',
      600: '#e2e8f0',
      900: '#a0aec0',
    },
  },

  text: {
    grey: {
      300: '#2d3748',
      500: '#1a202c',
    },
  },

  timeline: {
    divider: {
      bg: '#1a202c',
    },
  },
}

const themeValue = ref('dark')
const options = [
  {
    label: 'Dark theme',
    value: 'dark',
  },
  {
    label: 'Light theme',
    value: 'light',
  },
]

const theme = computed(() => {
  return themeValue.value === 'dark' ? darkTheme : themeLight
})

const channels = ref<Channel[]>([])
const epg = ref<Program[]>([])
const isLoading = ref(false)

const date = ref(new Date())
const timeRange = ref([addHours(startOfDay(new Date()), 0), endOfDay(new Date())])

const startDate = computed({
  get() {
    const day = date.value
    const startTime = timeRange.value[0]
    day.setHours(startTime.getHours())
    day.setMinutes(startTime.getMinutes())
    day.setSeconds(startTime.getSeconds())
    return formatTime(day)
  },
  set(value) {
    // date.value = parseISO(value)
  },
})

const endDate = computed({
  get() {
    const day = date.value
    const endTime = timeRange.value[1]
    day.setHours(endTime.getHours())
    day.setMinutes(endTime.getMinutes())
    day.setSeconds(endTime.getSeconds())
    return formatTime(day)
  },
  set(value) {
    // date.value = parseISO(value)
  },
})

const itemHeight = ref(80)
const dayWidth = ref(7200)
const sidebarWidth = ref(100)
const isSidebar = ref(true)
const isTimeline = ref(true)
const isBaseTimeFormat = ref(false)

const _24hFormat = computed({
  get() {
    return !isBaseTimeFormat.value
  },
  set(value) {
    isBaseTimeFormat.value = !value
  },
})

const { getEpgProps, getLayoutProps, onScrollToNow } = useEpg({
  channels,
  epg,
  dayWidth,
  sidebarWidth,
  itemHeight,
  isSidebar,
  isTimeline,
  isLine: true,
  startDate,
  endDate,
  isBaseTimeFormat,
  theme,
})

async function fetchDate() {
  isLoading.value = true
  epg.value = await fetchEpg(
    format(subDays(date.value, 1), TIME_FORMAT.DATE),
    format(addDays(date.value, 0), TIME_FORMAT.DATE),
  )

  channels.value = await fetchChannels()
  isLoading.value = false
}

onMounted(async () => {
  await fetchDate()
})

watch(date, async () => {
  await fetchDate()
})

function disabledSeconds() {
  return Array.from({ length: 60 }, (_, i) => i)
}
</script>

<template>
  <div class="flex flex-wrap p-5px">
    <el-card class="w-full">
      <div class="flex items-center gap-5px">
        <el-form inline>
          <el-form-item label="Scroll to Now">
            <el-button class="" @click="onScrollToNow()">
              Now
            </el-button>
          </el-form-item>
          <el-form-item label="Item Height">
            <el-select v-model="themeValue" placeholder="Select theme">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Pick day">
            <el-date-picker v-model="date" type="date" placeholder="Pick a day" />
          </el-form-item>
          <el-form-item label="Time range">
            <el-time-picker
              v-model="timeRange"
              :disabled-seconds="disabledSeconds" is-range range-separator="To" start-placeholder="Start time"
              end-placeholder="End time"
            />
          </el-form-item>
          <el-form-item label="Item Height">
            <el-input-number v-model="itemHeight" :min="80" :max="200" :step="10" />
          </el-form-item>
          <el-form-item label="Day Width">
            <el-input-number v-model="dayWidth" :min="2000" :max="7200" :step="100" />
          </el-form-item>
          <el-form-item label="Sidebar Width">
            <el-input-number v-model="sidebarWidth" :min="0" :max="250" :step="10" />
          </el-form-item>
          <el-form-item label="Sidebar">
            <el-switch v-model="isSidebar" />
          </el-form-item>
          <el-form-item label="Timeline">
            <el-switch v-model="isTimeline" />
          </el-form-item>
          <el-form-item label="24 hours format">
            <el-switch v-model="_24hFormat" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>

  <div class="w-full h-80vh">
    <Epg :is-loading="isLoading" v-bind="getEpgProps()">
      <Layout v-bind="getLayoutProps()" />
    </Epg>
  </div>
</template>
