import bcrypt from 'bcrypt'
import type { PasswordHasher } from '@contracts/security/password-hasher'

export const createBcryptHasher = (saltRounds = 12): PasswordHasher => ({
  hash: password => bcrypt.hash(password, saltRounds),
  verify: (password, hash) => bcrypt.compare(password, hash)
})

export const bcryptHasher = createBcryptHasher(12)
