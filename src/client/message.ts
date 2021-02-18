import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as aloud from '../message/aloud'
import * as cal from '../message/cal'
import * as speak from '../message/speak'
import * as spreadsheet from '../message/spreadsheet'
import {Mode, Status} from '../config/type'
import {VcChannelList} from '../config/etc'

/**
 * キャルの音量とモードを管理
 * @property Volume: Number - キャルの音量
 * @property Mode: Mode - キャルのDevMode
 */
const status: Status = {
  Volume: 0.3,
  Mode: Mode.Off,
}

/**
 * 入力されたメッセージに応じて適切なコマンドを実行する
 * @param msg DiscordからのMessage
 * @param client bot(キャル)のclient
 */
export const Message = async (msg: Discord.Message, client: Discord.Client) => {
  // キャルのメッセージはコマンド実行しない
  if (msg.member?.user.username === 'キャル') return

  let comment: Option<string>

  // 直前のメッセージを削除
  comment = await aloud.RemoveMessage(msg)
  if (comment) return console.log(comment)

  // スペース、カンマ、コロン、イコールの場合でもコマンドが動くようにピリオドに変換する
  const command: string = msg.content.replace(/ |\.|,|:|=/, '.')

  // キャルに関するコマンドを実行
  comment = await calCommands(command, msg, client)
  if (comment) return console.log(comment)

  // 音声再生のコマンドを実行
  comment = await speakCommands(command, msg)
  if (comment) return console.log(comment)

  // 存在しないコマンドの処理
  comment = await notExistCommands(command, msg)
  if (comment) return console.log(comment)

  // 入力された文字を読み上げる処理
  comment = await aloud.Read(msg, client)
  if (comment) return console.log(comment)
}

/**
 * キャルに関するコマンドを実行する。
 * 実行した場合はコメントを返し、しなかった場合は何も返さない
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @param client bot(キャル)のclient
 * @return 実行したコマンドの結果
 */
const calCommands = async (command: string, msg: Discord.Message, client: Discord.Client): Promise<Option<string>> => {
  // 指定のチャンネル以外でキャルが動かないようにする
  const channel = msg.channel as Discord.TextChannel
  if (!(await VcChannelList()).some((c: string) => c === channel?.name)) return

  switch (command.split(' ')[0]) {
    case '/cal':
    case '/cal.status':
      cal.ShowStatus(msg, client.voice, status)
      return 'cal show status'

    case '/cal.in':
    case '/cal.join':
    case '/cal.connect':
      cal.JoinChannel(msg, client.voice)
      return 'cal join channel'

    case '/cal.out':
    case '/cal.discon':
    case '/cal.disconnect':
      cal.Disconnect(msg, client.voice)
      return 'cal disconnect channel'

    case '/cal.up':
      status.Volume = cal.VolumeUp(msg, status.Volume)
      return 'cal volume up'

    case '/cal.down':
      status.Volume = cal.VolumeDown(msg, status.Volume)
      return 'cal volume down'

    case '/cal.vol':
    case '/cal.volume':
      const content = command.split(' ')[1]
      status.Volume = cal.VolumeChange(msg, status.Volume, content)
      return 'cal volume change'

    case '/cal.reset':
      status.Volume = cal.VolumeReset(msg)
      return 'cal reset'

    case '/cal.help':
      cal.Help(msg, status.Mode)
      return 'cal help'

    case '/cal.list':
    case '/cal.wl':
      const name = command.split(' ')[1]
      if (!name) {
        cal.GetWhiteList(msg)
        return 'get whitelist'
      } else {
        cal.AddWhiteList(msg, name)
        return `add whitelist ${name}`
      }

    case '/cal.mode':
      status.Mode = cal.SwitchMode(msg, status.Mode)
      return 'switch devMode'
  }

  switch (true) {
    case /bpm/.test(command): {
      const [, former, ahead, bpm] = command.replace('.', ' ').split(' ').map(Number)
      msg.channel.send((former / ahead) * bpm)
      return 'bpm calc'
    }
  }
}

