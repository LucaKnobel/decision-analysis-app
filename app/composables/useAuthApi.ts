import type { RegisterUserBodyDTO, LoginUserBodyDTO } from '#shared/types/user'

export interface AuthApi {
  registerUser: (dto: RegisterUserBodyDTO) => Promise<void>
  loginUser: (dto: LoginUserBodyDTO) => Promise<void>
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

  return { registerUser, loginUser }
}
