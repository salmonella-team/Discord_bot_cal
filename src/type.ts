export type Option<T> = T | null | undefined

export const enum Mode {
  Off,
  On,
}

export interface Status {
  Volume: number
  Mode: Mode
}