/**
 * 音声再生のコマンドを実行する。
 * 実行した場合はコメントを返し、しなかった場合は何も返さない
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
const speakCommands = async (command: string, msg: Discord.Message): Promise<Option<string>> => {
  // 指定のチャンネル以外でキャルが動かないようにする
  const channel = msg.channel as Discord.TextChannel
  if (!(await VcChannelList()).some((c: string) => c === channel?.name)) return

  const value: Option<{
    url: string
    text: string
    comment: string
  }> = (() => {
    switch (command) {
      case '/yabai':
      case '/yab':
        return {
          url: Settings.URL.YABAI,
          text: 'ヤバイわよ！',
          comment: 'speak yabai',
        }
      case '/yabai.desu':
      case '/yabd':
        return {
          url: Settings.URL.YABAIDESU,
          text: 'やばいですね☆',
          comment: 'speak yabai.desu',
        }

      case '/yabai.wayo':
      case '/yabw':
        return {
          url: Settings.URL.YABAIWAYO,
          text: 'プリコネの年末年始はヤバイわよ！',
          comment: 'speak yabai.wayo',
        }

      case '/yabai.yaba':
      case '/yaby':
        return {
          url: Settings.URL.YABAIYABA,
          text: 'ヤバイヤバイヤバイヤバイヤバイやばいですね☆',
          comment: 'speak yabai.yaba',
        }

      case 'jinai':
      case 'jinnai':
        return {
          url: Settings.URL.JINNAI,
          text: '笑いのニューウェーブ\n陣 内 智 則',
          comment: 'speak jinnai',
        }

      case 'jinaitomonori':
      case 'jinnaitomonori':
        return {
          url: Settings.URL.JINNAITOMONORI,
          text: '次々に、新しい仕掛けを繰り出すのは、この男〜！\n笑いのニューウェーブ\n陣 内 智 則',
          comment: 'speak jinnaitomonori',
        }

      case 'hikakin':
      case 'Hikakin':
      case 'HIKAKIN':
        return {
          url: Settings.URL.HIKAKIN,
          text: 'HIKAKIN TV Everyday',
          comment: 'speak HIKAKIN',
        }

      case 'helloyoutube':
      case 'helloYouTube':
      case 'HelloYouTube':
        return {
          url: Settings.URL.HELLOYOUTUBE,
          text: 'ブンブンハローYouTube',
          comment: 'speak helloYouTube',
        }

      case 'hikakintv':
      case 'HikakinTv':
      case 'HIKAKINTV':
        return {
          url: Settings.URL.HIKAKINTV,
          text: 'HIKAKIN TV Everyday\nブンブンハローYouTube\nどうもHIKAKINです',
          comment: 'speak HIKAKINTV',
        }

      case 'setokouji':
        return {
          url: Settings.URL.SETOKOUJI,
          text: 'ﾃﾞｰｰｰｰｰﾝ\n瀬戸弘司の動画',
          comment: 'speak setokouji',
        }

      case 'misuzu':
        return {
          url: Settings.URL.MISUZU,
          text: '怒涛の合格 みすず学苑 怒涛の合格 みすず学苑 怒涛の合格',
          comment: 'speak misuzu',
        }

      case 'スシロー':
        return {
          url: Settings.URL.SUSHIRO,
          text: 'スシロー スシロー',
          comment: 'speak sushiro',
        }

      case 'usamaru':
        return {
          url: Settings.URL.USAMARU,
          text: 'ｷﾞｶﾞｷﾞｶﾞﾌﾝﾌﾝｶﾞｶﾞｶﾞｶﾞｶﾞｶﾞｶﾞｶﾞｶﾞ',
          comment: 'speak usamaru',
        }

      case 'ニューイヤーバースト':
        return {
          url: Settings.URL.NYARU,
          text: '何発でも打ち込むわ！ニューイヤーバースト！！！',
          comment: 'speak nyaru',
        }

      case 'heero':
        return {
          url: Settings.URL.HEERO,
          text: 'ヒイロ・ユイ',
          comment: 'speak heero',
        }

      case 'deden':
        return {
          url: Settings.URL.DEDEN,
          text: 'ﾃﾞﾃﾞﾝ',
          comment: 'speak deden',
        }

      case 'gi':
        return {
          url: Settings.URL.GI,
          text: 'ギラティナ',
          comment: 'speak gi',
        }

      case '船越':
        return {
          url: Settings.URL.FUNAKOSHI,
          text: '火曜サスペンス劇場 フラッシュバックテーマ',
          comment: 'speak funakoshi',
        }

      case '片平':
        return {
          url: Settings.URL.KATAHIRA,
          text: '火曜サスペンス劇場 アイキャッチ',
          comment: 'speak katahira',
        }

      case '<.reichan:778714208954220586>':
        return {
          url: Settings.URL.REITYAN,
          text: 'れいちゃん',
          comment: 'speak reityan',
        }

      case '素敵な仲間が増えますよ':
        return {
          url: Settings.URL.KARIN,
          text: 'クソメガネ',
          comment: 'speak karin',
        }

      case 'ざわざわ':
      case 'ざわ…ざわ…':
        return {
          url: Settings.URL.ZAWAZAWA,
          text: 'ざわ…ざわ…',
          comment: 'speak zawazawa',
        }

      case 'お願いマッスル':
        return {
          url: Settings.URL.MUSCLE,
          text: 'お願いマッスル\nめっちゃモテたい',
          comment: 'speak muscle',
        }

      case 'ﾈｺﾁｬﾝ':
        return {
          url: Settings.URL.NEKO,
          text: 'あ～あ\nGUCCIの7万円もするﾈｺﾁｬﾝのTシャツがほしいよ～',
          comment: 'speak neko',
        }
    }

    // DevModeでない場合、下の処理は行わない
    if (!status.Mode) return

    switch (command) {
      case '/yabai.full':
      case '/yabf':
        return {
          url: Settings.URL.YABAIFULL,
          text: 'プリコネの年末年始はヤバイわよ！(Full)',
          comment: 'speak yabai.full',
        }

      case '/yabai.yabai':
        return {
          url: Settings.URL.YABAIYABAI,
          text: 'ヤバイヤバイヤバイヤバイヤバイヤバイ',
          comment: 'speak yabai.yabai',
        }

      case '/yabai.slow':
        return {
          url: Settings.URL.YABAISLOW,
          text: 'ヤバイヤバイヤバイヤバイヤバイやばいですね☆(slow)',
          comment: 'speak yabai.slow',
        }

      case '/yabai.otwr':
        return {
          url: Settings.URL.YABAIOTWR,
          text: 'ヤバイヤバイヤバイヤバイヤバイやばいですね☆(otwr)',
          comment: 'speak yabai.otwr',
        }
    }
  })()

  // コマンドがない場合終了
  if (!value) return

  speak.Play(msg, value.url, status.Volume, value.text)
  return value.comment
}

/**
 * 存在しないコマンドの処理をする。
 * 実行した場合はコメントを返し、しなかった場合は何も返さない
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
const notExistCommands = async (command: string, msg: Discord.Message): Promise<Option<string>> => {
  // 指定のチャンネル以外でキャルが動かないようにする
  const channel = msg.channel as Discord.TextChannel
  if (!(await VcChannelList()).some((c: string) => c === channel?.name)) return

  // コマンドじゃない場合終了
  if (command.charAt(0) !== '/') return

  // ホワイトリストにコマンドがある場合は終了
  const list = await spreadsheet.GetWhiteList()
  const cmd = command.slice(1).split('.')[0]
  if (list.find(l => l === cmd)) return

  msg.reply('そんなコマンドないんだけど！')
  return 'missing command'
}
