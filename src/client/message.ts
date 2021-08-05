import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as etc from '../config/etc'
import {Mode, CalStatus} from '../config/type'
import * as cal from '../message/cal'
import * as speak from '../message/speak'
import * as spreadsheet from '../message/spreadsheet'

/**
 * キャルの状態を管理
 * @property Content: string - 再生するテキスト
 * @property Url: string - 再生するテキスト
 * @property Volume: Number - キャルの音量
 * @property Mode: Mode - キャルのDevMode
 */
export const Status: CalStatus = {
  content: '',
  url: '',
  volume: 0.2,
  mode: Mode.Off,
}

/**
 * 入力されたメッセージに応じて適切なコマンドを実行する
 * @param msg DiscordからのMessage
 * @param client bot(キャル)のclient
 */
export const Message = async (msg: Discord.Message, client: Discord.Client) => {
  let comment: Option<string>

  // 直前のメッセージを削除
  comment = await removeMessage(msg)
  if (comment) return console.log(comment)

  // スペース、カンマ、コロン、イコールの場合でもコマンドが動くようにピリオドに変換する
  const command: string = msg.content.replace(/ |\.|,|:|=/, '.')

  // キャルに関するコマンドを実行
  comment = await calCommands(command, msg, client)
  if (comment) return console.log(comment)

  // 音声再生のコマンドを実行
  comment = await speakCommands(command, msg, client)
  if (comment) return console.log(comment)

  // 存在しないコマンドの処理
  comment = await notExistCommands(command, msg, client)
  if (comment) return console.log(comment)

  // 入力された文字を読み上げる処理
  await speak.Read(msg, client)
}

/**
 * キャルに関するコマンドを実行する。
 * 実行した場合はコメントを返し、しなかった場合は何も返さない
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @param client bot(キャル)のclient
 * @return 実行したコマンドの結果
 */
const calCommands = async (command: string, msg: Discord.Message, client: Discord.Client): Promise<Option<string>> => {
  // 指定のチャンネル以外でキャルが動かないようにする
  const channel = msg.channel as Discord.TextChannel
  if (!(await etc.VcChannelList(client)).some((c: string) => c === channel?.name)) return

  console.log(msg.content)

  switch (command.split(' ')[0]) {
    case '/cal':
    case '/cal.status':
      cal.ShowStatus(msg, client.voice, Status)
      return 'cal show status'

    case '/cal.in':
    case '/cal.join':
    case '/cal.connect':
      cal.JoinChannel(msg, client.voice)
      return 'cal join channel'

    case '/cal.out':
    case '/cal.discon':
    case '/cal.disconnect':
      cal.Disconnect(msg, client.voice)
      return 'cal disconnect channel'

    case '/cal.up':
      Status.volume = cal.VolumeUp(msg, Status.volume)
      return 'cal volume up'

    case '/cal.down':
      Status.volume = cal.VolumeDown(msg, Status.volume)
      return 'cal volume down'

    case '/cal.vol':
    case '/cal.volume':
      const content = command.split(' ')[1]
      Status.volume = cal.VolumeChange(msg, Status.volume, content)
      return 'cal volume change'

    case '/cal.reset':
      Status.volume = cal.VolumeReset(msg)
      return 'cal reset'

    case '/cal.help':
      cal.Help(msg, Status.mode)
      return 'cal help'

    case '/cal.list':
    case '/cal.wl':
      const name = command.split(' ')[1]
      if (!name) {
        cal.GetWhiteList(msg)
        return 'get whitelist'
      } else {
        cal.AddWhiteList(msg, name)
        return `add whitelist ${name}`
      }

    case '/cal.mode':
      Status.mode = cal.SwitchMode(msg, Status.mode as Mode)
      return 'switch devMode'
  }

  switch (true) {
    case /bpm/.test(command): {
      const [, bpm, former, ahead] = command.replace('.', ' ').split(' ').map(Number)
      msg.channel.send(bpm * (former / ahead))
      return 'bpm calc'
    }
  }
}

/**
 * 音声再生のコマンドを実行する。
 * 実行した場合はコメントを返し、しなかった場合は何も返さない
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @param client bot(キャル)のclient
 * @return 実行したコマンドの結果
 */
