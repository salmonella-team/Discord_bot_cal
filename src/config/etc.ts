import * as Discord from 'discord.js'
import Settings from 'const-settings'
import Option from 'type-of-option'

/**
 * vc用チャンネルの一覧を取得する
 * @param client botのClient情報
 * @return チャンネル一覧
 */
export const VcChannelList = async (client: Discord.Client): Promise<string[]> => {
  // チャンネル一覧が書いてあるメッセージを取得
  const channel = getTextChannel(Settings.VC_CHANNEL.ID, client)
  const msg = await channel.messages.fetch(Settings.VC_CHANNEL.MESSAGE)

  return msg.content.split('\n')
}

/**
 * 寝落ちチャンネルの一覧を取得する
 * @param client botのClient情報
 * @return チャンネル一覧
 */
export const AfkChannelList = async (client: Discord.Client): Promise<string[]> => {
  // チャンネル一覧が書いてあるメッセージを取得
  const channel = getTextChannel(Settings.AFK_CHANNEL.ID, client)
  const msg = await channel.messages.fetch(Settings.AFK_CHANNEL.MESSAGE)

  return msg.content.split('\n')
}

/**
 * 渡されたidのテキストチャンネルを取得
 * @param id チャンネルのid
 * @param client botのClient情報
 * @return テキストチャンネル
 */
const getTextChannel = (id: string, client: Discord.Client): Discord.TextChannel =>
  client.channels.cache.get(id) as Discord.TextChannel

/**
 * メッセージからキャルの居るサーバーの接続しているvcを取得
 * @param msg DiscordのMessage情報
 * @param client botのClient情報
 * @return vcの一覧
 */
export const GetVcWithCal = (msg: Discord.Message, client: Discord.Client): Option<Discord.VoiceConnection> =>
  client.voice?.connections.map(v => v).find(v => v.channel.guild.id === msg.guild?.id)
