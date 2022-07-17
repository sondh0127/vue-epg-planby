<script lang="ts" setup>
import { ITEM_HEIGHT } from '../helpers'
import type { BaseTimeFormat } from '../helpers/types'
import { useTimeline } from '../hooks'
import { useEpgStore } from '../store'

const props = defineProps<{
  isBaseTimeFormat: BaseTimeFormat
  isSidebar: boolean
  dayWidth: number
  hourWidth: number
  numberOfHoursInDay: number
  offsetStartHoursRange: number
  sidebarWidth: number
}>()

const { theme } = useEpgStore()

const { time, dividers, formatTime } = useTimeline(
  props.numberOfHoursInDay,
  props.isBaseTimeFormat,
)
</script>

<template>
  <div
    class="sticky top-0 z-100 flex"
    :style="{
      left: `${isSidebar ? sidebarWidth : 0}px`,
      height: `${ITEM_HEIGHT - 20}px`,
      width: `${dayWidth}px`,
      background: `${theme.primary['900']}`,
    }"
  >
    <template v-for="(_, index) in time" :key="index">
      <div
        class="text-14px relative"
        :style="{
          width: `${hourWidth}px`,
        }"
      >
        <div
          class="absolute top-18px"
          :style="{
            color: `${theme.text.grey[300]}`,
            left: `${index === 0 ? 0 : -18}px`,
          }"
        >
          {{ formatTime(index + offsetStartHoursRange) }}
        </div>

        <div class="h-full w-full grid grid-cols-4 items-end pb-6px">
          <div
            v-for="(__, i) in dividers" :key="i"
            :style="{
              background: `${theme.timeline.divider.bg}`,
              height: `10px`,
              width: `1px`,
              marginRight: `${hourWidth}px`,
            }"
          />
        </div>
      </div>
    </template>
  </div>
</template>
