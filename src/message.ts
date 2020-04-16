import * as Discord from 'discord.js'
import * as cal from './cal'
import * as speak from './speak'
import * as spreadsheet from './spreadsheet'
import * as env from './env'
import {Mode, Status, Option} from './type'

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
 * @return 実行したコマンドの結果
 */
export const Message = async (msg: Discord.Message, client: Discord.Client) => {
  // キャルのメッセージはコマンド実行しない
  if (msg.member?.user.username === 'キャル') return

  // 指定のチャンネル以外でキャルが動かないようにする
  const channel = msg.channel as Discord.TextChannel
  if (channel?.name !== '効果音-001' && channel?.name !== 'テスト用') return

  // スペース、カンマ、コロン、イコールの場合でもコマンドが動くようにピリオドに変換する
  const command: string = msg.content.replace(/ |\.|,|:|=/, '.')

  let comment: Option<string>

  // キャルに関するコマンドを実行
  comment = calCommands(command, msg, client)
  if (comment) return console.log(comment)

  // 音声再生のコマンドを実行
  comment = speakCommands(command, msg)
  if (comment) return console.log(comment)

  // 存在しない場合の処理
  if (command.charAt(0) !== '/') return

  // ホワイトリストにコマンドがある場合は終了
  const list = await spreadsheet.GetWhiteList()
  if (list.find(l => l === command.slice(1))) return

  msg.reply('そんなコマンドないんだけど！')
  console.log('missing command')
}

/**
 * キャルに関するコマンドを実行する。
 * 実行した場合はコメントを返し、しなかった場合は何も返さない
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @param client bot(キャル)のclient
 * @return 実行したコマンドの結果
 */
const calCommands = (command: string, msg: Discord.Message, client: Discord.Client): Option<string> => {
  switch (command.split(' ')[0]) {
    case '/cal':
    case '/cal.status':
      cal.ShowStatus(msg, client.voice, status)
      return 'cal show status'

    case '/cal.in':
    case '/cal.join':
      cal.JoinChannel(msg, client.voice)
      return 'cal join channel'

    case '/cal.out':
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

    case '/cal.mode':
      status.Mode = cal.SwitchMode(msg, status.Mode)
      return 'switch devMode'
  }

  // DevModeでない場合、下の処理は行わない
  if (!status.Mode) return

  switch (command.split(' ')[0]) {
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
  }
}

/**
 * 音声再生のコマンドを実行する。
 * 実行した場合はコメントを返し、しなかった場合は何も返さない
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
const speakCommands = (command: string, msg: Discord.Message): Option<string> => {
  const value: Option<{
    env: string
    text: string
    comment: string
  }> = (() => {
    switch (command) {
      case '/yabai':
      case '/yab':
        return {
          env: env.GetVal('YABAI_URL'),
          text: 'ヤバいわよ！',
          comment: 'speak yabai',
        }
      case '/yabai.desu':
      case '/yabd':
        return {
          env: env.GetVal('YABAIDESU_URL'),
          text: 'ヤバいですね☆',
          comment: 'speak yabai.desu',
        }

      case '/yabai.wayo':
      case '/yabw':
        return {
          env: env.GetVal('YABAIWAYO_URL'),
          text: 'プリコネの年末年始はヤバいわよ！',
          comment: 'speak yabai.wayo',
        }

      case '/yabai.yaba':
      case '/yaby':
        return {
          env: env.GetVal('YABAIYABA_URL'),
          text: 'ヤバいヤバいヤバいヤバいヤバいヤバいですね☆',
          comment: 'speak yabai.yaba',
        }
    }

    // DevModeでない場合、下の処理は行わない
    if (!status.Mode) return

    switch (command) {
      case '/yabai.full':
      case '/yabf':
        return {
          env: env.GetVal('YABAIFULL_URL'),
          text: 'プリコネの年末年始はヤバいわよ！(Full)',
          comment: 'speak yabai.full',
        }

      case '/yabai.yabai':
        return {
          env: env.GetVal('YABAYABAI_URL'),
          text: 'ヤバいヤバいヤバいヤバいヤバいヤバい',
          comment: 'speak yabai.yabai',
        }

      case '/yabai.slow':
        return {
          env: env.GetVal('YABAISLOW_URL'),
          text: 'ヤバいヤバいヤバいヤバいヤバいヤバいですね☆(slow)',
          comment: 'speak yabai.slow',
        }

      case '/yabai.otwr':
        return {
          env: env.GetVal('YABAIOTWR_URL'),
          text: 'ヤバいヤバいヤバいヤバいヤバいヤバいですね☆(otwr)',
          comment: 'speak yabai.otwr',
        }
    }
  })()

  // コマンドがない場合終了
  if (!value) return

  speak.Play(msg, value.env, status.Volume, value.text)
  return value.comment
}
