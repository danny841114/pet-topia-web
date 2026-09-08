import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)

    const errorData = error.response?.data || { message: error.message || '系統發生錯誤' }

    return Promise.reject(errorData)
  }
)

export const authApi = {
  sendVerificationCode(email, token) {
    return apiClient.post(
      '/send-verification',
      { email },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },

  // 疑似重複
  localSendVerificationCode(email) {
    return apiClient.post('/local-password/send-verification', { email })
  },

  verifyCode(email, code, token) {
    return apiClient.post(
      '/verify-code',
      {
        email,
        code,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },

  // 疑似重複
  localVerifyCode(email, code) {
    return apiClient.post('/local-password/verify-code', {
      email,
      code,
    })
  },

  changePassword(email, newPassword, token) {
    return apiClient.post(
      '/change-password',
      {
        email,
        newPassword,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },

  // 疑似重複
  loclaChangePassword(email, newPassword) {
    return apiClient.post('/local-password/set-password', {
      email,
      newPassword,
    })
  },

  checkEmailStatus(email) {
    return apiClient.get('/local-password/check', {
      params: { email },
    })
  },

  checkToken(token) {
    return apiClient.get('/status', { headers: { Authorization: `Bearer ${token}` } })
  },

  login(email, password) {
    return apiClient.post('/login', {
      email,
      password,
    })
  },

  register(email, password, confirmPassword) {
    return apiClient.post('/register', {
      email,
      password,
      confirmPassword,
    })
  },
}
