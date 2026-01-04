export interface UserRepository {
  existsByEmail(email: string): Promise<boolean>
  createUser(data: { email: string, passwordHash: string }): Promise<{ id: string }>
}
