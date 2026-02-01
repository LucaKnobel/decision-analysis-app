import * as z from 'zod'

export const LoginUserBodySchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Invalid email address')),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(256, 'Password must not exceed 256 characters')
})

export type LoginUserBodyDTO = z.infer<typeof LoginUserBodySchema>
