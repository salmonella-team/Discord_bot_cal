import * as Discord from 'discord.js'
import * as cal from './cal'
import * as speak from './speak'
import * as spreadsheet from './spreadsheet'
import * as env from './env'
import {Option, Mode, Status} from './type'

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
export const Message = async (msg: Discord.Message, client: Discord.Client): Promise<Option<string>> => {
  // キャルのメッセージはコマンド実行しない
  if (msg.member?.user.username === 'キャル') return

  // 指定のチャンネル以外でキャルが動かないようにする
  const channel = msg.channel as Discord.TextChannel
  if (channel?.name !== '効果音-001' && channel?.name !== 'テスト用') return

  // スペース、カンマ、コロン、イコールの場合でもコマンドが動くようにピリオドに変換する
  const command = msg.content.replace(/ |\.|,|:|=/, '.')

  // キャルに関するコマンド
  // prettier-ignore
  switch (command.split(' ')[0]) {
    case '/cal': case '/cal.status':
      cal.ShowStatus(msg, client.voice, status)
      return 'cal show status'

    case '/cal.in': case '/cal.join':
      cal.JoinChannel(msg, client.voice)
      return 'cal join channel'

    case '/cal.out': case '/cal.disconnect':
      cal.Disconnect(msg, client.voice)
      return 'cal disconnect channel'

    case '/cal.up':
      status.Volume = cal.VolumeUp(msg, status.Volume)
      return 'cal volume up'

    case '/cal.down':
      status.Volume = cal.VolumeDown(msg, status.Volume)
      return 'cal volume down'

    case '/cal.vol': case '/cal.volume':
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

  const volume = status.Volume

  // 音声再生のコマンド
  // prettier-ignore
  switch (command) {
    case '/yabai': case '/yab':
      speak.Play(msg, env.GetVal('YABAI_URL'), volume, 'ヤバいわよ！')
      return 'speak yabai'

    case '/yabai.desu': case '/yabd':
      speak.Play(msg, env.GetVal('YABAIDESU_URL'), volume, 'ヤバいですね☆')
      return 'speak yabai.desu'

    case '/yabai.wayo': case '/yabw':
      speak.Play(msg, env.GetVal('YABAIWAYO_URL'), volume, 'プリコネの年末年始はヤバいわよ！')
      return 'speak yabai.wayo'

    case '/yabai.yaba': case '/yaby':
      speak.Play(msg, env.GetVal('YABAIYABA_URL'), volume, 'ヤバいヤバいヤバいヤバいヤバいヤバいですね☆')
      return 'speak yabai.yaba'
  }

  // DevModeの場合のみ実行
  if (status.Mode) {
    // prettier-ignore
    switch (command.split(' ')[0]) {
      case '/cal.list': case '/cal.wl':
        const name = command.split(' ')[1]
        if (!name) {
          cal.GetWhiteList(msg)
          return 'get whitelist'
        } else {
          cal.AddWhiteList(msg, name)
          return `add whitelist ${name}`
        }
    }

    // prettier-ignore
    switch (command) {
      case '/yabai.full': case '/yabf':
        speak.Play(msg, env.GetVal('YABAIFULL_URL'), volume, 'プリコネの年末年始はヤバいわよ！(Full)')
        return 'speak yabai.full'

      case '/yabai.yabai':
        speak.Play(msg, env.GetVal('YABAYABAI_URL'), volume, 'ヤバいヤバいヤバいヤバいヤバいヤバい')
        return 'speak yabai.yabai'

      case '/yabai.slow':
        speak.Play(msg, env.GetVal('YABAISLOW_URL'), volume, 'ヤバいヤバいヤバいヤバいヤバいヤバいですね☆(slow)')
        return 'speak yabai.slow'

      case '/yabai.otwr':
        speak.Play(msg, env.GetVal('YABAIOTWR_URL'), volume, 'ヤバいヤバいヤバいヤバいヤバいヤバいですね☆(otwr)')
        return 'speak yabai.otwr'
    }
  }

  // 存在しない場合の処理
  if (command.charAt(0) !== '/') return

  // ホワイトリストにコマンドがある場合は終了
  const list = await spreadsheet.GetWhiteList()
  if (list.find(l => l === command.slice(1))) return

  msg.reply('そんなコマンドないんだけど！')
  return 'missing command'
}
