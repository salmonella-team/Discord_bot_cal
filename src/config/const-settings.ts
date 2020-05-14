import * as fs from 'fs'
import * as yaml from 'js-yaml'

const yml = fs.readFileSync(`${process.cwd()}/config/settings.yaml`)
const Settings = yaml.safeLoad(String(yml), 'utf-8' as yaml.LoadOptions)

export default Settings
