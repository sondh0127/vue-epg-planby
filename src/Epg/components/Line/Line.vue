<script lang="ts" setup>
import { isToday } from 'date-fns'
import type { DateTime } from '../../helpers/types'
import { useLine } from './useLine'

const props = defineProps<{
  height: number
  startDate: DateTime
  endDate: DateTime
  dayWidth: number
  hourWidth: number
  sidebarWidth: number
}>()

const { startDate, endDate, dayWidth, hourWidth, sidebarWidth } = toRefs(props)

const { positionX } = useLine({
  startDate, endDate, dayWidth, hourWidth, sidebarWidth,
})

const date = new Date(props.startDate)
</script>

<template>
  <div
    v-if="isToday(date)" :style="{
      height: `${height}px`,
      left: `${positionX}px`,
    }"
  />
</template>
