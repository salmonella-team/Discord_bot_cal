import * as Discord from 'discord.js'
import * as env from './env'
import {Ready} from './ready'
import {VoiceStateUpdate} from './voiceStateUpdate'
import {Message} from './message'

const client = new Discord.Client()

// botの起動時に実行
client.on('ready', () => Ready(client))

// ボイスチャンネルの状態が変わったら実行
client.on('voiceStateUpdate', (oldState: Discord.VoiceState, newState: Discord.VoiceState) =>
  VoiceStateUpdate(oldState, newState)
)

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

client.login(env.GetVal('CAL_TOKEN'))
