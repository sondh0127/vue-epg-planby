import { isToday as isTodayFns, startOfToday } from 'date-fns'

// Import types
import type { Ref } from 'vue'
import type { DateTime } from '../helpers/types'

import {
  DEBOUNCE_WAIT,
  DEBOUNCE_WAIT_MAX,
  getPositionX,
} from '../helpers'

interface useLayoutProps {
  height?: number
  width?: number
  hourWidth: Ref<number>
  sidebarWidth: number
  startDate: DateTime
  endDate: DateTime
}

export function useLayout({
  height,
  width,
  startDate,
  endDate,
  hourWidth,
  sidebarWidth,
}: useLayoutProps) {
  const containerRef = ref<HTMLDivElement | null>(null)
  const scrollBoxRef = ref<HTMLDivElement | null>(null)

  // -------- State --------
  const scrollY = ref(0)
  const scrollX = ref(0)
  const layoutWidth = ref(width as number)
  const layoutHeight = ref(height as number)
  const isToday = isTodayFns(new Date(startDate))

  // -------- Handlers --------

  const handleScrollDebounced = useDebounceFn((value) => {
    scrollY.value = value.y
    scrollX.value = value.x
  }, DEBOUNCE_WAIT, {
    maxWait: DEBOUNCE_WAIT_MAX,
  })

  const handleOnScroll = (e: any) => {
    handleScrollDebounced({ y: e.target.scrollTop, x: e.target.scrollLeft })
  }

  const handleOnScrollToNow = () => {
    if (scrollBoxRef?.value && isToday) {
      const clientWidth = (width
        ?? containerRef.value?.clientWidth) as number

      const newDate = new Date()
      const scrollPosition = getPositionX(
        startOfToday(),
        newDate,
        startDate,
        endDate,
        hourWidth.value,
      )
      const scrollNow = scrollPosition - clientWidth / 2 + sidebarWidth
      scrollBoxRef.value.scrollLeft = scrollNow
    }
  }

  const handleOnScrollTop = (value: number = hourWidth.value) => {
    if (scrollBoxRef?.value) {
      const top = scrollBoxRef.value.scrollTop + value
      scrollBoxRef.value.scrollTop = top
    }
  }

  const handleOnScrollRight = (value: number = hourWidth.value) => {
    if (scrollBoxRef?.value) {
      const right = scrollBoxRef.value.scrollLeft + value
      scrollBoxRef.value.scrollLeft = right
    }
  }

  const handleOnScrollLeft = (value: number = hourWidth.value) => {
    if (scrollBoxRef?.value) {
      const left = scrollBoxRef.value.scrollLeft - value
      scrollBoxRef.value.scrollLeft = left
    }
  }

  const handleResizeDebounced = useDebounceFn(
    () => {
      if (containerRef?.value && !width) {
        const container = containerRef.value
        const { clientWidth } = container
        layoutWidth.value = clientWidth
      }
    },
    DEBOUNCE_WAIT * 4,
    { maxWait: DEBOUNCE_WAIT_MAX * 4 },
  )

  // -------- Efffects --------
  watchEffect(() => {
    if (containerRef?.value) {
      const container = containerRef.value
      if (!width) {
        const { clientWidth } = container
        layoutWidth.value = clientWidth
      }
      if (!height) {
        const { clientHeight } = container
        layoutHeight.value = clientHeight
      }
    }

    if (scrollBoxRef?.value && isToday)
      handleOnScrollToNow()
  })

  onMounted(() => {
    window.addEventListener('resize', handleResizeDebounced)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResizeDebounced)
  })

  return {
    containerRef,
    scrollBoxRef,
    scrollX,
    scrollY,
    layoutWidth,
    layoutHeight,
    onScroll: handleOnScroll,
    onScrollToNow: handleOnScrollToNow,
    onScrollTop: handleOnScrollTop,
    onScrollLeft: handleOnScrollLeft,
    onScrollRight: handleOnScrollRight,
  }
}