const speakCommands = async (
  command: string,
  msg: Discord.Message,
  client: Discord.Client
): Promise<Option<string>> => {
  // 指定のチャンネル以外でキャルが動かないようにする
  const channel = msg.channel as Discord.TextChannel
  if (!(await etc.VcChannelList(client)).some((c: string) => c === channel?.name)) return

  const value: Option<{
    url: string
    content: string
    comment: string
  }> = (() => {
    switch (command) {
      case '/yabai':
      case '/yab':
        return {
          url: Settings.URL.YABAI,
          content: ':heavy_check_mark:ヤバイわよ！',
          comment: 'speak yabai',
        }
      case '/yabai.desu':
      case '/yabd':
        return {
          url: Settings.URL.YABAIDESU,
          content: ':heavy_check_mark:やばいですね☆',
          comment: 'speak yabai.desu',
        }

      case '/yabai.wayo':
      case '/yabw':
        return {
          url: Settings.URL.YABAIWAYO,
          content: ':heavy_check_mark:プリコネの年末年始はヤバイわよ！',
          comment: 'speak yabai.wayo',
        }

      case '/yabai.yaba':
      case '/yaby':
        return {
          url: Settings.URL.YABAIYABA,
          content: ':heavy_check_mark:ヤバイヤバイヤバイヤバイヤバイやばいですね☆',
          comment: 'speak yabai.yaba',
        }

      case 'jinai':
      case 'jinnai':
      case '笑いのニューウェーブ':
        return {
          url: Settings.URL.JINNAI,
          content: ':heavy_check_mark:笑いのニューウェーブ\n陣 内 智 則',
          comment: 'speak jinnai',
        }

      case 'jinaitomonori':
      case 'jinnaitomonori':
      case '笑いのニューウェーブ陣内智則':
        return {
          url: Settings.URL.JINNAITOMONORI,
          content:
            ':heavy_check_mark:次々に、新しい仕掛けを繰り出すのは、この男〜！\n笑いのニューウェーブ\n陣 内 智 則',
          comment: 'speak jinnaitomonori',
        }

      case 'レボリューション':
        return {
          url: Settings.URL.REVOLUTION,
          content: ':heavy_check_mark:君のハートに、レボ☆リューション!',
          comment: 'speak RevoLution',
        }

      case '<.revolution:831354490367770624>':
      case 'レボ☆リューション':
        return {
          url: Settings.URL.REVO_LUTION,
          content: ':heavy_check_mark:Want You! 君のハートに、レボ☆リューション!',
          comment: 'speak Revo☆Lution',
        }

      case 'なんでだろ':
      case 'なんでだろ～':
      case 'なんでだろう':
        return {
          url: Settings.URL.NANDEDARO,
          content: ':heavy_check_mark:なんでだろ～♪なんでだろ～♪',
          comment: 'speak nandedaro',
        }

      case '音割れD4DJ':
        return {
          url: Settings.URL.D4DJ,
          content: "1 2 3 Let's go!",
          comment: 'speak D4DJ',
        }

      case 'スッコココ':
      case 'ｽｯｺｺｺ':
        return {
          url: Settings.URL.KNOCK_BRUSH,
          content: ':heavy_check_mark:ｽｯｺｺｺ',
          comment: 'speak knock brush',
        }

      case 'レスキュー開始':
      case 'モーニングレスキュー':
        return {
          url: Settings.URL.RESCUE,
          content: ':heavy_check_mark:レスキュー開始',
          comment: 'speak rescue',
        }

      case 'hikakin':
      case 'Hikakin':
      case 'HIKAKIN':
        return {
          url: Settings.URL.HIKAKIN,
          content: ':heavy_check_mark:HIKAKIN TV Everyday',
          comment: 'speak HIKAKIN',
        }

      case 'helloyoutube':
      case 'helloYouTube':
      case 'HelloYouTube':
        return {
          url: Settings.URL.HELLOYOUTUBE,
          content: ':heavy_check_mark:ブンブンハローYouTube',
          comment: 'speak helloYouTube',
        }

      case 'hikakintv':
      case 'HikakinTV':
      case 'HIKAKINTV':
        return {
          url: Settings.URL.HIKAKINTV,
          content: ':heavy_check_mark:HIKAKIN TV Everyday\nブンブンハローYouTube\nどうもHIKAKINです',
          comment: 'speak HIKAKINTV',
        }

      case 'seikin':
      case 'Seikin':
      case 'SEIKIN':
      case 'seikintv':
      case 'SeikinTV':
      case 'SEIKINTV':
        return {
          url: Settings.URL.SEIKIN,
          content: ':heavy_check_mark:Seikin Music Ah Seikin TV Oh Yeah',
          comment: 'speak SEIKIN',
        }

      case 'setokouji':
        return {
          url: Settings.URL.SETOKOUJI,
          content: ':heavy_check_mark:ﾃﾞｰｰｰｰｰﾝ\n瀬戸弘司の動画',
          comment: 'speak setokouji',
        }

      case 'misuzu':
      case 'みすず学苑':
        return {
          url: Settings.URL.MISUZU,
          content: ':heavy_check_mark:怒涛の合格 みすず学苑 怒涛の合格 みすず学苑 怒涛の合格',
          comment: 'speak misuzu',
        }

      case 'スシロー':
        return {
          url: Settings.URL.SUSHIRO,
          content: ':heavy_check_mark:スシロー スシロー',
          comment: 'speak sushiro',
        }

      case 'たべるんご':
        return {
          url: Settings.URL.TABERUNGO,
          content:
            'たーべるんごー たべるんごー\nやまがたりんごをたべるんごー\nおいしいりんごをたべるんごー\nいっぱいたべるんごー（ﾝｺﾞｰ）',
          comment: 'speak taberungo',
        }

      case 'たべるんごのうた':
        return {
          url: Settings.URL.TABERUNGONOUTA,
          content:
            'たーべるんごー たべるんごー\nやまがたりんごをたべるんごー\nおいしいりんごをたべるんごー\nいっぱいたべるんごー（ﾝｺﾞｰ）\n以下略',
          comment: 'speak taberungonouta',
        }

      case '楽天モバイル':
        return {
          url: Settings.URL.RAKUTEN_MOBILE,
          content: ':heavy_check_mark:楽天モバイル',
          comment: 'speak rakuten mobile',
        }

      case 'fbi':
        return {
          url: Settings.URL.FBI,
          content: ':heavy_check_mark:fbi open door',
          comment: 'speak fbi open door',
        }

      case 'usamaru':
        return {
          url: Settings.URL.USAMARU,
          content: ':heavy_check_mark:ｷﾞｶﾞｷﾞｶﾞﾌﾝﾌﾝｶﾞｶﾞｶﾞｶﾞｶﾞｶﾞｶﾞｶﾞｶﾞ',
          comment: 'speak usamaru',
        }

      case 'ニューイヤーバースト':
        return {
          url: Settings.URL.NYARU,
          content: ':heavy_check_mark:何発でも打ち込むわ！ニューイヤーバースト！！！',
          comment: 'speak nyaru',
        }

      case 'バジリスクタイム':
        return {
          url: Settings.URL.BASILISK,
          content:
            'https://tenor.com/view/%E3%83%90%E3%82%B8%E3%83%AA%E3%82%B9%E3%82%AF%E3%82%BF%E3%82%A4%E3%83%A0-%E3%83%90%E3%82%B8%E3%83%AA%E3%82%B9%E3%82%AF-%E3%83%90%E3%82%B8%E3%83%AA%E3%82%B9%E3%82%AF%E7%94%B2%E8%B3%80%E5%BF%8D%E6%B3%95%E5%B8%96-%E7%94%B2%E8%B3%80%E5%BF%8D%E6%B3%95%E5%B8%96-dance-gif-11980015',
          comment: 'speak basilisk',
        }

      case 'heero':
        return {
          url: Settings.URL.HEERO,
          content: ':heavy_check_mark:ヒイロ・ユイ',
          comment: 'speak heero',
        }

      case 'deden':
        return {
          url: Settings.URL.DEDEN,
          content: ':heavy_check_mark:ﾃﾞﾃﾞﾝ',
          comment: 'speak deden',
        }

      case 'gi':
        return {
          url: Settings.URL.GI,
          content: ':heavy_check_mark:ギラティナ',
          comment: 'speak gi',
        }

      case '船越':
        return {
          url: Settings.URL.FUNAKOSHI,
          content: ':heavy_check_mark:火曜サスペンス劇場 フラッシュバックテーマ',
          comment: 'speak funakoshi',
        }

      case '片平':
        return {
          url: Settings.URL.KATAHIRA,
          content: ':heavy_check_mark:火曜サスペンス劇場 アイキャッチ',
          comment: 'speak katahira',
        }

      case '暴れん坊将軍':
      case '<.reichan:778714208954220586>':
        return {
          url: Settings.URL.REITYAN,
          content: ':heavy_check_mark:れいちゃん',
          comment: 'speak reityan',
        }

      case 'CR戦姫絶唱シンフォギア':
        return {
          url: Settings.URL.SYMPHOGEAR,
          content: ':heavy_check_mark:CR戦姫絶唱シンフォギア',
          comment: 'speak symphogear',
        }

      case '素敵な仲間が増えますよ':
        return {
          url: Settings.URL.KARIN,
          content: ':heavy_check_mark:クソメガネ',
          comment: 'speak karin',
        }

      case 'ざわざわ':
      case 'ざわ…ざわ…':
        return {
          url: Settings.URL.ZAWAZAWA,
          content: ':heavy_check_mark:ざわ…ざわ…',
          comment: 'speak zawazawa',
        }

      case 'お願いマッスル':
        return {
          url: Settings.URL.MUSCLE,
          content: ':heavy_check_mark:お願いマッスル\nめっちゃモテたい',
          comment: 'speak muscle',
        }

      case 'ﾈｺﾁｬﾝ':
        return {
          url: Settings.URL.NEKO,
          content: ':heavy_check_mark:あ～あ GUCCIの7万円もするﾈｺﾁｬﾝのTシャツがほしいよ～',
          comment: 'speak neko',
        }

      case '物乞いサンバ':
        return {
          url: Settings.URL.NEKO_FULL,
          content: ':heavy_check_mark:あ～あ GUCCIの7万円もするﾈｺﾁｬﾝのTシャツがほしいよ～ 以下略',
          comment: 'speak neko full',
        }

      case 'ストライク':
      case '全て込め撃ち抜くストライク':
        return {
          url: Settings.URL.OGURAYUI,
          content: ':heavy_check_mark:全て込め撃ち抜くストライク',
          comment: 'speak ogurayui',
        }
    }

    // DevModeでない場合、下の処理は行わない
    if (!Status.mode) return

    switch (command) {
      case '/yabai.full':
      case '/yabf':
        return {
          url: Settings.URL.YABAIFULL,
          content: ':heavy_check_mark:プリコネの年末年始はヤバイわよ！(Full)',
          comment: 'speak yabai.full',
        }

      case '/yabai.yabai':
        return {
          url: Settings.URL.YABAIYABAI,
          content: ':heavy_check_mark:ヤバイヤバイヤバイヤバイヤバイヤバイ',
          comment: 'speak yabai.yabai',
        }

      case '/yabai.slow':
        return {
          url: Settings.URL.YABAISLOW,
          content: ':heavy_check_mark:ヤバイヤバイヤバイヤバイヤバイやばいですね☆(slow)',
          comment: 'speak yabai.slow',
        }

      case '/yabai.otwr':
        return {
          url: Settings.URL.YABAIOTWR,
          content: ':heavy_check_mark:ヤバイヤバイヤバイヤバイヤバイやばいですね☆(otwr)',
          comment: 'speak yabai.otwr',
        }
    }
  })()

  // コマンドがない場合終了
  if (!value) return

  // キャルがvcに居ない場合は終了
  const vc = etc.GetVcWithCal(msg, client)
  if (!vc) return

  // 再生させる音声をキューに追加する
  await speak.Add({content: value.content, url: value.url, volume: Status.volume}, vc)
  msg.reply(value.content)

  return value.comment
}

