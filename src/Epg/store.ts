import type { MaybeRef } from '@vueuse/core'
import type { Theme } from './helpers'

interface EpgStore {
  theme: MaybeRef<Theme>
  sidebarWidth: number
}

const [useProvideEpgStore, _useEpgStore] = createInjectionState((store: EpgStore) => {
  // state
  const theme = ref(store.theme)
  const sidebarWidth = ref(store.sidebarWidth)
  const scrollBoxRef = ref<HTMLDivElement>()
  // getters

  // actions

  return { theme, sidebarWidth, scrollBoxRef }
})

export { useProvideEpgStore }

export function useEpgStore() {
  const store = _useEpgStore()
  if (store == null)
    throw new Error('Please call `useProvideEpgStore` on the appropriate parent component')
  return store
}
