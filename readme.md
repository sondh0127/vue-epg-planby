## Vue EPG Planby
[![License](https://img.shields.io/github/license/logustra/vue-epg-planby)](https://github.com/sondh0127/vue-epg-planby/blob/master/license.md)
[![Code Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli)

> Electronic Program Guide (EPG) is a digital TV program that is used to display information about a channel's programs.

> Vue EPG Planby is a Vue components for EPG based Timeline, (ported from [planby](https://github.com/karolkozer/planby) - React based)

## Features
- Full reactivity props

## Installation
```sh
# install packages
$ pnpm install @sondh0127/vue-epg-planby
```


## Usage
Vue 3 (Vue 2.7)
### Basic Usage
```ts
import 'vue-epg-planby/style.css'
import { Epg, Layout, useEpg } from '@sondh0127/vue-epg-planby'
import type { Channel, Program, Theme } from '@sondh0127/vue-epg-planby'

const channels = ref<Channel[]>([])
const epg = ref<Program[]>([])
const isLoading = ref(false)

const { getEpgProps, getLayoutProps, onScrollToNow } = useEpg({
  channels,
  epg,
  dayWidth,
  sidebarWidth,
  itemHeight,
  isSidebar,
  isTimeline,
  isLine: true,
  startDate,
  endDate,
  isBaseTimeFormat,
  theme,
})

onMounted(async () => {
  isLoading.value = true
  epg.value = await fetchEpg()
  channels.value = await fetchChannels()
  isLoading.value = false
})

```

```html
<div class="w-full h-80vh">
  <Epg :is-loading="isLoading" v-bind="getEpgProps()">
    <Layout v-bind="getLayoutProps()" />
  </Epg>
</div>
```

[Demo →](https://stackblitz.com/edit/vue-epg-planby-demo?file=src%2FApp.vue)


## Checklist
When you use this template, try follow the checklist to update your info properly

- [x] full Interactive Demo
- [x] Light | Dark Theme
- [ ] Zooming use dayWidth
- [x] stackblitz demo
- [ ] Testing
- [ ] Loader
- [ ] renderProps => <component/>
- [ ] Vue 2.7 Test
- [ ] Ref => MaybeRef => new convention of passing reactive getters as arguments. [https://github.com/vueuse/vueuse/releases/tag/v9.0.0-beta.0](https://github.com/vueuse/vueuse/releases/tag/v9.0.0-beta.0)

## Cheer me on
If you like my works, you can cheer me on here 😆

<!-- &nbsp; &nbsp; [Trakteer](https://trakteer.id/sondh0127/tip)<br> -->

## License
MIT License © 2022 Son Hong Do

## Credits

Karol Kozer - [@kozerkarol_twitter](https://twitter.com/kozerkarol)

Planby: React based [https://github.com/karolkozer/planby](https://github.com/karolkozer/planby)
