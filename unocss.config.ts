import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss'

const safelistMenuIcon = [
  // 'i-ep:guide',
]

export function createConfig({ strict = true, dev = true } = {}) {
  return defineConfig({
    envMode: dev ? 'dev' : 'build',
    theme: {
      colors: {
      },

    },
    shortcuts: [

    ],
    presets: [
      presetAttributify({ strict }),
      presetIcons({
        warn: true,
        collections: {
          // ep: () => import('@iconify-json/ep/icons.json').then(i => i.default as any),
          // carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default as any),
        },
      }),
      presetWebFonts({
        provider: 'google',
        fonts: {
          sans: 'Roboto',
        },
      }),
      presetUno(),
    ],
    safelist: [...safelistMenuIcon],
    transformers: [
      transformerVariantGroup(),
      transformerDirectives(),
    ],
  })
}

export default createConfig()
