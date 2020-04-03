import * as dotenv from 'dotenv'
dotenv.config()

const GoogleSpreadsheetAsPromised = require('google-spreadsheet-as-promised')

/**
 * GoogleSpreadSheetから指定されたシートを取得する
 * @param name シートの名前
 * @return 取得したシート
 */
const getWorksheet = async (name: string) => {
  // GoogleSpreadSheetで使う定数を定義
  const CREDS = require('../assets/google-generated-creds.json')
  const SHEET_ID = process.env.SHEET_ID

  const sheet = new GoogleSpreadsheetAsPromised()
  await sheet.load(SHEET_ID, CREDS)
  return sheet.getWorksheetByName(name)
}

/**
 * ホワイトリストを取得して返す
 * @return ホワイトリストの配列
 */
export const GetWhiteList = async (): Promise<string[]> => {
  const worksheet = await getWorksheet('ホワイトリスト')
  const cells = await worksheet.getCells('A2:A100')
  return cells.getAllValues().filter((v: string) => v)
}

/**
 * コマンド用のホワイトリストに値を追加する
 * @param name 追加したい値
 */
export const AddWhiteList = async (name: string) => {
  const worksheet = await getWorksheet('ホワイトリスト')
  const cells = await worksheet.getCells('A2:A100')
  const l = cells.getAllValues().filter((v: string) => v).length
  const cell = await worksheet.getCell(`A${l + 2}`)
  await cell.setValue(name)
}
