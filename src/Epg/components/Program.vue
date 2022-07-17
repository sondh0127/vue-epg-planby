<script lang="ts" setup>
import type { BaseTimeFormat, Position, ProgramItem } from '../helpers/types'
import { useProgram } from '../hooks'
import type { Program as ProgramType } from '../helpers/interfaces'
import { useEpgStore } from '../store'

const props = defineProps<{
  program: ProgramItem
  isBaseTimeFormat: BaseTimeFormat
}>()
const emit = defineEmits<
  (event: 'click', v: ProgramType) => void
>()

const data = computed(() => props.program.data)
const {
  styles,
  formatTime,
  set12HoursTimeFormat,
  isLive,
  isMinWidth,
} = useProgram({
  program: props.program,
  isBaseTimeFormat: props.isBaseTimeFormat,
})

const { theme } = useEpgStore()
</script>

<template>
  <div
    data-testid="program-item" class="absolute overflow-hidden" :style="{
      ...styles.position,
      padding: `${styles.width === 0 ? 0 : 4}px`,
    }"
  >
    <div
      data-testid="program-content"
      class="program-item cursor-pointer relative flex text-11px h-full rounded-8px overflow-hidden transition-all duration-400 ease-in-out z-1"
      :style="{
        padding: `10px ${styles.width < 30 ? 4 : 20}px`,
      }" :class="{
        'is-live': isLive,
      }" @click="emit('click', data)"
    >
      <div class="flex w-full justify-start">
        <img v-if="isLive && isMinWidth" :src="data.image" alt="Preview">
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
            {{ formatTime(data.since, set12HoursTimeFormat()) }} -{{ " " }}
            {{ formatTime(data.till, set12HoursTimeFormat()) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.program-item {
  background-image: linear-gradient(to right, v-bind('theme.primary[600]'), v-bind('theme.primary[600]'));
}

.program-item:hover {
  background-image: linear-gradient(to right, v-bind('theme.gradient.blue[900]'), v-bind('theme.gradient.blue[600]'));
}

.program-item.is-live {
  background-image: linear-gradient(to right, v-bind('theme.gradient.blue[900]'), v-bind('theme.gradient.blue[600]'),v-bind('theme.gradient.blue[300]'));
}
</style>
