export interface AuthApi {
  registerUser: (dto: RegisterUserRequestDTO) => Promise<void>
  loginUser: (dto: LoginUserRequestDTO) => Promise<void>
}

export const useAuthApi = (): AuthApi => {
  const registerUser = async (dto: RegisterUserRequestDTO): Promise<void> => {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: dto
    })
  }

  const loginUser = async (dto: LoginUserRequestDTO): Promise<void> => {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: dto
    })
  }

  return { registerUser, loginUser }
}
