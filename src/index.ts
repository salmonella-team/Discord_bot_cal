import * as Discord from 'discord.js'
import * as dotenv from 'dotenv'
import {Message} from './message'

const client = new Discord.Client()

// .envを有効にする
dotenv.config()

/**
 * キャルを立ち上げた際に実行
 */
client.on('ready', () => console.log(`Logged in as ${client.user?.username}!`))

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
  // Lambda式と同様の処理を行う
  // textがある場合はconsole.logで出力
  (text => text && console.log(text))(Message(msg, client))
)

client.login(process.env.CAL_TOKEN)
