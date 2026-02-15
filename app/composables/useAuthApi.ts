import type { RegisterUserBodyDTO, LoginUserBodyDTO } from '#shared/types/user'

export interface AuthApi {
  registerUser: (dto: RegisterUserBodyDTO) => Promise<void>
  loginUser: (dto: LoginUserBodyDTO) => Promise<void>
  deleteAccount: () => Promise<void>
}

export const useAuthApi = (): AuthApi => {
  const registerUser = async (dto: RegisterUserBodyDTO): Promise<void> => {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: dto
    })
  }

  const loginUser = async (dto: LoginUserBodyDTO): Promise<void> => {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: dto
    })
  }

  const deleteAccount = async (): Promise<void> => {
    await $fetch('/api/auth/account', {
      method: 'DELETE'
    })
  }

  return { registerUser, loginUser, deleteAccount }
}
