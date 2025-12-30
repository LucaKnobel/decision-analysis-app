import { RegisterRequestSchema } from '../../schemas/auth/register.request.schema'

export default defineEventHandler(async (event) => {
  const _body = await readValidatedBody(event, RegisterRequestSchema.parse) // or `.parse` to directly throw an error

  return { success: true }
})
