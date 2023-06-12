import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'

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

/**
 * ぽじめに通知する
 * @param client botのClient情報
 */
export const NotifyZopime = async (client: Discord.Client) => {
  // vcに入っている人一覧を取得
  const vcList = await FetchSalmonellaVCChannel(client)
  const users = vcList.map(vc => vc.members.map(v => v.user)).flat()

  // ぽじめのidを取得
  const pozimeId = users
    .map(u => Settings.POZIME_ID_ARRAY.find((p: string) => p === u.id))
    .filter(u => u)
    .first()

  // ぽじめがいない場合は終了
  if (!pozimeId) return

  // ttsに通知する
  const channel = client.channels.cache.get(Settings.TTS_ID) as Discord.TextChannel
  await channel?.send(`<@${pozimeId}> 今すぐブルアカやって`)
  return
}

/**
 * サルモネラのボイスチャンネル一覧を取得
 * @param client botのClient情報
 * @return VoiceChannel一覧
 */
const FetchSalmonellaVCChannel = async (client: Discord.Client): Promise<Discord.VoiceChannel[]> => {
  return await Promise.all(Settings.SALMONELLA_VC_ID_ARRAY.map((id: string) => client.channels.fetch(id)))
}
