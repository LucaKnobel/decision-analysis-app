import type { RegisterUserRequestDTO } from '#shared/types/register-user'

export const useAuthApi = () => {
  const registerUser = async (dto: RegisterUserRequestDTO) => {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: dto
    })
  }

  return { registerUser }
}
