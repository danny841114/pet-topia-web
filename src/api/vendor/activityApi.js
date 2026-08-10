import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/activity`,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const activityApi = {
  getActivitiesByVendorId(vendorId) {
    return apiClient.get(`/vendor/${vendorId}`)
  },

  getActivity(activityId) {
    return apiClient.get(`/${activityId}`)
  },

  getActivityPhotos(activityId) {
    return apiClient.get(`/${activityId}/image`)
  },

  getActivityReviews(activityId) {
    return apiClient.get(`/${activityId}/review`)
  },

  getOtherActivities(activityId) {
    return apiClient.get(`/all/except/${activityId}`)
  },

  getViewCount(activityId) {
    return apiClient.get(`/${activityId}/increase/number/visitor`)
  },

  getParticipantCount(activityId) {
    return apiClient.get(`/${activityId}/registration/people/number`)
  },

  isReviewExisting(activityId, memberId) {
    return apiClient.get(`/${activityId}/member/${memberId}/review/exist`)
  },

  isActivityAvalible(activityId) {
    return apiClient.get(`/${activityId}/registration/status`)
  },

  isActivityRegistered(activityId, memberId) {
    return apiClient.get(`/${activityId}/member/${memberId}/regist/status`)
  },
}
