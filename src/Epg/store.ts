import type { MaybeComputedRef } from '@vueuse/core'
import type { Theme } from './helpers'

interface EpgStore {
  theme: MaybeComputedRef<Theme>
  sidebarWidth: MaybeComputedRef<number>
}

const [useProvideEpgStore, _useEpgStore] = createInjectionState((store: EpgStore) => {
  // state
  const theme = resolveRef(store.theme)
  const sidebarWidth = resolveRef(store.sidebarWidth)
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
