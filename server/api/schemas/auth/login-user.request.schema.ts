import * as z from 'zod'

export const LoginUserRequestSchema = z.object({
  email: z.email('Invalid email address').toLowerCase().trim(),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(256, 'Password must not exceed 256 characters')
})

export type LoginUserRequestDTO = z.infer<typeof LoginUserRequestSchema>
