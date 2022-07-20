/* eslint-disable promise/param-names */
import type { Channel, Program } from '@sondh0127/vue-epg-planby'
import { channels } from './channels'
import { epg } from './epg'

export const fetchChannels = async () =>
  new Promise<Channel[]>(res => setTimeout(() => res(channels), 400))

export const fetchEpg = async (date: string, date2: string) => {
  return new Promise<Program[]>(res => setTimeout(() =>
    res(epg.map(item => ({
      ...item,
      since: item.since.replace('2022-07-17', date).replace('2022-07-18', date2),
      till: item.till.replace('2022-07-17', date).replace('2022-07-18', date2),
    }))), 500),
  )
}
