export interface UserRepository {
  existsByEmail(email: string): Promise<boolean>
  createUser(data: { email: string, passwordHash: string }): Promise<{ id: string }>
  getUserByEmail(email: string): Promise<{ id: string, email: string, passwordHash: string } | null>
  deleteUserById(id: string): Promise<boolean>
}
