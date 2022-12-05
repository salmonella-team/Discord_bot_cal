import * as Discord from 'discord.js'
import Twitter from 'twitter'
import throwEnv from 'throw-env'
import Settings from 'const-settings'
import {Client} from '..'

const client = new Twitter({
  consumer_key: throwEnv('CONSUMER_KEY'),
  consumer_secret: throwEnv('CONSUMER_SECRET'),
  access_token_key: throwEnv('ACCESS_TOKEN_KEY'),
  access_token_secret: throwEnv('ACCESS_TOKEN_SECRET'),
})

/**
 * 公式情報に更新があった場合に投稿する
 */
export const Post = async () => {
  return

  const now = getCurrentDate()
  console.log(`Tweet: ${now}`)
  const tweet = await client.get('statuses/user_timeline', {screen_name: 'priconne_redive', count: 5})
  const idList1: string[] = tweet.map((t: any) => t.id_str).reverse()

  const channel = getTextChannel(Settings.OFFICIAL_INFORMATION)
  const msgs = await channel.messages.fetch({limit: 5})
  const idList2 = msgs.map(m => m).map(m => m.content.split('priconne_redive/status/')[1])

  for (const id of idList1) {
    const result = idList2.find(i => i === id)
    if (result) continue

    const text = `${now}\nhttps://twitter.com/priconne_redive/status/${id}`
    await channel.send(text)
    console.log(`Send Tweet ${text}`)
  }
}

/**
 * 渡されたidのテキストチャンネルを取得
 * @param id チャンネルのid
 * @param client bot(キャル)のclient
 * @return テキストチャンネル
 */
const getTextChannel = (id: string): Discord.TextChannel => {
  return Client.channels.cache.get(id) as Discord.TextChannel
}

/**
 * 現在の日付と時刻を取得
 * @return 取得した文字列
 */
const getCurrentDate = (): string => {
  const d = new Date()
  const yyyy = `${d.getFullYear()}`.padStart(2, '0')
  const MM = `${d.getMonth() + 1}`.padStart(2, '0')
  const dd = `${d.getDate()}`.padStart(2, '0')
  const HH = `${d.getHours()}`.padStart(2, '0')
  const mm = `${d.getMinutes()}`.padStart(2, '0')
  return `${yyyy}/${MM}/${dd} ${HH}:${mm}`
}
