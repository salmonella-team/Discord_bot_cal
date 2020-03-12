import * as Discord from 'discord.js'
import * as cal from './cal'
import * as speak from './speak'
import {Status} from './type'

const env = process.env

const status: Status = {
  Mode: false,
  Volume: 0.3,
}

export const Message = (msg: Discord.Message, client: Discord.Client): string => {
  const command = msg.content.replace(' ', '.')

  // prettier-ignore
  switch (command) {
    case '/cal': case '/cal.status':
      cal.ShowStatus(client.voice, msg, status)
      return 'cal show status'

    case '/cal.in': case '/cal.join':
      cal.JoinChannel(msg)
      return 'cal join channel'

    case '/cal.out': case '/cal.disconnect':
      cal.Disconnect(msg)
      return 'cal disconnect channel'

    case '/cal.up':
      status.Volume = cal.VolumeUp(msg, status.Volume)
      return 'cal volume up'

    case '/cal.down':
      status.Volume = cal.VolumeDown(msg, status.Volume)
      return 'cal volume down'

    case '/cal.help':
      cal.Help(msg)
      return 'cal help'

    case '/cal.mode':
      status.Mode = cal.SwitchMode(msg, status.Mode)
      return 'switch devMode'
  }

  const volume = status.Volume

  // prettier-ignore
  switch (command) {
    case '/yabai': case '/yab':
      speak.Play(msg, env.URL_YABAI, volume)
      return 'speak yabai'

    case '/yabai.wayo': case '/yabw':
      speak.Play(msg, env.URL_YABAIWAYO, volume)
      return 'speak yabai.wayo'

    case '/yabai.desu': case '/yabd':
      speak.Play(msg, env.URL_YABAIDESU, volume)
      return 'speak desu'

    case '/yabai.yaba': case '/yaby':
      speak.Play(msg, env.URL_YABAYABA, volume)
      return 'speak yabai.yaba'
  }

  if (status.Mode) {
    // prettier-ignore
    switch (command) {
      case '/yabai.yabai':
        speak.Play(msg, env.URL_YABAYABAI, volume)
        return 'speak yabai.yabai'

      case '/yabai.slow':
        speak.Play(msg, env.URL_YABAISLOW, volume)
        return 'speak yabai.slow'

      case '/yabai.otwr':
        speak.Play(msg, env.URL_YABAIOTWR, volume)
        return 'speak yabai.otwr'

      case '/almage':
        speak.Play(msg, env.URL_ALMAGE, volume)
        return 'speak almage'
    }
  }

  if (command.charAt(0) === '/') {
    msg.reply('そんなコマンドないんだけど！')
    return 'missing command'
  }

  return 'no action'
}
