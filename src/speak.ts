import * as Discord from 'discord.js'
import {Option} from './type'

const sound = async (voice: Discord.VoiceState, url: string, volume: number) => {
  const connect = await voice.channel?.join()
  connect?.play(url, {volume: volume})
}

export const Play = (msg: Discord.Message, url: Option<string>, volume: number) => {
  if (!msg.member?.voice.channel)
    return msg.reply('あんたがボイスチャンネルに居ないと喋れないじゃないの！')
  if (!url) return msg.reply('音源のURLがないわ')
  sound(msg.member?.voice, url, volume)
}
