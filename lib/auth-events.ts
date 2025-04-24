/**
 * Dispatches a custom event to show the login modal
 */
export function showLoginModal() {
  if (typeof window !== "undefined") {
    // Create and dispatch a custom event
    const event = new Event("show-login-modal")
    window.dispatchEvent(event)
  }
}
