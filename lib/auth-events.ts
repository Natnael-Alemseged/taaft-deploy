/**
 * Dispatches a custom event to show the login modal
 * Adds a debounce mechanism to prevent multiple popups
 */
let lastEventTime = 0
const DEBOUNCE_TIME = 500 // ms

export function showLoginModal() {
  if (typeof window !== "undefined") {
    const now = Date.now()

    // Only dispatch a new event if enough time has passed since the last one
    if (now - lastEventTime > DEBOUNCE_TIME) {
      lastEventTime = now

      // Create and dispatch a custom event
      const event = new Event("show-login-modal")
      window.dispatchEvent(event)

      // For debugging
      console.log("Login modal event dispatched at", new Date().toISOString())
    } else {
      console.log("Login modal event debounced", new Date().toISOString())
    }
  }
}
