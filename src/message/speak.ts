import * as Discord from 'discord.js'
import * as fs from 'fs'
import moji from 'moji'
import axios from 'axios'
import {AxiosRequestConfig} from 'axios'
import {getAudioUrl} from 'google-tts-api'
import throwEnv from 'throw-env'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {Status} from '../client/message'
import * as etc from '../config/etc'
import {CalStatus, Voice} from '../config/type'

/**
 * 音声の再生状況を管理
 * @property Mode: Mode - キャルのDevMode
 */
const voice: Voice = {
  stream: false,
  queue: [],
}

/**
 * 入力された文字を読み上げる処理、先頭にenが付いていたら英語で日本語を喋る
 * @param msg DiscordからのMessage
 * @param client bot(キャル)のclient
 * @return 読み上げた文字の内容
 */
export const Read = async (msg: Discord.Message, client: Discord.Client) => {
  // botのメッセージは喋らない
  if (msg.author.bot) return

  // 読み上げするチャンネル以外では喋らない
  const channel = msg.channel as Discord.TextChannel
  if (!(await etc.VcChannelList(client)).some((c: string) => c === channel?.name)) return

  // 全角文字は打った人は中華なので中国語で喋らせる
  if (/[Ａ-Ｚ]+|[ａ-ｚ]+|[０-９]+/.test(msg.content)) {
    // クラバトのチャンネルでは動かさないようにする
    if (msg.channel.id !== Settings.EXCEPTION_CHANNEL) {
      // 強制的に中国語に変換する
      msg.content = `cn ${msg.content
        .replace(/^(おはなし|お話し|お話)/, '') // おはなしを除去
        .trim() // 余分な空白を除去
        .replace(/^(en|us|zh|cn|es|ru|de|it|vi|vn|gb|ja|jp)/i, '') // 先頭の言語を除去
        .trim()}` // 余分な空白を除去
    }
  }

  // キャルがvcに居ない場合は終了
  const vc = etc.GetVcWithCal(msg, client)
  if (!vc) return

  // vcとメッセージが別のサーバーなら喋らない
  if (vc.channel.guild.id !== msg.guild?.id) return

  if (/^(fs|\/fs|\/skip|\/next)$/.test(msg.content))
    // `fs`か`/skip`か`/next`が入力された際は次の音声を再生
    return skip(msg, vc)

  // コードブロックの場合は終了
  if (/\`\`\`/.test(msg.content)) return

  // 言語を判別
  const lang: any = ((str: string) => {
    switch (true) {
      case /^(en|us)/i.test(str):
        return 'en-US'
      case /^(zh|cn)/i.test(str):
        // べろばあのサーバーなら中華ロールを付与する
        if (msg.guild?.id === Settings.BEROBA_ID) {
          msg.member?.roles.add(Settings.CHINA_ROLE)
        }
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
  })(msg.content.replace(/^(おはなし|お話し|お話)/, '').trim()) // 予めおはなしは消しておく

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
  const url = getAudioUrl(res.converted.slice(0, 200), {lang: lang})

  // 再生させる音声をキューに追加する
  Add({content: content, url: url, volume: 0.5}, vc)
}

/**
 * 現在流している音声を破棄して次の音声へ進める
 * @param msg DiscordからのMessage
 * @param vc 再生するボイスチャンネル
 */
const skip = async (msg: Discord.Message, vc: Discord.VoiceConnection) => {
  // 現在再生してる音声を破棄
  voice.dispatcher?.destroy()

  // 破棄した音声を出力
  msg.reply(`> ${Status.content}`)
  console.log(`skip ${Status.content}`)

  // キューが残っている場合は次の音声を流す
  if (voice.queue.length > 0) {
    await Play(voice.queue.shift(), vc)
  }

  // 再生中を解除
  voice.stream = false
}

/**
 // 再生させる音声をキューに追加し、再生する
 * @param status 再生させる音声の状態
 * @param vc 再生するボイスチャンネル
 */
export const Add = async (status: CalStatus, vc: Discord.VoiceConnection) => {
  // キューに追加
  voice.queue.push(status)

  // 再生中なら終了
  if (voice.stream === true) return

  // 音声の再生を停止
  await Play(voice.queue.shift(), vc)
}

/**
 * キューの中から先頭の音声を再生させる
 * @param status 再生させる音声の状態
 * @param vc 再生するボイスチャンネル
 */
export const Play = async (status: Option<CalStatus>, vc: Discord.VoiceConnection) => {
  // キャルの状態を更新
  Status.content = status?.content

  // urlから再生させるために`./tmp.mp3`を更新
  const res = await axios.get(status?.url || '', {responseType: 'arraybuffer'})
  fs.writeFileSync(`./tmp.mp3`, Buffer.from(res.data), 'binary')

  // 現在キャルが入っているチャンネルで音声を再生
  const connect = await vc.voice?.channel?.join()
  voice.dispatcher = connect?.play(fs.createReadStream('./tmp.mp3'), {volume: status?.volume})
  // 再生が開始したら、再生中状態にする
  voice.dispatcher?.on('start', () => {
    voice.stream = true
    console.log(`start: ${status?.content}`)
  })
  // 再生が終了した際、キューに値が入っている場合は次の値を再生。
  // ない場合は終了する
  voice.dispatcher?.on('finish', async () => {
    if (voice.queue.length > 0) {
      await Play(voice.queue.shift(), vc)
    }
    // 再生を終了
    voice.stream = false
    console.log(`finish: ${status?.content}`)
  })
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
        if (!/w|ｗ|Ｗ/i.test(s)) {
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
    .replace(/^(おはなし|お話し|お話)/, '') // おはなしを除去
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
