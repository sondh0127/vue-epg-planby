import { format } from 'date-fns'

// Import types
import type { Ref } from 'vue'
import type { BaseTimeFormat, ProgramItem } from '../helpers/types'

// Import helpers
import { PROGRAM_REFRESH, TIME_FORMAT, getLiveStatus, omit } from '../helpers'

interface useProgramProps<T> {
  program: Ref<T>
  isBaseTimeFormat: Ref<BaseTimeFormat>
  minWidth?: number
}

export function useProgram<T extends ProgramItem>({
  program,
  isBaseTimeFormat,
  minWidth = 200,
}: useProgramProps<T>) {
  const { data, position } = program.value
  const { width } = position

  const { since, till } = data

  const isLive = ref(getLiveStatus(since, till))

  const formatTime = (
    date: string | number | Date,
    formatType: string = TIME_FORMAT.HOURS_MIN,
  ) => format(new Date(date), formatType).replace(/\s/g, '')

  const set12HoursTimeFormat = () => {
    if (isBaseTimeFormat.value)
      return TIME_FORMAT.BASE_HOURS_TIME
    return TIME_FORMAT.HOURS_MIN
  }

  useIntervalFn(() => {
    const status = getLiveStatus(since, till)
    isLive.value = status
  }, PROGRAM_REFRESH)

  const isMinWidth = width > minWidth

  return {
    formatTime,
    set12HoursTimeFormat,
    isLive,
    isMinWidth,
    styles: computed(() => {
      const newPosition = omit(program.value.position, 'egdeEnd')
      return {
        width,
        position: {
          width: `${newPosition.width}px`,
          height: `${newPosition.height}px`,
          top: `${newPosition.top}px`,
          left: `${newPosition.left}px`,
        },
      }
    }),
  }
}
