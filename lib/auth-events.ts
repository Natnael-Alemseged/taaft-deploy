/**
 * Dispatches a custom event to show the login modal
 * Adds a debounce mechanism to prevent multiple popups
 */

let lastEventTime = 0
const DEBOUNCE_TIME = 1000 // ms
let activeModalId: string | null = null

export function showLoginModal(previousRoute?: string,onCloseCallback?: () => void) {
  if (typeof window !== "undefined") {
    if (activeModalId) {
      console.log("Modal already active, skipping")
      return
    }

    const now = Date.now()
    const modalId = `${now}-${Math.random().toString(36).substr(2, 9)}`
    
    // Reserve the modal slot early to prevent race conditions
    activeModalId = modalId

    if (now - lastEventTime > DEBOUNCE_TIME) {
      lastEventTime = now

      const event = new CustomEvent("show-login-modal", { 
        detail: { 
          previousRoute,
          modalId,
          onClose: () => {
            if (activeModalId === modalId) {
              activeModalId = null
              onCloseCallback?.() // Call the callback when modal closes
            }
          }
        }
      })

      window.dispatchEvent(event)
      console.log("Login modal event dispatched at", new Date().toISOString(), "with ID:", modalId)
    } else {
      console.log("Login modal event debounced", new Date().toISOString())
      activeModalId = null // release since we didn’t actually show anything
    }
  }
}
