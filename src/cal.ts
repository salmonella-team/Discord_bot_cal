import {ClientVoiceManager, Message} from 'discord.js'
import {Option, Mode, Status} from './type'

const round = (n: number): number => Math.round(n * 10) / 10

const getVoiceConnection = (voice: Option<ClientVoiceManager>) => voice?.connections.map(v => v)[0]

export const ShowStatus = (msg: Message, voice: Option<ClientVoiceManager>, status: Status) => {
  const channel = voice?.connections.map(v => v.channel.name).toString()
  const join = channel ? `${channel}に接続しているわ` : 'どこのボイスチャンネルにも接続してないわ'
  msg.reply(`${join}\n音量は${round(status.Volume)}よ！${status.Mode ? '(DevMode)' : ''}`)
}

export const JoinChannel = async (msg: Message, voice: Option<ClientVoiceManager>) => {
  const channel = msg.member?.voice.channel
  if (!channel) return msg.reply('あんたがボイスチャンネルに居ないと入れないじゃないの！')

  const connect = getVoiceConnection(voice)
  if (channel?.name === connect?.channel?.name) return msg.reply(`もう${channel?.name}に接続してるわ`)

  await channel?.join()
  msg.reply(`${channel?.name}に接続したわよ！`)
}

export const Disconnect = (msg: Message, voice: Option<ClientVoiceManager>) => {
  const connect = getVoiceConnection(voice)
  if (!connect) return msg.reply('あたしはどこのボイスチャンネルに入ってないわよ')

  connect?.disconnect()
  msg.reply(`${connect?.channel?.name}から切断したわ`)
}

export const VolumeUp = (msg: Message, volume: number): number => {
  if (round(volume) >= 1) {
    msg.reply('これ以上音量を上げられないわ')
  } else {
    volume += 0.1
    msg.reply(`音量を上げたわよ！(${round(volume)})`)
  }
  return volume
}

export const VolumeDown = (msg: Message, volume: number): number => {
  if (round(volume) <= 0.1) {
    msg.reply('これ以上音量を下げられないわ')
  } else {
    volume -= 0.1
    msg.reply(`音量を下げたわよ！(${round(volume)})`)
  }
  return volume
}

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

export const SwitchMode = (msg: Message, mode: Mode): Mode => {
  mode = ~mode
  msg.reply(mode ? 'DevModeになったわよ！' : 'DevModeを解除したわ')
  return mode
}
