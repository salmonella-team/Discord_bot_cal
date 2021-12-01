import * as Discord from 'discord.js'
import throwEnv from 'throw-env'
import {Ready} from './client/ready'
import {VoiceStateUpdate} from './client/voiceStateUpdate'
import {Message} from './client/message'

export const Client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  ws: {intents: Discord.Intents.ALL},
})

// botの起動時に実行
Client.on('ready', () => Ready(Client))

// ボイスチャンネルの状態が変わったら実行
Client.on('voiceStateUpdate', (oldState: Discord.VoiceState, newState: Discord.VoiceState) =>
  VoiceStateUpdate(oldState, newState, Client)
)

// メッセージが送信された際に実行
Client.on('message', async (msg: Discord.Message) => await Message(msg, Client))

Client.login(throwEnv('CAL_TOKEN'))
