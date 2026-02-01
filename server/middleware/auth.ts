import { logger } from '../infrastructure/logging/logger.pino'

export default defineEventHandler(async (event) => {
  const publicRoutes = [
    '/api/auth/register',
    '/api/auth/login',
    '/api/_auth/session'
  ]

  if (publicRoutes.some(route => event.path.startsWith(route))) {
    return
  }

  if (event.path.startsWith('/api/')) {
    const session = await getUserSession(event)
    if (!session.user) {
      logger.warn('Unauthorized access attempt', { path: event.path })
      throw createError({
        status: 401,
        statusText: 'Authentication required'
      })
    }
  }
})
