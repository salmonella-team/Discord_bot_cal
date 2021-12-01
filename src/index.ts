import * as Discord from 'discord.js'
import * as cron from 'node-cron'
import throwEnv from 'throw-env'
import {Ready} from './client/ready'
import {VoiceStateUpdate} from './client/voiceStateUpdate'
import {Message} from './client/message'
import * as twitter from './config/twitter'

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

cron.schedule('0 1,2,3,4,5,7,9,11,16,21,26,31,32,33,34,35,37,39,41,46,51,56 * * * *', () => twitter.Post())

Client.login(throwEnv('CAL_TOKEN'))
