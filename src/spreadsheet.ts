import * as dotenv from 'dotenv'

const GoogleSpreadsheetAsPromised = require('google-spreadsheet-as-promised')

// GoogleSpreadSheetで使う定数を定義
dotenv.config()
const CREDS = require('../assets/google-generated-creds.json')
const SHEET_ID = process.env.SHEET_ID

/**
 * GoogleSpreadSheetからホワイトリストを取得する
 * @return ホワイトリストの配列
 */
export const GetWhiteList = async (): Promise<string[]> => {
  const sheet = new GoogleSpreadsheetAsPromised()
  await sheet.load(SHEET_ID, CREDS)
  const worksheet = await sheet.getWorksheetByName('ホワイトリスト')
  return (await worksheet.getCells('A2:A100')).getAllValues().filter((v: string) => v)
}
