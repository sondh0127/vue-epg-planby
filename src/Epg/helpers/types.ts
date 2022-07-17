// Interfaces
import type { Channel, Program } from './interfaces'

export interface Position {
  width: number
  height: number
  top: number
  left: number
  // edgeEnd: number
}

export interface ProgramWithPosition {
  position: Position
  data: Program
}

export interface ProgramItem {
  position: Omit<Position, 'edgeEnd'>
  data: Program
}

export type ChannelWithPosiiton = Channel & {
  position: Pick<Position, 'top' | 'height'>
}

export type DateTime = string | Date

export type BaseTimeFormat = boolean
