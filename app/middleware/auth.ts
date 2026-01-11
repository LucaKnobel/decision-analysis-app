export default defineNuxtRouteMiddleware(() => {
  const localePath = useLocalePath()
  const { loggedIn } = useUserSession()
  if (!loggedIn.value) {
    return navigateTo(localePath('/auth/login'))
  }
})
