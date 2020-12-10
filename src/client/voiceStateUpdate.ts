import * as Discord from 'discord.js'
import Option from 'type-of-option'
import throwEnv from 'throw-env'
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
  // vcのログ出力する
  sendVCLog(oldState, newState, client)

  // 状態遷移後にチャンネルがあった場合、処理をする
  if (newState.channel) newStateChannel(newState.channel)

  // 退出前のチャンネルがあった場合、処理をする
  if (oldState.channel) oldStateChannel(oldState.channel, client)
}

/**
 * vcのログを#ログに出力する
 * @param oldState 状態遷移前の情報
 * @param newState 状態遷移後の情報
 * @param client bot(キャル)のclient
 */
const sendVCLog = (oldState: Discord.VoiceState, newState: Discord.VoiceState, client: Discord.Client) => {
  // サルモネラ菌のサーバーじゃなければ終了
  if (oldState.guild.id !== throwEnv('SERVER_ID')) return

  // ニックネームを優先してユーザーネームを取得
  const name = GetUserName(oldState.member)

  // #ログのチャンネル情報
  const channel = client.channels.cache.get(Settings.VC_LOG_CHANNEL) as Discord.TextChannel

  // 新旧のチャンネルが同じの場合、画面共有の開始・終了かミュートの切り替えをしている
  if (oldState.channel?.id === newState.channel?.id) {
    // 状態を取得
    const streaming = newState.member?.voice.streaming
    const mute = newState.member?.voice.mute

    // 画面共有の開始・終了とミュートの切り替えを判別する方法がない
    // 画面共有をしている状態でミュートを切り替える可能性が少ないので、画面共有を優先する
    const msg = streaming
      ? `${name} が画面共有を${streaming ? '開始' : '終了'}しました`
      : `${name} がミュート${mute ? '' : 'を解除'}しました`
    return channel.send(msg), console.log(msg)
  }

  // チャンネルから退出した際の処理
  if (oldState.channel) {
    const msg = `${name} が ${oldState.channel.name} から退出しました`
    channel.send(msg), console.log(msg)
  }

  // チャンネルを入出した際の処理
  if (newState.channel) {
    const msg = `${name} が ${newState.channel.name} に入室しました`
    channel.send(msg), console.log(msg)
  }
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

/**
 * Userの名前を取得する。
 * ニックネームがある場合はそちらを取る
 * @param m Userの情報
 * @return Userの名前
 */
export const GetUserName = (m: Option<Discord.GuildMember>): string =>
  m?.nickname ? m?.nickname : m?.user.username || ''
