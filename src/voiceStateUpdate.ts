import * as Discord from 'discord.js'

/**
 * ボイスチャンネルの状態が変わった際に、キャルの自動入退出をする
 * @param oldState 状態遷移前の情報
 * @param newState 状態遷移後の情報
 * @param client bot(キャル)のclient
 */
export const VoiceStateUpdate = (oldState: Discord.VoiceState, newState: Discord.VoiceState) => {
  // 退出前のチャンネルがあった場合、処理をする
  if (oldState.channel) proccesOldState(oldState.channel)
  // 状態遷移後にチャンネルがあった場合、処理をする
  if (newState.channel) proccesNewState(newState.channel)
}

/**
 * ボイスチャンネルにキャルしか残っていない場合、キャルを切断する
 * @param channel 退出前のチャンネル
 */
const proccesOldState = async (channel: Discord.VoiceChannel) => {
  // チャンネルにいるユーザ一覧を取得
  const users = channel.members.map(m => m.user.username).toString()

  // キャルしか居ない場合、切断する
  if (users === 'キャル') {
    const connect = await channel.join()
    connect?.disconnect()
  }
}

/**
 * イベントが発生したチャンネルにキャルを入出させる
 * @param channel 状態遷移後にイベントがあったチャンネル
 */
const proccesNewState = async (channel: Discord.VoiceChannel) => {
  // 宿屋の場合はキャルを接続させない
  if (channel.name === '宿屋') return

  // キャルをイベントがあったチャンネルに接続する
  await channel.join()
}
