import * as Discord from 'discord.js'
import {Message} from 'discord.js'
import {Option, Mode, Status} from './type'

const round = (n: number): number => Math.round(n * 10) / 10

export const ShowStatus = (voice: Option<Discord.ClientVoiceManager>, msg: Message, status: Status) => {
  const channel = voice?.connections.map(v => v.channel.name).toString()
  const join = channel ? `${channel}に接続しているわ` : 'どこのボイスチャンネルにも接続してないわ'
  msg.reply(`${join}\n音量は${round(status.Volume)}よ！${status.Mode ? '(DevMode)' : ''}`)
}

const getChannel = (msg: Message) => msg.member?.voice.channel

export const JoinChannel = async (msg: Message) => {
  const channel = getChannel(msg)
  await channel?.join()
  msg.reply(`${channel?.name}に接続したわよ！`)
}

export const Disconnect = async (msg: Message) => {
  const channel = getChannel(msg)
  const connect = await channel?.join()
  connect?.disconnect()
  msg.reply(`${channel?.name}から切断したわ`)
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
