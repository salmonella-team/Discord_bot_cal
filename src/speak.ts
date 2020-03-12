import * as Discord from 'discord.js'

const sound = async (voice: Discord.VoiceState, url: string, volume: number) => {
  const connect = await voice.channel?.join()
  connect?.play(url, {volume: volume})
}

export const Play = (msg: Discord.Message, url: string | undefined, volume: number) => {
  if (!msg.member?.voice.channel)
    return msg.reply('あんたがボイスチャンネルに入ってないと喋れないじゃないの！')
  if (!url) return msg.reply('音源のURLがないわ')
  sound(msg.member?.voice, url, volume)
}
