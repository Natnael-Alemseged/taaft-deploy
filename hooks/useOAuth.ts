// hooks/useOAuth.ts
import { useMutation } from "@tanstack/react-query"
import { loginWithOAuth, handleOAuthCallback } from "@/services/auth"

export const useOAuthLogin = () =>
  useMutation({
    mutationFn: loginWithOAuth,
  })

export const useOAuthCallback = () =>
  useMutation({
    mutationFn: handleOAuthCallback,
    onSuccess: (data) => {
      localStorage.setItem("session", JSON.stringify(data.session))
    },
  })
