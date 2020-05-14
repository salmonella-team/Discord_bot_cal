import * as fs from 'fs'
import * as yaml from 'js-yaml'

const yml = fs.readFileSync(`${process.cwd()}/config/settings.yaml`)
const option = 'utf-8' as yaml.LoadOptions
const Settings = yaml.safeLoad(String(yml), option)

export default Settings
