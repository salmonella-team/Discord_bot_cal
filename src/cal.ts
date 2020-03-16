import {ClientVoiceManager, Message, VoiceConnection, VoiceChannel} from 'discord.js'
import {Option, Mode, Status} from './type'

/**
 * 小数第一位を四捨五入して返す
 * @param n 四捨五入する数値
 * @return 四捨五入された整数
 */
const roundFloat = (n: number): number => Math.round(n * 10) / 10

/**
 * ClientVoiceManagerからVoiceConnectionを取得する
 * @param voice clientのClientVoiceManager
 * @return 取得したVoiceConnection
 */
const getVoiceConnection = (voice: Option<ClientVoiceManager>): Option<VoiceConnection> =>
  voice?.connections.map(v => v)[0]

/**
 * キャルが接続しているボイスチャンネルと音量とModeをDiscordのメッセージへ送信する
 * @param msg DiscordからのMessage
 * @param voice clientのClientVoiceManager
 * @param status キャルのステータス
 */
export const ShowStatus = (msg: Message, voice: Option<ClientVoiceManager>, status: Status) => {
  const channel: Option<string> = voice?.connections.map(v => v.channel.name).toString()
  const join = channel ? `${channel}に接続しているわ` : 'どこのボイスチャンネルにも接続してないわ'
  msg.reply(`${join}\n音量は${roundFloat(status.Volume)}よ！${status.Mode ? '(DevMode)' : ''}`)
}

/**
 * メッセージ送信者と同じボイスチャンネルにキャルを接続させ、接続状況をDiscordのメッセージへ送信する
 * @param msg DiscordからのMessage
 * @param voice clientのClientVoiceManager
 */
export const JoinChannel = async (msg: Message, voice: Option<ClientVoiceManager>) => {
  // メッセージ送信者がボイスチャンネル入っていない場合終了
  const channel: Option<VoiceChannel> = msg.member?.voice.channel
  if (!channel) return msg.reply('あんたがボイスチャンネルに居ないと入れないじゃないの！')

  // キャルが現在の接続している場所と同じチャンネルに入ろうとした場合終了
  const connect: Option<VoiceConnection> = getVoiceConnection(voice)
  if (channel?.name === connect?.channel?.name) return msg.reply(`もう${channel?.name}に接続してるわ`)

  await channel?.join()
  msg.reply(`${channel?.name}に接続したわよ！`)
}

/**
 * キャルをボイスチャンネルから接続させ、切断状況をDiscordのメッセージへ送信する
 * @param msg DiscordからのMessage
 * @param voice clientのClientVoiceManager
 */
export const Disconnect = (msg: Message, voice: Option<ClientVoiceManager>) => {
  // キャルがボイスチャンネル入っていない場合終了
  const connect: Option<VoiceConnection> = getVoiceConnection(voice)
  if (!connect) return msg.reply('あたしはどこのボイスチャンネルに入ってないわよ')

  connect?.disconnect()
  msg.reply(`${connect?.channel?.name}から切断したわ`)
}

/**
 * キャルの音量を0.1上げて、音量をDiscordのメッセージへ送信する
 * @param msg DiscordからのMessage
 * @param volume キャルの音量
 * @return 変更した音量
 */
export const VolumeUp = (msg: Message, volume: number): number => {
  // キャルの音量を1以上に上げない
  if (roundFloat(volume) >= 1) {
    msg.reply('これ以上音量を上げられないわ')
  } else {
    volume += 0.1
    msg.reply(`音量を上げたわよ！(${roundFloat(volume)})`)
  }
  return volume
}

/**
 * キャルの音量を0.1下げて、音量をDiscordのメッセージへ送信する
 * @param msg DiscordからのMessage
 * @param volume キャルの音量
 * @return 変更した音量
 */
export const VolumeDown = (msg: Message, volume: number): number => {
  // キャルの音量を0.1以下に下げない
  if (roundFloat(volume) <= 0.1) {
    msg.reply('これ以上音量を下げられないわ')
  } else {
    volume -= 0.1
    msg.reply(`音量を下げたわよ！(${roundFloat(volume)})`)
  }
  return volume
}

/**
 * キャルのコマンド一覧をDiscordのメッセージへ送信する
 * @param msg DiscordからのMessage
 */
export const Help = (msg: Message) => {
  const help = `魔法一覧よ！\`\`\`
/cal       キャルの状態を表示
/cal.in    キャルをボイスチャンネルに接続
/cal.out   キャルをボイスチャンネルから切断
/cal.up    キャルの声量を上げる
/cal.down  キャルの声量を下げる
/cal.help  キャルのコマンド一覧

/yabai       ヤバいわよ！
/yabai.wayo  プリコネの年末年始はヤバいわよ！
/yabai.desu  ヤバいですね☆
/yabai.yaba  ヤバいヤバいヤバいヤバいヤバいヤバいですね☆
\`\`\`※\`.\`は\` \`で代用可能　例:\`/cal help\`
`
  msg.reply(help)
}

/**
 * キャルのDevModeを切り替えて、Mode状態をDiscordのメッセージへ送信する
 * @param msg DiscordからのMessage
 * @param mode キャルのMode
 * @return 変更したMode
 */
export const SwitchMode = (msg: Message, mode: Mode): Mode => {
  // ModeのOn・Offを切り替える
  mode = ~mode
  msg.reply(mode ? 'DevModeになったわよ！' : 'DevModeを解除したわ')
  return mode
}
