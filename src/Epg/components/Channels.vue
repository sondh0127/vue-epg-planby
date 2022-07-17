<script lang="ts" setup>
import type { ChannelWithPosiiton } from '../helpers/types'
import { useEpgStore } from '../store'
import Channel from './Channel.vue'

const props = defineProps<{
  channels: ChannelWithPosiiton[]
  scrollY: number
  sidebarWidth: number
  isTimeline: boolean
  isChannelVisible: (position: any) => boolean
}>()

const { theme } = useEpgStore()

const visibleChannels = computed(() => {
  return props.channels.filter(item => props.isChannelVisible(item))
})
</script>

<template>
  <div
    data-testid="sidebar"
    class="sticky float-left"
    :style="{
      width: `${sidebarWidth}px`,
      bottom: `${scrollY}px`,
      left: 0,
      zIndex: 100,
      backgroundColor: `${theme.primary[900]}`,
    }"
  >
    <Channel v-for="channel in visibleChannels" :key="channel.uuid" :channel="channel" />
  </div>
</template>
