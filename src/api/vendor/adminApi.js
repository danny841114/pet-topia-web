import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const adminApi = {
  getProfilePhotos(vendorId, token) {
    return apiClient.get(`/profile_photos/ids`, {
      params: vendorId,
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  getProfilePhotoById(photoId, token) {
    return apiClient.get(`/profile_photos/download`, {
      params: photoId,
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    })
  },
}
