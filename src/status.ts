import * as Discord from 'discord.js'
import {Status} from './type'

const round = (v: number): number => Math.round(v * 10) / 10

export const calHelp = (msg: Discord.Message) => {
  msg.reply(`魔法一覧よ！
\`\`\`
/cal       キャルの状態を表示
/cal.in    キャルをボイスチャンネルに接続
/cal.out   キャルをボイスチャンネルから切断
/cal.up    キャルの声量を上げる
/cal.down  キャルの声量を下げる
/cal.help  キャルのコマンド一覧

/yabai     ヤバいわよ！
/yabaiwayo プリコネの年末年始はヤバいわよ！
/yabaidesu ヤバいですね☆
/yabayaba  ヤバいヤバいヤバいヤバいヤバいヤバいですね☆
\`\`\`※\`.\`は\` \`で代用可能
`)
  console.log('cal help')
}

export const calStatus = (
  voice: Discord.ClientVoiceManager | null,
  msg: Discord.Message,
  status: Status
) => {
  const channel = voice?.connections.map(v => v.channel.name).toString()
  const join = channel ? `${channel}に接続しているわ` : 'どこのVoiceChannelにも接続しないわ'
  msg.reply(`${join}\n音量は${round(status.Volume)}よ！${status.Mode ? '(DevMode)' : ''}`)
  console.log('cal status')
}

export const calJoin = async (msg: Discord.Message) => {
  const channel = msg.member?.voice.channel
  await channel?.join()
  msg.reply(`${channel?.name}に接続したわよ！`)
  console.log('cal join channel')
}

export const calDisconnect = async (msg: Discord.Message) => {
  const channel = msg.member?.voice.channel
  const connect = await channel?.join()
  connect?.disconnect()
  msg.reply(`${channel?.name}から切断したわ`)
  console.log('cal disconnect channel')
}

export const volumeUp = (msg: Discord.Message, volume: number): number => {
  if (round(volume) >= 1) {
    msg.reply('これ以上音量を上げられないわ')
  } else {
    volume += 0.1
    msg.reply(`音量を上げたわよ！(${round(volume)})`)
  }
  console.log('volume up')
  return volume
}

export const volumeDown = (msg: Discord.Message, volume: number): number => {
  if (round(volume) <= 0.1) {
    msg.reply('これ以上音量を下げられないわ')
  } else {
    volume -= 0.1
    msg.reply(`音量を下げたわよ！(${round(volume)})`)
    console.log('volume down')
  }
  return volume
}

export const switchMode = (msg: Discord.Message, mode: boolean): boolean => {
  mode = !mode
  msg.reply(mode ? 'DevModeになったわよ！' : 'DevModeを解除したわ')
  console.log('switch devMode')
  return mode
}
