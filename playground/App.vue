<script lang="ts" setup>
// import type { Channel, Program, Theme } from '../dist'
// import { Epg, Layout, useEpg } from '../dist'
// import '../dist/style.css'

import type { Channel, Program, Theme } from '../src/Epg'
import { Epg, Layout, useEpg } from '../src/Epg'

import { fetchChannels, fetchEpg } from './helpers'

const theme: Theme = {
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
      <el-button class="" @click="onScrollToNow()">
        Now
      </el-button>
    </el-card>
  </div>

  <div class="w-full h-80vh">
    <Epg :is-loading="isLoading" v-bind="getEpgProps()">
      <Layout v-bind="getLayoutProps()" />
    </Epg>
  </div>
</template>
