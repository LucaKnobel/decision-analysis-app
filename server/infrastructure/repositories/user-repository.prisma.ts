import { prisma } from '../db/prisma'
import type { UserRepository } from '@contracts/repositories/user-repository'

export const userRepository: UserRepository = {
  async existsByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })
    return user !== null
  },

  async createUser(data) {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash
      },
      select: { id: true }
    })
  },

  async getUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    return user
  },

  async deleteUserById(id) {
    const result = await prisma.user.deleteMany({
      where: { id }
    })
    return result.count > 0
  }
}
