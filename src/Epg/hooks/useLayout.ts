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
  sidebarWidth: Ref<number>
  startDate: Ref<DateTime>
  endDate: Ref<DateTime>
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
  const scrollXSlient = refWithControl(0)
  const layoutWidth = ref(width as number)
  const layoutHeight = ref(height as number)
  const isToday = computed(() => isTodayFns(new Date(startDate.value)))

  // -------- Handlers --------

  // const handleScrollDebounced = useDebounceFn((value) => {
  //   console.log('[LOG] ~ file: useLayout.ts ~ line 44 ~ value', value)
  //   scrollY.value = value.y
  //   scrollX.value = value.x
  // }, DEBOUNCE_WAIT, {
  //   maxWait: DEBOUNCE_WAIT_MAX,
  // })

  const handleOnScroll = (e: any) => {
    const payload = { y: e.target.scrollTop, x: e.target.scrollLeft }
    // handleScrollDebounced(payload)
    scrollY.value = payload.y
    scrollX.value = payload.x

    const clientWidth = (width
      ?? containerRef.value?.clientWidth) as number

    const centerHour = (clientWidth - sidebarWidth.value) / 2
    scrollXSlient.silentSet((payload.x + centerHour) / hourWidth.value)
  }

  const handleOnScrollToNow = () => {
    if (scrollBoxRef?.value && isToday.value) {
      const clientWidth = (width
        ?? containerRef.value?.clientWidth) as number

      const newDate = new Date()
      const scrollPosition = getPositionX(
        startOfToday(),
        newDate,
        startDate.value,
        endDate.value,
        hourWidth.value,
      )
      const scrollNow = scrollPosition - clientWidth / 2 + sidebarWidth.value
      scrollBoxRef.value.scrollLeft = scrollNow
    }
  }

  const handleZoom = () => {
    const clientWidth = (width
      ?? containerRef.value?.clientWidth) as number
    const centerHour = (clientWidth - sidebarWidth.value) / 2
    const diff = centerHour / hourWidth.value
    const centerDate = scrollXSlient.untrackedGet() - diff

    const startDateWithTime = new Date(startDate.value)
    const centerDateNatural = Math.floor(centerDate)
    const centerDateDecimal = centerDate - centerDateNatural

    startDateWithTime.setHours(centerDateNatural)
    startDateWithTime.setMinutes(Math.round(centerDateDecimal * 60))

    const scrollPosition = getPositionX(
      startOfToday(),
      startDateWithTime,
      startDate.value,
      endDate.value,
      hourWidth.value,
    )
    scrollBoxRef.value?.scrollTo({ left: scrollPosition, behavior: 'auto' })
  }

  watchThrottled([hourWidth], () => {
    handleZoom()
  }, { throttle: 500, trailing: true, leading: true })

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