/**
 * 存在しないコマンドの処理をする。
 * 実行した場合はコメントを返し、しなかった場合は何も返さない
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @param client bot(キャル)のclient
 * @return 実行したコマンドの結果
 */
const notExistCommands = async (
  command: string,
  msg: Discord.Message,
  client: Discord.Client
): Promise<Option<string>> => {
  // 指定のチャンネル以外でキャルが動かないようにする
  const channel = msg.channel as Discord.TextChannel
  if (!(await etc.VcChannelList(client)).some((c: string) => c === channel?.name)) return

  // コマンドじゃない場合終了
  if (command.charAt(0) !== '/') return

  // ホワイトリストにコマンドがある場合は終了
  const list = await spreadsheet.GetWhiteList()
  const cmd = command.slice(1).split('.')[0]
  if (list.find(l => l === cmd)) return

  msg.reply('そんなコマンドないんだけど！')
  return 'missing command'
}

/**
 * 直前のメッセージを削除。
 * 引数で数を指定できる
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
const removeMessage = async (msg: Discord.Message): Promise<Option<string>> => {
  // ヤバイわよ！のロールがついて入れば実行可能
  const roles = msg.member?.roles.cache.map(r => r.name)
  if (!Settings.DEVELOP_ROLE.some((r: string) => roles?.find(v => v === r))) return ''

  switch (true) {
    case /rm/.test(msg.content): {
      const content = msg.content.replace(/・/g, '/')

      // スラッシュが入っていなければ終了
      const match = content.match(/\//)
      if (!match) return ''

      // `/rm`か`/rm \d`以外は終了
      if (!/\/rm|\/rm \d/.test(content)) return ''

      // メッセージを削除する数を取得
      const n = /^\/rm$/.test(content) ? 1 : Number(content.replace(/\s/g, '').replace('/rm', ''))

      // 11件以上同時に消すのは危ないので実行しない
      if (n >= 11 || n < 0) {
        msg.delete()
        return ''
      }

      // メッセージを削除
      const channel = msg.channel as Discord.TextChannel
      setTimeout(() => channel.bulkDelete(n + 1), 500)

      return 'delete message'
    }

    default: {
      return ''
    }
  }
}
