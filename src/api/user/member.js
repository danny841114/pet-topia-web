import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/member`,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const memberApi = {
  getProfile(token) {
    return apiClient.get('/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  getProfileWithNoCache(token) {
    return apiClient.get('/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    })
  },

  updateProfile(name, phone, gender, address, birthdate, token) {
    return apiClient.put(
      '/profile',
      {
        name,
        phone,
        gender,
        address,
        birthdate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache', // 防止快取
        },
      }
    )
  },

  updateProfilePhoto(photoFile, token) {
    const formData = new FormData()
    formData.append('photo', photoFile)

    return apiClient.put('/upload-photo', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache', // 防止快取
      },
    })
  },

  getProfilePhoto(token) {
    return apiClient.get('/profile-photo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  // 與上面函數合併
  getProfilePhotoByTimestamp(timestamp, token) {
    return apiClient.get('/profile-photo', {
      params: {
        t: timestamp,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  },
}
