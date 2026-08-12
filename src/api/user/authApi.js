import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const authApi = {
  sendVerificationCode(email, token) {
    return apiClient.post(
      `/send-verification`,
      { email },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },

  verifyCode(email, code, token) {
    return apiClient.post(
      `/verify-code`,
      {
        email,
        code,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },

  changePassword(email, newPassword, token) {
    return apiClient.post(
      `/verify-code`,
      {
        email,
        newPassword,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },
}
