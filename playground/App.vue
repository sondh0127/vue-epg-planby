<script lang="ts" setup>
// import type { Channel, Program, Theme } from '../dist'
// import { Epg, Layout, useEpg } from '../dist'
// import '../dist/style.css'

import type { Channel, Program, Theme } from '../src/Epg'
import { Epg, Layout, useEpg } from '../src/Epg'

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

const { getEpgProps, getLayoutProps, onScrollToNow } = useEpg({
  channels,
  epg,
  dayWidth: 7200,
  sidebarWidth: 100,
  itemHeight: 80,
  isSidebar: true,
  isTimeline: true,
  isLine: true,
  startDate: '2022-07-18T00:00:00',
  endDate: '2022-07-18T24:00:00',
  isBaseTimeFormat: true,
  theme,
})

onMounted(async () => {
  isLoading.value = true
  epg.value = await fetchEpg()
  channels.value = await fetchChannels()
  isLoading.value = false
})
</script>

<template>
  <div class="flex flex-wrap p-5px">
    <el-card class="w-full">
      <div class="flex items-center gap-5px">
        <el-button class="" @click="onScrollToNow()">
          Now
        </el-button>
        <el-select v-model="themeValue" placeholder="Select theme">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </el-card>
  </div>

  <div class="w-full h-80vh">
    <Epg :is-loading="isLoading" v-bind="getEpgProps()">
      <Layout v-bind="getLayoutProps()" />
    </Epg>
  </div>
</template>
