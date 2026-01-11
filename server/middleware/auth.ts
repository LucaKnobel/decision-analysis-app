export default defineEventHandler(async (event) => {
  const publicRoutes = [
    '/api/auth/register',
    '/api/auth/login'
  ]

  if (publicRoutes.some(route => event.path.startsWith(route))) {
    return
  }

  if (event.path.startsWith('/api/')) {
    const session = await getUserSession(event)
    if (!session.userId) {
      throw createError({
        statusCode: 401,
        message: 'Authentication required'
      })
    }
  }
})
