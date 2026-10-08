import apiClient from '../apiClient'

const API_PREFIX = '/api/auth'

export const authApi = {
  sendVerificationCode(email, token) {
    return apiClient.post(
      `${API_PREFIX}/send-verification`,
      { email },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },

  // 疑似重複
  localSendVerificationCode(email) {
    return apiClient.post(`${API_PREFIX}/local-password/send-verification`, { email })
  },

  verifyCode(email, code, token) {
    return apiClient.post(
      `${API_PREFIX}/verify-code`,
      {
        email,
        code,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },

  // 疑似重複
  localVerifyCode(email, code) {
    return apiClient.post(`${API_PREFIX}/local-password/verify-code`, {
      email,
      code,
    })
  },

  changePassword(email, newPassword, token) {
    return apiClient.post(
      `${API_PREFIX}/change-password`,
      {
        email,
        newPassword,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },

  // 疑似重複
  loclaChangePassword(email, newPassword) {
    return apiClient.post(`${API_PREFIX}/local-password/set-password`, {
      email,
      newPassword,
    })
  },

  checkEmailStatus(email) {
    return apiClient.get(`${API_PREFIX}/local-password/check`, {
      params: { email },
    })
  },

  checkToken(token) {
    return apiClient.get(`${API_PREFIX}/status`, { headers: { Authorization: `Bearer ${token}` } })
  },

  login(email, password) {
    return apiClient.post(`${API_PREFIX}/login`, {
      email,
      password,
    })
  },

  register(email, password, confirmPassword) {
    return apiClient.post(`${API_PREFIX}/register`, {
      email,
      password,
      confirmPassword,
    })
  },

  getStatus(token) {
    return apiClient.get(`${API_PREFIX}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
}
