import { RegisterRequestSchema } from '../schemas/auth/register.request.schema'

export default defineEventHandler(async (event) => {
  const _dto = await readValidatedBody(event, RegisterRequestSchema.parse)
  // rate limitng?
  // logic to register the user goes here, e.g., saving to the database
  // return appropriate response
  setResponseStatus(event, 201)
  return
})
