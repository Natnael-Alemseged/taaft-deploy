// services/auth.ts
import axios from "axios"

export const loginWithOAuth = async (provider: string) => {
  const res = await axios.get(`/api/auth/oauth/${provider}`)
  return res.data
}

export const handleOAuthCallback = async (code: string) => {
  const res = await axios.post("/api/auth/callback", { code })
  return res.data // should return user + session token
}
