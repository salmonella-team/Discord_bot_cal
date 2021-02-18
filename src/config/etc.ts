import * as Discord from 'discord.js'
import Settings from 'const-settings'
import {client} from '../index'

const getTextChannel = (id: string): Discord.TextChannel => client.channels.cache.get(id) as Discord.TextChannel

export const VcChannelList = async (): Promise<string[]> => {
  const channel = getTextChannel(Settings.VC_CHANNEL.ID)
  const msg = await channel.messages.fetch(Settings.VC_CHANNEL.MESSAGE)
  return msg.content.split('\n')
}
