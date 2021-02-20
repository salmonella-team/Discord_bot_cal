import * as Discord from 'discord.js'
import Settings from 'const-settings'
import Option from 'type-of-option'

/**
 * vc用扱いのチャンネル一覧を取得する
 * @param client bot(キャル)のclient
 * @return チャンネル一覧
 */
export const VcChannelList = async (client: Discord.Client): Promise<string[]> => {
  // チャンネル一覧が書いてあるメッセージを取得
  const channel = getTextChannel(Settings.VC_CHANNEL.ID, client)
  const msg = await channel.messages.fetch(Settings.VC_CHANNEL.MESSAGE)

  return msg.content.split('\n')
}

/**
 * 渡されたidのテキストチャンネルを取得
 * @param id チャンネルのid
 * @param client bot(キャル)のclient
 * @return テキストチャンネル
 */
const getTextChannel = (id: string, client: Discord.Client): Discord.TextChannel =>
  client.channels.cache.get(id) as Discord.TextChannel

/**
 * メッセージからキャルの居るサーバーの接続しているvcを取得
 * @param msg DiscordからのMessage
 * @param client bot(キャル)のclient
 * @return vcの一覧
 */
export const GetVcWithCal = (msg: Discord.Message, client: Discord.Client): Option<Discord.VoiceConnection> =>
  client.voice?.connections.map(v => v).find(v => v.channel.guild.id === msg.guild?.id)
