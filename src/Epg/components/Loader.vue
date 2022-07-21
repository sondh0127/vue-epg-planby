<script lang="ts" setup>
import { useEpgStore } from '../store'

const { theme } = useEpgStore()
</script>

<template>
  <div
    class="z-1000 absolute inset-0 flex items-center justify-center"
    :style="{
      background: `${theme.loader.bg}`,
      color: `${theme.white}`,
    }"
  >
    <svg class="animate-spin mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    Processing...
  </div>
</template>
