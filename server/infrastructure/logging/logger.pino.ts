import pino from 'pino'
import type { Logger } from '@contracts/logging/logger'

const base = pino({
  level: process.env.LOG_LEVEL ?? 'info'
})

export const logger: Logger = {
  debug: (msg, meta) => base.debug(meta ?? {}, msg),
  info: (msg, meta) => base.info(meta ?? {}, msg),
  warn: (msg, meta) => base.warn(meta ?? {}, msg),
  error: (msg, meta, err) => base.error({ ...(meta ?? {}), err }, msg)
}
