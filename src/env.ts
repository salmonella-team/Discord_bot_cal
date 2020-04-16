import * as dotenv from 'dotenv'

dotenv.config()

export const GetVal = (key: string): string => {
  const val = process.env[key]
  if (!val) throw new Error('環境変数がセットされてないわよ！')
  return val
}
