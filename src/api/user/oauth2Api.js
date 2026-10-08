import apiClient from '../apiClient'

const API_PREFIX = '/api/oauth2'

export const oauth2Api = {
  login(code, provider, name, email) {
    return apiClient.post(`${API_PREFIX}/login`, {
      code,
      provider,
      name,
      email,
    })
  },
}
