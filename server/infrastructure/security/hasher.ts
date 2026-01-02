import bcrypt from 'bcrypt'
import type { Hasher } from '../../services/register-user.service'

export const createBcryptHasher = (): Hasher => ({
  hashPassword: async (password: string): Promise<string> => {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
})
