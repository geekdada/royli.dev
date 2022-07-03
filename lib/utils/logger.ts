import pino from 'pino'
import pretty from 'pino-pretty'

import { isProd } from '../config'

const prettyStream = pretty({
  colorize: true,
})
const logger = pino(isProd ? {} : prettyStream)

export default logger
