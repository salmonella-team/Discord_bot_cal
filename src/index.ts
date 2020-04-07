import * as Discord from 'discord.js'
import * as dotenv from 'dotenv'
import {Message} from './message'

const client = new Discord.Client()

// .envを有効にする
dotenv.config()

/**
 * キャルが起動した際に通知を送る
 */
client.on('ready', () => {
  // '各botのおはよう'チャンネルのid
  const id = '632987047350501377'
  const channels = client.channels.cache.get(id) as Discord.TextChannel
  channels?.send('キャルの参上よ！')

  console.log(`Logged in as ${client.user?.username}!`)
})

/**
 * ボイスチャンネルの入退出、ミュートの解除等を行った際に実行
 */
client.on('voiceStateUpdate', async (oldState: Discord.VoiceState, newState: Discord.VoiceState) => {
  // 退出前の処理
  if (oldState.channel) {
    const users = oldState.channel?.members.map(m => m.user.username).toString()
    // ボイスチャンネルにキャルしか居ない場合は、キャルを切断する
    if (users === 'キャル') {
      const connect = await oldState.channel?.join()
      connect?.disconnect()
    }
  }

  // 退出後の処理
  if (newState.channel) {
    // キャルをイベントがあったチャンネルに接続する
    await newState.channel?.join()
  }
})

/**
 * メッセージが送信された際に実行
 */
client.on('message', async (msg: Discord.Message) =>
  /**
   * textに値がある場合はconsole.logで出力、ない場合は何もしない
   * @param text Messageからの戻り値
   */
  (text => text && console.log(text))(await Message(msg, client))
)

client.login(process.env.CAL_TOKEN)
