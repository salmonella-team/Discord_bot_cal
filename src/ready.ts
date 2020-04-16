import * as Discord from 'discord.js'
import * as env from './env'

/**
 * キャルが起動した際に通知を送る
 * @param client bot(キャル)のclient
 */
export const Ready = (client: Discord.Client) => {
  const channel = client.channels.cache.get(env.GetVal('READY_CHANNEL')) as Discord.TextChannel
  channel?.send('キャルの参上よ！')
  console.log(`Logged in as ${client.user?.username}!`)
}
