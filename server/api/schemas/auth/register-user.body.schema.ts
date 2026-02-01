import * as z from 'zod'

export const RegisterUserBodySchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Invalid email address')),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(256, 'Password must not exceed 256 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
})

export type RegisterUserBodyDTO = z.infer<typeof RegisterUserBodySchema>
