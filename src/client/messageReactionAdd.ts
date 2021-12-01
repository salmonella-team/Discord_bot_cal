import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'

/**
 * リアクションのイベントに応じて適切な処理を実行する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 */
export const MessageReactionAdd = async (react: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) => {
  let comment: Option<string>
  user = user as Discord.User

  comment = await deleteFs(react, user)
  if (comment) return console.log(comment)
}

/**
 * fsのメッセージに済を付けると削除する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 削除処理の実行結果
 */
const deleteFs = async (react: Discord.MessageReaction, user: Discord.User) => {
  const isBot = user.bot
  if (isBot) return

  const isEmoji = react.emoji.id === Settings.SUMI_EMOJI
  if (!isEmoji) return

  await react.message.channel.messages.fetch(react.message.id)

  const msg = <Discord.Message>react.message
  if (msg.content !== 'fs') return

  react.message.delete()
  return 'Delete fs message'
}
