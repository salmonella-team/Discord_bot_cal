import './config/prototype'
import * as Discord from 'discord.js'
import * as cron from 'node-cron'
import throwEnv from 'throw-env'
import {Ready} from './client/ready'
import {VoiceStateUpdate} from './client/voiceStateUpdate'
import {Message} from './client/message'
import {MessageReactionAdd} from './client/messageReactionAdd'
import {NotifyZopime} from './config/etc'

export const Client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  ws: {intents: Discord.Intents.ALL},
})

Client.on('ready', () => Ready(Client))

Client.on('voiceStateUpdate', (oldState, newState) => VoiceStateUpdate(oldState, newState, Client))

Client.on('message', msg => Message(msg, Client))

Client.on('messageReactionAdd', (react, user) => MessageReactionAdd(<Discord.MessageReaction>react, user))

cron.schedule('40 3 * * *', () => NotifyZopime(Client))

Client.login(throwEnv('CAL_TOKEN'))
