/* eslint-disable promise/param-names */
import { channels } from './channels'
import { epg } from './epg'
import type { Channel, Program } from '@/Epg'

export const fetchChannels = async () =>
  new Promise<Channel[]>(res => setTimeout(() => res(channels), 400))

export const fetchEpg = async () =>
  new Promise<Program[]>(res => setTimeout(() => res(epg), 500))
