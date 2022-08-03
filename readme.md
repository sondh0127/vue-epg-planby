## Vue EPG Planby
[![License](https://img.shields.io/github/license/logustra/vue-epg-planby)](https://github.com/sondh0127/vue-epg-planby/blob/master/license.md)
[![Code Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli)

> Electronic Program Guide (EPG) is a digital TV program that is used to display information about a channel's programs.

> Vue EPG Planby is a Vue components for EPG based Timeline, (ported from [planby](https://github.com/karolkozer/planby) - React based)

<div align="center" style="margin-bottom: 10px">
  <a href="https://planby.netlify.app/">
    <img src="https://i.postimg.cc/1zgmfd8T/planby-tv-vod.png" alt="Planby preview" />
  </a>
</div>

## Features
- Reactivity props
- Customizable template

## Installation
```sh
# install packages
$ pnpm install @sondh0127/vue-epg-planby
```


## Usage
Vue 3 (Vue 2.7)
### Basic Usage
```ts
import { addDays, addHours, endOfDay, format, startOfDay, subDays } from 'date-fns'
import type { Channel, Program, Theme } from '@sondh0127/vue-epg-planby'
import { Epg, Layout, TIME_FORMAT, formatTime, useEpg } from '@sondh0127/vue-epg-planby'
import '@sondh0127/vue-epg-planby/style.css'

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
    bg: '#cbd5e0db',
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

const themeValue = useStorage('__VUE_EPG_THEME__', 'light')
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

const startDate = computed(() => {
  const day = date.value
  const startTime = timeRange.value[0]
  day.setHours(startTime.getHours())
  day.setMinutes(startTime.getMinutes())
  day.setSeconds(startTime.getSeconds())
  return formatTime(day)
})

const endDate = computed(() => {
  const day = date.value
  const endTime = timeRange.value[1]
  day.setHours(endTime.getHours())
  day.setMinutes(endTime.getMinutes())
  day.setSeconds(endTime.getSeconds())
  return formatTime(day)
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

function onProgramClick(p: Program) {
  console.log('onProgramClick', p)
}

function onChannelClick(c: Channel) {
  console.log('onChannelClick', c)
}

```

```html

<template>
  <div class="flex flex-wrap p-5px">
    <el-card class="w-full">
      <div class="flex items-center gap-5px">
        <el-form inline>
          <el-form-item label="Scroll to Now">
            <el-button class="" @click="fetchDate">
              Reload
            </el-button>
          </el-form-item>
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
              v-model="timeRange" :disabled-seconds="disabledSeconds" is-range range-separator="To"
              start-placeholder="Start time" end-placeholder="End time"
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
      <Layout v-bind="getLayoutProps()" @program-click="onProgramClick" @channel-click="onChannelClick">
        <template #program="{ data, format12HoursTime, theme, isLive, isMinWidth }">
          <div class="flex w-full justify-start">
            <img v-if="isLive && isMinWidth" class="mr-15px rounded-6px w-100px" :src="data.image" alt="Preview">
            <div class="overflow-hidden">
              <div
                class="text-14px font-medium text-left mt-0 mb-5px truncate" :style="{
                  color: `${theme.grey['300']}`,
                }"
              >
                {{ data.title }}
              </div>
              <div
                class="block text-12.5px font-normal text-left truncate" :style="{
                  color: `${theme.text.grey['500']}`,
                }" aria-label="program time"
              >
                {{ format12HoursTime(data.since) }} -{{ " " }}
                {{ format12HoursTime(data.till) }}
              </div>
            </div>
          </div>
        </template>

        <template #timeline="{ formatTimelineTime, index, theme, offsetStartHoursRange, dividers, hourWidth }">
          <div
            class="text-14px relative" :style="{
              width: `${hourWidth}px`,
            }"
          >
            <div
              class="absolute top-18px" :style="{
                color: `${theme.text.grey[300]}`,
                left: `${index === 0 ? 0 : -18}px`,
              }"
            >
              {{ formatTimelineTime(index + offsetStartHoursRange) }}
            </div>

            <div class="h-full w-full grid grid-cols-4 items-end pb-6px">
              <div
                v-for="(__, i) in dividers" :key="i" :style="{
                  background: `${theme.timeline.divider.bg}`,
                  height: `10px`,
                  width: `1px`,
                  marginRight: `${hourWidth}px`,
                }"
              />
            </div>
          </div>
        </template>
      </Layout>
    </Epg>
  </div>
</template>
```

[Demo →](https://stackblitz.com/edit/vue-epg-planby-demo?file=src%2FApp.vue)


## Checklist
When you use this template, try follow the checklist to update your info properly

- [x] full Interactive Demo
- [x] Light | Dark Theme
- [ ] Zooming use dayWidth
- [x] stackblitz demo
- [ ] Testing
- [ ] Loader
- [x] renderProps => <slot/> scoped slot
- [ ] Vue 2.7 Test
- [x] Ref => MaybeRef => new convention of passing reactive getters as arguments. [https://github.com/vueuse/vueuse/releases/tag/v9.0.0-beta.0](https://github.com/vueuse/vueuse/releases/tag/v9.0.0-beta.0)
- [ ] Tanstack/Virtual

## Cheer me on
If you like my works, you can cheer me on here 😆

<!-- &nbsp; &nbsp; [Trakteer](https://trakteer.id/sondh0127/tip)<br> -->

## License
MIT License © 2022 Son Hong Do

## Credits

Karol Kozer - [@kozerkarol_twitter](https://twitter.com/kozerkarol)

Planby: React based [https://github.com/karolkozer/planby](https://github.com/karolkozer/planby)
