const GoogleSpreadsheetAsPromised = require('google-spreadsheet-as-promised')

const CREDS = require('../asset/google-generated-creds')


export const getWhiteList = async (): Promise<string[]> => {
  const sheet = new GoogleSpreadsheetAsPromised()
  await sheet.load(SHEET_ID, CREDS)
  const worksheet = await sheet.getWorksheetByName('シート1')
  return (await worksheet.getCells('A2:A100')).getAllValues().filter((v: string) => v)
}
