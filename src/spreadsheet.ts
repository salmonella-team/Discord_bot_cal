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
  const CREDS = JSON.parse(process.env.CREDS!)
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
 * コマンド用のホワイトリストに値を追加する。
 * 既にホワイトリストに値がある場合は追加しない
 * @param name 追加したい値
 * @return 追加されたかどうかの結果
 */
export const AddWhiteList = async (name: string): Promise<boolean> => {
  const worksheet = await getWorksheet('ホワイトリスト')
  const cells = await worksheet.getCells('A2:A100')

  // 既に登録されていたら終了
  if (cells.getAllValues().find((v: string) => v === name)) return false

  const l = cells.getAllValues().filter((v: string) => v).length
  const cell = await worksheet.getCell(`A${l + 2}`)
  await cell.setValue(name)
  return true
}
