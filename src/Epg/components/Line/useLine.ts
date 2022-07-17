import { startOfDay } from 'date-fns'

import type { Ref } from 'vue'
import type { DateTime } from '../../helpers/types'

import { HOUR_IN_MINUTES, PROGRAM_REFRESH, getPositionX } from '../../helpers'

interface useLineProps {
  startDate: Ref<DateTime>
  endDate: Ref<DateTime>
  dayWidth: Ref<number>
  hourWidth: Ref<number>
  sidebarWidth: Ref<number>
}

export function useLine({
  startDate,
  endDate,
  dayWidth,
  hourWidth,
  sidebarWidth,
}: useLineProps) {
  const initialState
    = getPositionX(
      startOfDay(new Date(startDate.value)),
      new Date(),
      startDate.value,
      endDate.value,
      hourWidth.value,
    ) + sidebarWidth.value

  const positionX = ref<number>(initialState)

  const isDayEnd = computed(() => positionX.value <= dayWidth.value)

  const isScrollX = computed(() => (isDayEnd.value ? PROGRAM_REFRESH : undefined))

  useIntervalFn(() => {
    const offset = hourWidth.value / HOUR_IN_MINUTES
    const positionOffset = offset * 2
    positionX.value += positionOffset
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
  }, isScrollX)

  watchEffect(() => {
    const newPositionX = getPositionX(
      startOfDay(new Date(startDate.value)),
      new Date(),
      startDate.value,
      endDate.value,
      hourWidth.value,
    ) + sidebarWidth.value
    positionX.value = newPositionX
  })

  return { positionX }
}
