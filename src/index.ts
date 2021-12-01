import * as Discord from 'discord.js'
import * as cron from 'node-cron'
import throwEnv from 'throw-env'
import {Ready} from './client/ready'
import {VoiceStateUpdate} from './client/voiceStateUpdate'
import {Message} from './client/message'
import {MessageReactionAdd} from './client/messageReactionAdd'
import * as twitter from './config/twitter'

export const Client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  ws: {intents: Discord.Intents.ALL},
})

Client.on('ready', () => Ready(Client))

Client.on('voiceStateUpdate', (oldState, newState) => VoiceStateUpdate(oldState, newState, Client))

Client.on('message', msg => Message(msg, Client))

Client.on('messageReactionAdd', (react, user) => MessageReactionAdd(<Discord.MessageReaction>react, user))

cron.schedule('0 1,2,3,4,5,7,9,11,16,21,26,31,32,33,34,35,37,39,41,46,51,56 * * * *', () => twitter.Post())

Client.login(throwEnv('CAL_TOKEN'))
