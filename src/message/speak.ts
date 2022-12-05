import * as Discord from 'discord.js'
import * as fs from 'fs'
import moji from 'moji'
import axios from 'axios'
import fetch from 'node-fetch'
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
  if (/:heavy_check_mark:/.test(msg.content)) return

  // 読み上げするチャンネル以外では喋らない
  const channel = msg.channel as Discord.TextChannel
  if (!(await etc.VcChannelList(client)).some((c: string) => c === channel?.name)) return

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

  // 6行以上は読み上げないようにする
  if (msg.content.split('\n').length > 5) return

  // 5文字以上の数字のみは読み上げない
  if (/^\d{5,}$/i.test(msg.content)) return

  // 言語を判別
  const lang: any = ((str: string) => {
    switch (true) {
      case /^(en|us)\s+/i.test(str):
        return 'en-US'
      case /^(zh|cn)\s+/i.test(str):
        return 'zh-CN'
      case /^es\s+/i.test(str):
        return 'es-ES'
      case /^ru\s+/i.test(str):
        return 'ru-RU'
      case /^de\s+/i.test(str):
        return 'de-DE'
      case /^it\s+/i.test(str):
        return 'it-IT'
      case /^(vi|vn)\s+/i.test(str):
        return 'vi-VN'
      case /^gb\s+/i.test(str):
        return 'en-GB'
      case /^(ja|jp)\s+/i.test(str):
      default:
        return 'ja-JP'
    }
  })(msg.content.replace(/^(おはなし|お話し|お話)/, '').trim()) // 予めおはなしは消しておく

  // 入力された文字を読み上げられる形に整形
  const content = await aloudFormat(msg.content, msg, client)

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
  Add({content: content, url: url, volume: 0.3, flag: true}, vc)
}

/**
 * 現在流している音声を破棄して次の音声へ進める
 * @param msg DiscordからのMessage
 * @param vc 再生するボイスチャンネル
 */
