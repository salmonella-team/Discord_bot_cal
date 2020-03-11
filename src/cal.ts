import * as Discord from 'discord.js'
import * as dotenv from 'dotenv'
import {Status} from './type'
import {calHelp, calStatus, calJoin, calDisconnect, volumeUp, volumeDown, switchMode} from './status'
import {yabai, yabaiwayo, yabaidesu, yabayaba, yabayabai, yabaislow, yabaiotwr, almage} from './message'

const status: Status = {
  Mode: false,
  Volume: 0.3,
}

const client: Discord.Client = new Discord.Client()
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

client.on('message', async (msg: Discord.Message) => {
  const content = msg.content.replace(' ', '.')
  // prettier-ignore
  switch (content) {
    case '/cal': case '/cal.status':
      return calStatus(client.voice, msg, status)
    case '/cal.help':
      return calHelp(msg)
    case '/cal.in':
      return calJoin(msg)
    case '/cal.out':
      return calDisconnect(msg)
    case '/cal.up':
      return (status.Volume = volumeUp(msg, status.Volume))
    case '/cal.down':
      return (status.Volume = volumeDown(msg, status.Volume))
    case '/cal.mode':
      return (status.Mode = switchMode(msg, status.Mode))
  }

  // prettier-ignore
  switch (content) {
    case '/yabai': case '/yab':
      return yabai(msg, status.Volume)
    case '/yabaiwayo': case '/yabw':
      return yabaiwayo(msg, status.Volume)
    case '/yabaidesu': case '/yabd':
      return yabaidesu(msg, status.Volume)
    case '/yabayaba': case '/yaby':
      return yabayaba(msg, status.Volume)
  }

  if (!status.Mode) return

  // prettier-ignore
  switch (content) {
    case '/yabayabai': case '/yabaiyabai':
      return yabayabai(msg, status.Volume)
    case '/yabaislow':
      return yabaislow(msg, status.Volume)
    case '/yabaiotwr':
      return yabaiotwr(msg, status.Volume)
    case '/almage':
      return almage(msg, status.Volume)
  }
})

client.login(process.env.CAL_TOKEN)
