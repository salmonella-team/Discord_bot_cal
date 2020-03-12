import * as Discord from 'discord.js'
import * as cal from './cal'
import * as speak from './speak'
import {Option, Mode, Status} from './type'

const status: Status = {
  Mode: Mode.Off,
  Volume: 0.3,
}

export const Message = (msg: Discord.Message, client: Discord.Client): Option<string> => {
  const command = msg.content.replace(' ', '.')

  // prettier-ignore
  switch (command) {
    case '/cal': case '/cal.status':
      cal.ShowStatus(msg, client.voice, status)
      return 'cal show status'

    case '/cal.in': case '/cal.join':
      cal.JoinChannel(msg, client.voice)
      return 'cal join channel'

    case '/cal.out': case '/cal.disconnect':
      cal.Disconnect(msg, client.voice)
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
      speak.Play(msg, process.env.YABAI_URL, volume)
      return 'speak yabai'

    case '/yabai.wayo': case '/yabw':
      speak.Play(msg, process.env.YABAIWAYO_URL, volume)
      return 'speak yabai.wayo'

    case '/yabai.desu': case '/yabd':
      speak.Play(msg, process.env.YABAIDESU_URL, volume)
      return 'speak yabai.desu'

    case '/yabai.yaba': case '/yaby':
      speak.Play(msg, process.env.YABAYABA_URL, volume)
      return 'speak yabai.yaba'
  }

  if (status.Mode) {
    // prettier-ignore
    switch (command) {
      case '/yabai.yabai':
        speak.Play(msg, process.env.YABAYABAI_URL, volume)
        return 'speak yabai.yabai'

      case '/yabai.slow':
        speak.Play(msg, process.env.YABAISLOW_URL, volume)
        return 'speak yabai.slow'

      case '/yabai.otwr':
        speak.Play(msg, process.env.YABAIOTWR_URL, volume)
        return 'speak yabai.otwr'

      case '/almage':
        speak.Play(msg, process.env.ALMAGE_URL, volume)
        return 'speak almage'
    }
  }

  if (command.charAt(0) === '/') {
    msg.reply('そんなコマンドないんだけど！')
    return 'missing command'
  }
}
