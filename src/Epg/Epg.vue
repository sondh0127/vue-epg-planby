<script lang="ts" setup>
import type { Theme } from './helpers'
import SideBar from './components/SideBar.vue'
import Loader from './components/Loader.vue'

const props = defineProps<{
  width?: number
  height?: number
  isSidebar: boolean
  isTimeline?: boolean
  isLoading?: boolean
  loader?: string
  theme: Theme
  sidebarWidth: number
  setContainerRef: (ref: any) => void
}>()
</script>

<template>
  <div
    :ref="(el) => setContainerRef(el)" class="p-5px"
    :style="{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }"
  >
    <div class="h-full w-full flex flex-col relative rounded overflow-hidden">
      <SideBar v-if="isSidebar && isTimeline" />
      <template v-if="isLoading">
        <component :is="loader" v-if="loader" />
        <Loader v-else />
      </template>
      <slot />
    </div>
  </div>
</template>
