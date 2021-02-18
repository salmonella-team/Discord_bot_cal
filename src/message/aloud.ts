import * as Discord from 'discord.js'
import moji from 'moji'
import axios from 'axios'
import {AxiosRequestConfig} from 'axios'
import {getAudioUrl} from 'google-tts-api'
import throwEnv from 'throw-env'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {VcChannelList} from '../config/etc'

/**
 * 直前のメッセージを削除。
 * 引数で数を指定できる
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const RemoveMessage = async (msg: Discord.Message): Promise<Option<string>> => {
  // ヤバイわよ！のロールがついて入れば実行可能
  const roles = msg.member?.roles.cache.map(r => r.name)
  if (!Settings.DEVELOP_ROLE.some((r: string) => roles?.find(v => v === r))) return ''

  switch (true) {
    case /rm/.test(msg.content): {
      // スラッシュが入っていなければ終了
      const match = msg.content.replace(/・/g, '/').match(/\//)
      if (!match) return ''

      // チャンネルのメッセージ履歴を取得
      const msgList = (await msg.channel.messages.fetch()).map(v => v)
      // 引数の値を数を取得ない場合は1
      const n = (arg => (/\d/.test(arg) ? Number(arg) : 1))(msg.content.replace('/rm ', ''))
      // 指定された回数と`/rm`のメッセージを消す
      ;[...Array(n + 1)].forEach((_, i) => setTimeout(() => msgList[i].delete(), 100))

      return 'delete message'
    }

    default: {
      return ''
    }
  }
}

/**
 * 入力された文字を読み上げる処理、先頭にenが付いていたら英語で日本語を喋る
 * @param msg DiscordからのMessage
 * @param client bot(キャル)のclient
 * @return 読み上げた文字の内容
 */
export const Read = async (msg: Discord.Message, client: Discord.Client): Promise<Option<string>> => {
  // botのメッセージは喋らない
  if (msg.author.bot) return

  // 読み上げするチャンネル以外では喋らない
  const channel = msg.channel as Discord.TextChannel
  if (!(await VcChannelList()).some((c: string) => c === channel?.name)) return

  // 全角文字は打った人は中華なのでロールを付与して中国語で喋らせる
  if (/[Ａ-Ｚ]+|[ａ-ｚ]+|[０-９]+|　/.test(msg.content)) {
    if (msg.guild?.id === Settings.BEROBA_ID) {
      msg.member?.roles.add(Settings.CHINA_ROLE)
    }

    msg.content = `cn ${msg.content
      .replace(/^(おはなし|お話し|お話)/, '')
      .trim()
      .replace(/^(en|us|zh|cn|es|ru|de|it|vi|vn|gb|ja|jp)/i, '')
      .trim()}`
  }

  // キャルがvcに居ない場合は終了
  const vc = client.voice.connections.map(v => v).filter(v => v.channel.guild.id === msg.guild?.id)
  if (!vc.length) return

  // コードブロックの場合は終了
  if (/\`\`\`/.test(msg.content)) return

  // 言語を判別
  const lang: any = ((str: string) => {
    switch (true) {
      case /^(en|us)/i.test(str):
        return 'en-US'
      case /^(zh|cn)/i.test(str):
        return 'zh-CN'
      case /^es/i.test(str):
        return 'es-ES'
      case /^ru/i.test(str):
        return 'ru-RU'
      case /^de/i.test(str):
        return 'de-DE'
      case /^it/i.test(str):
        return 'it-IT'
      case /^(vi|vn)/i.test(str):
        return 'vi-VN'
      case /^gb/i.test(str):
        return 'en-GB'
      case /^(ja|jp)/i.test(str):
      default:
        return 'ja-JP'
    }
  })(msg.content.replace(/^(おはなし|お話し|お話)/, '').trim())

  // 入力された文字を読み上げられる形に整形
  const content = aloudFormat(msg.content)

  // 文字が空の場合は終了
  if (!content) return

  // ひらがな化APIを使用するためにパラメータ等を設定
  const options: AxiosRequestConfig = {
    method: 'post',
    url: Settings.API_URL.HIRAGANA,
    headers: {'Content-Type': 'application/json'},
    data: {
      app_id: throwEnv('HIRAGANA_APIKEY'),
      sentence: content,
      output_type: 'katakana',
    },
  }

  // ひらがな化APIを使って構文解析をし、カタカナに変換する
  const res = await axios(options)
    .then(r => r.data)
    .catch(e => console.log(e))

  // 変換された文字をgttsに投げ、音声を取得する
  const url = getAudioUrl(res.converted.slice(0, 200), {
    lang: lang,
    slow: false,
    host: Settings.API_URL.GTTS,
  })

  // 現在キャルが入っているチャンネルで音声を再生する
  const connect = await vc[0].voice?.channel?.join()
  connect?.play(url, {volume: 0.5})

  return `speak ${lang} ${content}`
}

/**
 * 入力された文字を読み上げられる形に整形する
 * @param content 整形する前の文字列
 * @return 整形した後の文字列
 */
const aloudFormat = (content: string): string => {
  /**
   * 行末wをワラに変える
   * @param str 変換する文字列
   * @return 変換した文字列
   */
  const replaceWara = (str: string): string => {
    let flag = false
    return str
      .split('')
      .reverse()
      .map(s => {
        if (flag) return s
        if (!/w/i.test(s)) {
          flag = true
          return s
        } else {
          return 'ワラ'
        }
      })
      .reverse()
      .join('')
  }

  // callする毎に><が切り替わるObjectを作成
  const separat = {
    char: ['>', '<'],
    count: 0,
    call: () => separat.char[separat.count ? separat.count-- : separat.count++],
  }

  // 絵文字トリム用のカウンタ
  const counter = {
    count: 0,
    call: () => (counter.count = counter.count === 2 ? 0 : counter.count + 1),
  }

  /**
   * 絵文字の余計な部分を消す為に:を<>に変換する
   * @param c 文字
   * @param i インデックス
   * @param str 配列
   * @return 変換した文字
   */
  const emojiTrim = (c: string, i: number, str: string[]): string => {
    if (counter.count) {
      return c === ':' ? (counter.call(), separat.call()) : c
    } else {
      if (c === '<' && str[i + 1] === ':') counter.call()
      return c
    }
  }

  return moji(content)
    .convert('HK', 'ZK') // 半角カナを全角カナに変換
    .toString() // String型に戻す
    .replace(/^(おはなし|お話し|お話)/, '') // おはなしを除去する
    .trim() // 余分な空白を除去
    .replace(/^(en|us|zh|cn|es|ru|de|it|vi|vn|gb|ja|jp)/i, '') // 先頭の言語を除去
    .trim() // 余分な空白を除去
    .replace(/https?:\/\/\S+/g, '') // URLを除去
    .split('\n') // 一行ずつに分解
    .map(replaceWara) // 文末のwをワラに変える
    .join('') // 分解した文字を結合
    .split('') // 一文字ずつに分解
    .map(emojiTrim) // :を><に変換
    .join('') // 分解した文字を結合
    .replace(/<[^<>]*>/g, '') // <>に囲まれている文字を全て除去
    .slice(0, 200) // 200文字以上は喋れないので切り捨てる
}
