/* import { LoginUserRequestSchema } from '@server/api/schemas/auth/login-user.request.schema'
import { loginUser } from '@services/auth/register-user.service'
import { UserDoesntExist } from '@services/auth/login-user.errors'
import { userRepository } from '@infrastructure/repositories/user-repository.prisma'
import { createBcryptHasher } from '@infrastructure/security/password-hasher.bcrypt'

export default defineEventHandler(async (event) => {
  const dto = await readValidatedBody(event, LoginUserRequestSchema.parse)
  try {
    // Attempt to log in the user
  } catch (error: unknown) {
    // erro handling
  }
  return
})
 */
