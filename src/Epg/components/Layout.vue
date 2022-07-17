<script lang="ts" setup>
import { getProgramOptions, isFutureTime } from '../helpers'
import type { BaseTimeFormat, ChannelWithPosiiton, DateTime, Position, ProgramItem } from '../helpers/types'
import { useEpgStore } from '../store'
import Line from './Line/Line.vue'
import Timeline from './Timeline.vue'
import Channels from './Channels.vue'
import Program from './Program.vue'

const props = withDefaults(defineProps<{
  programs: ProgramItem[]
  channels: ChannelWithPosiiton[]
  startDate: DateTime
  endDate: DateTime
  scrollY: number
  dayWidth: number
  hourWidth: number
  numberOfHoursInDay: number
  offsetStartHoursRange: number
  sidebarWidth: number
  itemHeight: number
  // onScroll: (
  //   e: React.UIEvent<HTMLDivElement, UIEvent> & { target: Element }
  // ) => void
  isBaseTimeFormat?: BaseTimeFormat
  isSidebar?: boolean
  isTimeline?: boolean
  isLine?: boolean
  isProgramVisible: (position: Position) => boolean
  isChannelVisible: (position: Pick<Position, 'top'>) => boolean
  // renderProgram?: (v: {
  //   program: ProgramItem
  //   isBaseTimeFormat: BaseTimeFormat
  // }) => React.ReactNode
  // renderChannel?: (v: { channel: ChannelWithPosiiton }) => React.ReactNode
  // renderTimeline?: (v: RenderTimeline) => React.ReactNode
  setScrollBoxRef: (ref: any) => void
}>(), {
  isSidebar: true,
  isLine: true,
  isTimeline: true,
  isBaseTimeFormat: false,
})
const emit = defineEmits(['scroll'])

const channelsLength = computed(() => props.channels.length)
const contentHeight = computed(() => channelsLength.value * props.itemHeight)

const isFuture = computed(() => isFutureTime(props.endDate))

const { theme } = useEpgStore()

const visiblePrograms = computed(() => {
  return props.programs.filter(item => props.isProgramVisible(item.position))
})
</script>

<template>
  <div
    :ref="(el) => setScrollBoxRef(el)" class="w-full h-full relative overflow-auto scroll-smooth scrollbox" :style="{
      background: `${theme.primary['900']}`,
    }" @scroll="$emit('scroll', $event)"
  >
    <Line
      v-if="isLine && isFuture" :day-width="dayWidth" :hour-width="hourWidth" :start-date="startDate"
      :sidebar-width="sidebarWidth" :end-date="endDate" :height="contentHeight"
    />
    <Timeline
      v-if="isTimeline" :is-base-time-format="isBaseTimeFormat" :is-sidebar="isSidebar" :day-width="dayWidth"
      :hour-width="hourWidth" :number-of-hours-in-day="numberOfHoursInDay"
      :offset-start-hours-range="offsetStartHoursRange" :sidebar-width="sidebarWidth"
    />

    <Channels
      v-if="isSidebar" :sidebar-width="sidebarWidth" :is-timeline="isTimeline"
      :is-channel-visible="isChannelVisible" :channels="channels" :scroll-y="scrollY"
    />

    <div
      data-testid="content" class="relative" :style="{
        background: `${theme.primary['900']}`,
        height: `${contentHeight}px`,
        width: `${dayWidth}px`,
        left: `${isSidebar ? sidebarWidth : 0}px`,
      }"
    >
      <Program
        v-for="program in visiblePrograms" :key="program.data.id" :program="getProgramOptions(program)"
        :is-base-time-format="isBaseTimeFormat"
      />
    </div>
  </div>
</template>

<style>
.scrollbox::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.scrollbox::-webkit-scrollbar-thumb {
  background: v-bind("theme.scrollbar.thumb.bg");
  border: 10px none v-bind("theme.white");
  border-radius: 20px;
}

.scrollbox::-webkit-scrollbar-thumb:hover {
  background: v-bind("theme.white");
}

.scrollbox::-webkit-scrollbar-track {
  background: v-bind("theme.primary['900']");
  border: 22px none v-bind("theme.white");
  border-radius: 0px;
}

.scrollbox::-webkit-scrollbar-corner {
  background: v-bind("theme.primary['900']");
}
</style>
