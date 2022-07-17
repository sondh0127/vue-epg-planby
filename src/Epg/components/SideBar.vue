<script lang="ts" setup>
import { TIMELINE_HEIGHT } from '../helpers'
import { useEpgStore } from '../store'

const { theme, sidebarWidth } = useEpgStore()
</script>

<template>
  <div
    class="absolute z-900 top-0 left-0"
    :style="{
      width: `${sidebarWidth}px`,
      height: `${TIMELINE_HEIGHT}px`,
      background: `${theme.primary[900]}`,
    }"
  >
    <div />
  </div>
</template>