const skip = async (msg: Discord.Message, vc: Discord.VoiceConnection) => {
  // 現在再生してる音声を破棄
  voice.dispatcher?.destroy()

  // 最初の行だけ取得
  const content = Status.content?.split('\n')[0]

  // 済の絵文字を付ける
  msg.react(Settings.SUMI_EMOJI)

  // 破棄した音声を出力
  console.log(`skip ${content}`)

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

  // 現在キャルが入っているチャンネルに接続
  const connect = await vc.voice?.channel?.join()

  // 1つ目の音声ファイルをダウンロード
  const res1 = await fetch(status?.url ?? '').then(res => res.arrayBuffer())
  fs.writeFileSync(`./tmp1.mp3`, Buffer.from(res1), 'binary')

  // urlから再生させるために`./tmp.mp3`を更新
  let tmp = './tmp1.mp3'

  // 読み上げの場合は低い音声になるまでダウンロードする
  if (status?.flag) {
    //   // 10回超えたら諦めて音声を再生する
    //   for (let i = 0; i < 10; i++) {
    //     // 2つ目の音声ファイルをダウンロード
    //     const res2 = await fetch(status?.url ?? '').then(res => res.arrayBuffer())
    //     fs.writeFileSync(`./tmp2.mp3`, Buffer.from(res2), 'binary')
    //     // 両方のファイルサイズを取得
    //     const size1 = fs.statSync('./tmp1.mp3').size
    //     const size2 = fs.statSync('./tmp2.mp3').size
    //     // 小さい方を再生、サイズが同じならもう一度ダウンロード
    //     if (size1 < size2) {
    //       tmp = './tmp1.mp3'
    //       break
    //     } else if (size1 > size2) {
    //       tmp = './tmp2.mp3'
    //       break
    //     }
    //   }
  }

  // 音声を再生
  voice.dispatcher = connect?.play(fs.createReadStream(tmp), {volume: status?.volume})

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
 * @param msg DiscordからのMessage
 * @param client bot(キャル)のclient
 * @return 整形した後の文字列
 */
const aloudFormat = async (content: string, msg: Discord.Message, client: Discord.Client): Promise<string> => {
  // 履歴埋めの例外処理を書く
  if (content.replace(/^(en|us|zh|cn|es|ru|de|it|vi|vn|gb|ja|jp)\s+/i, '').trim() === '履歴埋め')
    return '君プリコネ上手いね？誰推し？てかアリーナやってる？履歴埋めってのがあってさ、一瞬！1回だけやってみない？大丈夫すぐやめれるし気持ちよくなれるよ'

  /**
   * 行末wをワラに変える
   * @param str 変換する文字列
   * @return 変換した文字列
   */
  const replaceWara = (str: string): string => {
    let flag = false
    return str
      .replace(/w{2,}/gi, 'w')
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

  /**
   * 引数に渡されたリストを順番に取り出すクラスを作成する
   * @param list リスト
   * @returns リストを順番に取り出すクラス
   */
  const order = (list: string[]) => {
    class Order {
      list: string[]
      count: number

      /**
       * 秒数を順番に取り出すクラス
       * @param list 秒数のリスト
       */
      constructor(list: string[]) {
        this.list = list
        this.count = 0
      }

      /**
       * リストを順番に取り出し、カウントを進める
       * @returns リスト
       */
      pop() {
        return this.list[this.count++]
      }
    }
    return new Order(list)
  }

  content = moji(content)
    .convert('HK', 'ZK') // 半角カナを全角カナに変換
    .toString() // String型に戻す
    .replace(/^(おはなし|お話し|お話)/, '') // おはなしを除去
    .trim() // 余分な空白を除去
    .replace(/^(en|us|zh|cn|es|ru|de|it|vi|vn|gb|ja|jp)\s+/i, '') // 先頭の言語を除去
    .trim() // 余分な空白を除去
    .replace(/https?:\/\/\S+/g, '') // URLを除去
    .split('\n') // 一行ずつに分解
    .map(replaceWara) // 文末のwをワラに変える
    .join('') // 分解した文字を結合

  // <>に囲まれた値のリストを取得
  const list = content.match(/<[^<>]*>/g)?.map(e => {
    if (/@!/.test(e)) {
      // メンション
      const member = msg.guild?.members.cache.get(e.replace(/[^\d]/g, ''))
      // ニックネームがある場合はニックネームを優先
      return member?.nickname ? `@${member?.nickname}` : `@${member?.user.username}` ?? ''
    } else if (/@&/.test(e)) {
      // ロール
      const role = msg.guild?.roles.cache.get(e.replace(/[^\d]/g, ''))
      return `@${role?.name}` ?? ''
    } else if (/@/.test(e)) {
      // メンション
      const member = msg.guild?.members.cache.get(e.replace(/[^\d]/g, ''))
      return member?.nickname ? `@${member?.nickname}` : `@${member?.user.username}` ?? ''
    } else if (/#/.test(e)) {
      // チャンネル
      const channel = msg.guild?.channels.cache.get(e.replace(/[^\d]/g, ''))
      return `#${channel?.name}` ?? ''
    } else if (/<a?:/.test(e)) {
      // 絵文字
      return e.split(':')[1]
    } else {
      return e
    }
  })

  if (list) {
    // 埋め込みを順番に取り出すクラスを作成
    const embedded = order(list)

    // 埋め込みを元に戻す
    content = content
      .replace(/<[^<>]*>/g, '１') // 埋め込みの場所を存在しない１に一時的に置き換える
      .split('') // 1文字づつ分解
      .map(tl => (/１/.test(tl) ? embedded.pop() : tl)) // １を埋め込みに置き換える
      .join('') // 全ての行を結合
  }

  // 文字の読みを修正する
  content = await fixReading(content, client)

  return content
    .replace(/_|＿|／|￣|＞|\||\`|x|＼|ヽ|\*|\^|´|ω|ก/g, '') // 余計な記号を全て取り除く
    .slice(0, 200) // 200文字以上は喋れないので切り捨てる
}

/**
 * 特定の文字列の読みを修正する
 * @param content 修正する前の文字列
 * @param client bot(キャル)のclient
 * @return 修正した後の文字列
 */
const fixReading = async (content: string, client: Discord.Client): Promise<string> => {
  // TL修正で使うチャンネルを取得
  const channel = client.channels.cache.get(Settings.FIX_READING_ID) as Discord.TextChannel
  const msgs = (await channel.messages.fetch()).map(m => m).reverse()

  const list = await Promise.all(msgs.map(m => m.content.replace(/\`\`\`\n?/g, '')))
  list
    .join('\n') // 複数のリストを結合
    .split('\n') // 改行で分割
    .filter(l => l) // 空の行を取り除く
    .map(l => l.replace(/:\s*/, ':').split(':')) // `:`で分割
    .forEach(l => {
      content = content.replace(new RegExp(l[0], `${!l[2] ? 'i' : ''}g`), l[1])
    })
  return content
}
