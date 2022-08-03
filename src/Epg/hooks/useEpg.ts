import { startOfToday } from 'date-fns'

// Import interfaces
import type { Ref } from 'vue'
import type { MaybeComputedRef } from '@vueuse/core'
import type { Channel, Program, Theme } from '../helpers/interfaces'

// Import types
import type { BaseTimeFormat, ChannelWithPosiiton, DateTime, Position, ProgramItem } from '../helpers/types'

// Import theme
import { theme as defaultTheme } from '../theme'

// Import heleprs
import {
  DAY_WIDTH,
  ITEM_HEIGHT,
  ITEM_OVERSCAN,
  SIDEBAR_WIDTH,
  formatTime,
  getConvertedChannels,
  getConvertedPrograms,
  getDayWidthResources,
  getDefaultEndDate,
  getItemVisibility,
  getSidebarItemVisibility,
  // getTimeRangeDates,
} from '../helpers'

// Import components
import { useProvideEpgStore } from '../store'
import { useLayout } from './useLayout'

interface useEpgProps {
  channels: MaybeComputedRef<Channel[]>
  epg: MaybeComputedRef<Program[]>
  width?: number
  height?: number
  startDate?: MaybeComputedRef<DateTime>
  endDate?: MaybeComputedRef<DateTime>
  isBaseTimeFormat?: Ref<BaseTimeFormat>
  isSidebar?: Ref<boolean>
  isTimeline?: Ref<boolean>
  isLine?: boolean
  theme?: MaybeComputedRef<Theme>
  dayWidth?: Ref<number>
  sidebarWidth?: Ref<number>
  itemHeight?: Ref<number>
  itemOverscan?: number
}

const defaultStartDateTime = formatTime(startOfToday())

export function useEpg({
  channels: channelsEpg,
  epg,
  startDate: startDateInput = defaultStartDateTime,
  endDate: endDateInput = getDefaultEndDate(defaultStartDateTime),
  isBaseTimeFormat = ref(false),
  isSidebar = ref(true),
  isTimeline = ref(true),
  isLine = true,
  theme: customTheme,
  dayWidth: customDayWidth = ref(DAY_WIDTH),
  sidebarWidth = ref(SIDEBAR_WIDTH),
  itemHeight = ref(ITEM_HEIGHT),
  itemOverscan = ITEM_OVERSCAN,
  width,
  height,
}: useEpgProps) {
  const channelsEpgRef = resolveRef(channelsEpg)
  const epgRef = resolveRef(epg)
  // Get converted start and end dates
  // const { startDate, endDate } = getTimeRangeDates(startDateInput, endDateInput)
  const startDate = resolveRef(startDateInput)
  const endDate = resolveRef(endDateInput)

  // Get day and hour width of the day
  const dayWidthResourcesProps = computed(
    () =>
      getDayWidthResources({
        dayWidth: customDayWidth.value, startDate: startDate.value, endDate: endDate.value,
      }),
  )

  const hourWidth = computed(() => dayWidthResourcesProps.value.hourWidth)

  // -------- Effects --------
  const { containerRef, scrollBoxRef, ...layoutProps } = useLayout({
    startDate,
    endDate,
    sidebarWidth,
    width,
    height,
    hourWidth,
  })

  const { scrollX, scrollY, layoutWidth, layoutHeight } = layoutProps

  const { onScroll, onScrollToNow, onScrollTop, onScrollLeft, onScrollRight }
    = layoutProps

  // -------- Variables --------
  const channels = computed(
    () => getConvertedChannels(channelsEpgRef.value, itemHeight.value),
  )

  const programs = computed(
    () =>
      getConvertedPrograms({
        data: epgRef.value,
        channels: channels.value,
        startDate: formatTime(startDate.value),
        endDate: formatTime(endDate.value),
        itemHeight: itemHeight.value,
        hourWidth: hourWidth.value,
      }),
  )

  const theme = resolveRef(customTheme || defaultTheme)
  // -------- Handlers --------
  const isProgramVisible = (position: Position) =>
    getItemVisibility(
      position,
      scrollY.value,
      scrollX.value,
      layoutHeight.value,
      layoutWidth.value,
      itemOverscan,
    )

  const isChannelVisible = (position: Pick<Position, 'top'>) =>
    getSidebarItemVisibility(position, scrollY.value, layoutHeight.value, itemOverscan)

  const getEpgProps = (): {
    width?: number
    height?: number
    isSidebar: boolean
    isTimeline?: boolean
    isLoading?: boolean
    loader?: string
    theme: Theme
    sidebarWidth: number
    setContainerRef: (ref: any) => void
  } => ({
    width,
    height,
    isSidebar: isSidebar.value,
    isTimeline: isTimeline.value,
    sidebarWidth: sidebarWidth.value,
    theme: unref(theme),
    setContainerRef: (el: HTMLDivElement) => containerRef.value = el,
  })

  const getLayoutProps = (): {
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
    onScroll: (e: any) => void
    isBaseTimeFormat?: BaseTimeFormat
    isSidebar?: boolean
    isTimeline?: boolean
    isLine?: boolean
    isProgramVisible: (position: Position) => boolean
    isChannelVisible: (position: Pick<Position, 'top'>) => boolean
    setScrollBoxRef: (el: HTMLDivElement) => void
  } => ({
    programs: programs.value,
    channels: channels.value,
    startDate: startDate.value,
    endDate: endDate.value,
    scrollY: scrollY.value,
    onScroll,
    isBaseTimeFormat: isBaseTimeFormat.value,
    isSidebar: isSidebar.value,
    isTimeline: isTimeline.value,
    isLine,
    isProgramVisible,
    isChannelVisible,
    sidebarWidth: sidebarWidth.value,
    itemHeight: itemHeight.value,
    hourWidth: dayWidthResourcesProps.value.hourWidth,
    dayWidth: dayWidthResourcesProps.value.dayWidth,
    numberOfHoursInDay: dayWidthResourcesProps.value.numberOfHoursInDay,
    offsetStartHoursRange: dayWidthResourcesProps.value.offsetStartHoursRange,
    setScrollBoxRef: ref => scrollBoxRef.value = ref,
  })

  useProvideEpgStore({
    theme,
    sidebarWidth,
  })

  return {
    getEpgProps,
    getLayoutProps,
    onScrollToNow,
    onScrollTop,
    onScrollLeft,
    onScrollRight,
    scrollY,
    scrollX,
  }
}
