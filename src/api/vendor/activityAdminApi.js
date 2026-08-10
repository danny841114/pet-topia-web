import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/vendor_admin`,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const activityAdminApi = {
  getActivityReviews(activityId) {
    return apiClient.get(`/activityreviews`, {
      params: {
        vendorActivityId: activityId,
      },
      headers: {
        Accept: 'application/json',
      },
    })
  },

  deleteActivityReview(activityId, reviewId) {
    return apiClient.delete(`/activityreviews/delete/${reviewId}`)
  },

  getTop5Activities() {
    return apiClient.get('/activity/top5')
  },

  getActivitiesByUserId(userId, token) {
    return apiClient.get(`/activity/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}}`,
      },
    })
  },

  checkTimeConflict(vendorId, activityId, startTime, endTime) {
    return apiClient.get(`/activity/checkConflictDetail`, {
      params: {
        vendorId,
        activityId,
        startTime,
        endTime,
      },
    })
  },

  getActivity(activityId) {
    return apiClient.get(`/vendor_admin_activityDetail`, {
      params: {
        activityId,
      },
    })
  },

  getActivityRegistrations(activityId) {
    return apiClient.get(`/activity/registration`, {
      params: {
        activityId,
      },
      headers: {
        Accept: 'application/json',
      },
    })
  },

  acceptRegister(registerId) {
    return apiClient.put(`/registration/confirmById/${registerId}`)
  },

  rejectRegister(registerId) {
    return apiClient.put(`/registration/cancelById/${registerId}`)
  },

  // API 需要修改
  notifyMember(memberId, activityId, title, content, token) {
    return apiClient.post(`/registration/notification/${memberId}/${activityId}`, {
      params: {
        title,
        content,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  deleteRegister(registerId) {
    return apiClient.delete(`/registration/deleteById/${registerId}`)
  },
}
