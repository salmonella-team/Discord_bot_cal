import * as Discord from 'discord.js'
import throwEnv from 'throw-env'
import {Ready} from './client/ready'
import {VoiceStateUpdate} from './client/voiceStateUpdate'
import {Message} from './client/message'

const client = new Discord.Client()

// botの起動時に実行
client.on('ready', () => Ready(client))

// ボイスチャンネルの状態が変わったら実行
client.on('voiceStateUpdate', (oldState: Discord.VoiceState, newState: Discord.VoiceState) =>
  VoiceStateUpdate(oldState, newState)
)

// メッセージが送信された際に実行
client.on('message', async (msg: Discord.Message) => Message(msg, client))

client.login(throwEnv('CAL_TOKEN'))
