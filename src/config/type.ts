import * as Discord from 'discord.js'

/**
 * キャルの状態を管理
 * @property content: string - 再生するテキスト
 * @property url: string - 再生するテキスト
 * @property volume: Number - キャルの音量
 * @property mode: Mode - キャルのDevMode
 */
export interface CalStatus {
  content?: string
  url: string
  volume: number
  flag?: boolean
}

/**
 * 音声の再生状況を管理
 * @property stream: boolean - キャルが音声を再生中かどうかの真偽値
 * @property queue: CalStatus[] - 再生する音声のキュー
 * @property dispatcher: Discord.StreamDispatcher - 現在再生してる音声の状態
 */
export interface Voice {
  stream: boolean
  queue: CalStatus[]
  dispatcher?: Discord.StreamDispatcher
}
