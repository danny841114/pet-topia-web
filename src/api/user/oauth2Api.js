import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/oauth2`,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const oauth2Api = {
  login(code, provider, name, email) {
    return apiClient.post('/login', {
      code,
      provider,
      name,
      email,
    })
  },
}
