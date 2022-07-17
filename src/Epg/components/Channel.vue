<script lang="ts" setup>
import type { ChannelWithPosiiton } from '../helpers/types'
import { useEpgStore } from '../store'

const props = defineProps<{
  channel: ChannelWithPosiiton
  // onClick?: (v: ChannelWithPosiiton) => void
}>()
const emit = defineEmits<{
  (event: 'click', channel: ChannelWithPosiiton): void
}>()

const { theme } = useEpgStore()
</script>

<template>
  <div
    data-testid="sidebar-item"
    class="absolute flex items-center justify-center" :style="{
      top: `${channel.position.top}px`,
      height: `${channel.position.height}px`,
      width: `100%`,
      backgroundColor: `${theme.primary[900]}`,
    }"
    @click="$emit('click', channel)"
  >
    <img :src="channel.logo" class="max-h-60px max-w-60px relative">
  </div>
</template>
