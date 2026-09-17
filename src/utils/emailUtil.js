export const emailUtil = {
  isEmailFormat(text, email) {
    if (!text || !email) return false
    if (text.toLowerCase() === email.toLowerCase()) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(text)
  },
}
