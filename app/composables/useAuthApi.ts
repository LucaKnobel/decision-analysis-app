import type { RegisterUserRequestDTO, LoginUserRequestDTO } from '#shared/types/user'

export const useAuthApi = () => {
  const registerUser = async (dto: RegisterUserRequestDTO) => {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: dto
    })
  }

  const loginUser = async (dto: LoginUserRequestDTO) => {
    return await $fetch('/api/auth/login', {
      method: 'POST',
      body: dto
    })
  }

  return { registerUser, loginUser }
}
