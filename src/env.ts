import * as dotenv from 'dotenv'

dotenv.config()

/**
 * 環境変数を読み込み返す。
 * なかった場合、エラーを出力し終了する。
 * @param key 環境変数の名前
 */
export const GetVal = (key: string): string => {
  const val = process.env[key]
  if (!val) throw new Error('環境変数がセットされてないわよ！')
  return val
}
