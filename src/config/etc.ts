import * as Discord from 'discord.js'
import Option from 'type-of-option'

/**
 * 指定のチャンネルからテキストだけをリストで返す
 * @param client botのClient情報
 * @param id チャンネルID
 * @return テキストリスト
 */
export const FetchTextList = async (client: Discord.Client, id: string): Promise<string[]> => {
  const channel = client.channels.cache.get(id) as Discord.TextChannel
  const msgs = (await channel.messages.fetch()).map(m => m)

  const list = await Promise.all(msgs.map(m => m.content.replace(/\`\`\`\n?/g, '')))
  return list
    .join('\n') // 複数のリストを結合
    .split('\n') // 改行で分割
    .filter(l => l) // 空の行を取り除く
}

/**
 * メッセージからキャルの居るサーバーの接続しているvcを取得
 * @param msg DiscordのMessage情報
 * @param client botのClient情報
 * @return vcの一覧
 */
export const GetVcWithCal = (msg: Discord.Message, client: Discord.Client): Option<Discord.VoiceConnection> => {
  return client.voice?.connections.map(v => v).find(v => v.channel.guild.id === msg.guild?.id)
}
