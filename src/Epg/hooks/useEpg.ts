import { startOfToday } from 'date-fns'

// Import interfaces
import type { Ref } from 'vue'
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
  getItemVisibility,
  getSidebarItemVisibility,
  getTimeRangeDates,
} from '../helpers'

// Import components
import { useProvideEpgStore } from '../store'
import { useLayout } from './useLayout'

interface useEpgProps {
  channels: Ref<Channel[]>
  epg: Ref<Program[]>
  width?: number
  height?: number
  startDate?: DateTime
  endDate?: DateTime
  isBaseTimeFormat?: BaseTimeFormat
  isSidebar?: boolean
  isTimeline?: boolean
  isLine?: boolean
  theme?: Theme
  dayWidth?: number
  sidebarWidth?: number
  itemHeight?: number
  itemOverscan?: number
}

const defaultStartDateTime = formatTime(startOfToday())

export function useEpg({
  channels: channelsEpg,
  epg,
  startDate: startDateInput = defaultStartDateTime,
  endDate: endDateInput = '',
  isBaseTimeFormat = false,
  isSidebar = true,
  isTimeline = true,
  isLine = true,
  theme: customTheme,
  dayWidth: customDayWidth = DAY_WIDTH,
  sidebarWidth = SIDEBAR_WIDTH,
  itemHeight = ITEM_HEIGHT,
  itemOverscan = ITEM_OVERSCAN,
  width,
  height,
}: useEpgProps) {
  // Get converted start and end dates
  const { startDate, endDate } = getTimeRangeDates(
    startDateInput,
    endDateInput,
  )

  // Get day and hour width of the day
  const dayWidthResourcesProps = computed(
    () =>
      getDayWidthResources({ dayWidth: customDayWidth, startDate, endDate }),
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
    () => getConvertedChannels(channelsEpg.value, itemHeight),
  )

  const startDateTime = formatTime(startDate)
  const endDateTime = formatTime(endDate)
  const programs = computed(
    () =>
      getConvertedPrograms({
        data: epg.value,
        channels: channels.value,
        startDate: startDateTime,
        endDate: endDateTime,
        itemHeight,
        hourWidth: hourWidth.value,
      }),
  )

  const theme: Theme = customTheme || defaultTheme
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

  const getEpgProps = () => ({
    width,
    height,
    isSidebar,
    isLine,
    isTimeline,
    sidebarWidth,
    theme,
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
    startDate,
    endDate,
    scrollY: scrollY.value,
    onScroll,
    isBaseTimeFormat,
    isSidebar,
    isTimeline,
    isLine,
    isProgramVisible,
    isChannelVisible,
    sidebarWidth,
    itemHeight,
    hourWidth: dayWidthResourcesProps.value.hourWidth,
    dayWidth: dayWidthResourcesProps.value.dayWidth,
    numberOfHoursInDay: dayWidthResourcesProps.value.numberOfHoursInDay,
    offsetStartHoursRange: dayWidthResourcesProps.value.offsetStartHoursRange,
    setScrollBoxRef: ref => scrollBoxRef.value = ref,
  })

  useProvideEpgStore({
    theme,
    sidebarWidth: sidebarWidth || 200,
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
