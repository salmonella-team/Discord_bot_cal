import * as Discord from 'discord.js'
import Settings from 'const-settings'

/**
 * ボイスチャンネルの状態が変わった際に、キャルの自動入退出をする
 * @param oldState 状態遷移前の情報
 * @param newState 状態遷移後の情報
 * @param client bot(キャル)のclient
 */
export const VoiceStateUpdate = (
  oldState: Discord.VoiceState,
  newState: Discord.VoiceState,
  client: Discord.Client
) => {
  sendVCLog(oldState, newState)

  // 退出前のチャンネルがあった場合、処理をする
  if (oldState.channel) oldStateChannel(oldState.channel, client)
  // 状態遷移後にチャンネルがあった場合、処理をする
  if (newState.channel) newStateChannel(newState.channel)
}

const sendVCLog = (oldState: Discord.VoiceState, newState: Discord.VoiceState) => {
  if (oldState.channel) {
    console.log(oldState.channel.guild.id)
    console.log(`out: ${oldState.member?.user.username}`)
  }
  if (newState.channel) {
    console.log(newState.channel.guild.id)
    console.log(`in:  ${newState.member?.user.username}`)
  }
  // console.log(newState.member?.user.username)
  // console.log(newState.member?.voice.mute)
}

/**
 * ボイスチャンネルにキャルしか残っていない場合、またはbotしか居ない場合キャルを切断する
 * @param channel 退出前のチャンネル
 * @param client bot(キャル)のclient
 */
const oldStateChannel = async (channel: Discord.VoiceChannel, client: Discord.Client) => {
  // VCから退出する
  const exitFromVC = () =>
    client.voice?.connections
      .map(v => v)
      .filter(v => v.channel === channel)[0]
      ?.disconnect()

  // チャンネルにいるユーザ一覧を取得
  const users: Discord.User[] = channel.members.map(m => m.user)

  // botしか居ない場合は退出する
  if (users.every(u => u.bot)) exitFromVC()

  // キャルしか居ない場合、切断する
  if (users.map(u => u.username).toString() === 'キャル') exitFromVC()
}

/**
 * イベントが発生したチャンネルにキャルを入出させる。
 * botしか居ない場合、または宿屋の場合入出しない
 * @param channel 状態遷移後にイベントがあったチャンネル
 */
const newStateChannel = async (channel: Discord.VoiceChannel) => {
  // 宿屋の場合はキャルを接続させない
  if (Settings.AFK_CHANNEL.some((c: string) => c === channel.name)) return

  const users: Discord.User[] = channel.members.map(m => m.user)
  if (users.every(u => u.bot)) return

  // キャルをイベントがあったチャンネルに接続する
  await channel.join()
}
