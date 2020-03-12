import * as Discord from 'discord.js'
import * as dotenv from 'dotenv'
import {Message} from './message'

const client = new Discord.Client()
dotenv.config()

client.on('ready', () => console.log(`Logged in as ${client.user?.username}!`))

client.on('voiceStateUpdate', async (oldState: Discord.VoiceState, newState: Discord.VoiceState) => {
  if (oldState.channel) {
    const users = oldState.channel?.members.map(m => m.user.username).toString()
    if (users === 'キャル') {
      const connect = await oldState.channel?.join()
      connect?.disconnect()
    }
  }

  if (newState.channel) {
    await newState.channel?.join()
  }
})

client.on('message', async (msg: Discord.Message) =>
  (text => text && console.log(text))(Message(msg, client))
)

client.login(process.env.CAL_TOKEN)
