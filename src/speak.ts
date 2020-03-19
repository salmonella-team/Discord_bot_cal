import * as Discord from 'discord.js'
import {Option} from './type'

/**
 * 音源をボイスチャンネルで再生させる
 * @param voice 再生先のVoiceState
 * @param url 再生させる音源のURL
 * @param volume キャルの音量
 */
const sound = async (voice: Discord.VoiceState, url: string, volume: number) => {
  const connect = await voice.channel?.join()
  connect?.play(url, {volume: volume})
}

/**
 * 音源をボイスチャンネルに再生させ、フィードバックを返す。
 * 送信者がボイスチャンネルに入って居ない場合や音源のURLがない場合は、Discordのメッセージへ送信する
 * @param msg DiscordからのMessage
 * @param url 再生させる音源のURL
 * @param volume キャルの音量
 */
export const Play = async (msg: Discord.Message, url: Option<string>, volume: number, text: string) => {
  // 送信者がボイスチャンネルに入って居ない場合終了
  if (!msg.member?.voice.channel)
    return msg.reply('あんたがボイスチャンネルに居ないと喋れないじゃないの！')

  // URLの音源がない場合終了
  if (!url) return msg.reply('音源のURLがないわ')

  sound(msg.member?.voice, url, volume).then(_ => msg.reply(text))
}
