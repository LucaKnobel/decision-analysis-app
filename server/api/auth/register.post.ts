import { RegisterUserRequestSchema } from '@server/api/schemas/auth/register-user.request.schema'
import { registerUser } from '@services/auth/register-user.service'
import { EmailAlreadyExistsError } from '@services/auth/register-user.errors'
import { userRepository } from '@infrastructure/repositories/user-repository.prisma'
import { bcryptHasher } from '@infrastructure/security/password-hasher.bcrypt'

export default defineEventHandler(async (event) => {
  const dto = await readValidatedBody(event, RegisterUserRequestSchema.parse)
  try {
    await registerUser({ userRepository, passwordHasher: bcryptHasher }, dto)
    setResponseStatus(event, 201)
  } catch (error: unknown) {
    if (error instanceof EmailAlreadyExistsError) {
      setResponseStatus(event, 400)
      return
    }
    setResponseStatus(event, 500)
  }
  return
})

// To Do : change errod handling to h3 util function createError(), something like this:
/* if (error instanceof EmailAlreadyExistsError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
      })
    }
 */

// also ste response staus to 204 on success ev.
