import type { RegisterRequestDTO } from '#shared/dtos/auth/register.request.dto'

export const useAuthApi = () => {
  const registerUser = async (dto: RegisterRequestDTO) => {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: dto
    })
  }

  return { registerUser }
}
