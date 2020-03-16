/**
 * nullやundefinedが混ざる可能性がある場合の型
 * @param T 任意の型
 */
export type Option<T> = T | null | undefined

/**
 * On・Offの2種類
 */
export const enum Mode {
  Off,
  On,
}

/**
 * キャルの音量とモードを管理
 * @property Volume: Number - キャルの音量
 * @property Mode: Mode - キャルのDevMode
 */
export interface Status {
  Volume: number
  Mode: Mode
}
