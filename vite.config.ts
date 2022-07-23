import { resolve } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import Inspector from 'vite-plugin-vue-inspector'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'prod'
  const isDev = mode === 'dev'
  const isTest = mode === 'test'

  let build = {}
  if (isProd) {
    build = {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'vue-epg-planby',
        fileName: format => `index.${format}.js`,
      },
      rollupOptions: {
        /**
         * DESC:
         * make sure to externalize deps that shouldn't be bundled
         * into your library
         */
        external: [
          'vue',
          'vue-demi',
        ],
        output: {
          /**
           * DESC:
           * Provide global variables to use in the UMD build
           * for externalized deps
           */
          globals: {
            'vue': 'Vue',
            'vue-demi': 'VueDemi',
          },
        },
      },
    }
  }

  let optimizeDeps = {}
  let alias = []
  if (isDev) {
    /**
     * DESC:
     * dependency pre-bundling
     */
    optimizeDeps = {
      exclude: ['vue-demi'],
    }
    alias = [
      {
        find: '@sondh0127/vue-epg-planby',
        replacement: resolve(__dirname, './src/index.ts'),
      },
    ]
  }

  let test = {}
  if (isTest) {
    /**
     * DESC:
     * vitest config
     */
    test = {
      include: ['test/**/*.test.ts'],
      environment: 'happy-dom',
      deps: {
        inline: [
          '@vue',
          'vue-demi',
        ],
      },
      coverage: {
        reporter: [
          'text',
          'text-summary',
          'lcov',
        ],
      },
    }
  }

  return {
    plugins: [
      Vue(),
      AutoImport({
        imports: [
          'vue',
          '@vueuse/core',
        ],
        dts: './src/auto-imports.d.ts',
        dirs: [
          './src/composables',
        ],
        vueTemplate: true,
      }),
      Unocss(),
      Inspector(),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: './src/components.d.ts',
      }),
    ],
    optimizeDeps,
    build,
    test,

    /**
     * DESC:
     * defining aliases
     */
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, './src'),
        },
        ...alias,
      ],
    },
    server: {
      open: true,
    },
  }
})
