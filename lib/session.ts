export const getSession = () => {
  const data = localStorage.getItem("session")
  return data ? JSON.parse(data) : null
}

export function getUserIdFromLocalStorage(): string | null {
  try {
    const userDataStr = localStorage.getItem("user")
    if (!userDataStr) return null

    const userData = JSON.parse(userDataStr)
    return userData.id ?? null
  } catch (err) {
    console.error("Failed to get user ID from localStorage:", err)
    return null
  }
}
