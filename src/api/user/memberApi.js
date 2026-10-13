import apiClient from '../apiClient'

const API_PREFIX = '/api/member'

export const memberApi = {
  getProfile(token) {
    return apiClient.get(`${API_PREFIX}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  getProfileWithNoCache(token) {
    return apiClient.get(`${API_PREFIX}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    })
  },

  updateProfile(name, phone, gender, address, birthdate, token) {
    return apiClient.put(
      `${API_PREFIX}/profile`,
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

    return apiClient.put(`${API_PREFIX}/upload-photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache', // 防止快取
      },
    })
  },

  getProfilePhoto(token) {
    return apiClient.get(`${API_PREFIX}/profile-photo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  // 與上面函數合併
  getProfilePhotoByTimestamp(timestamp, token) {
    return apiClient.get(`${API_PREFIX}/profile-photo`, {
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
