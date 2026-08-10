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

  toggleRegistration(activityId, memberId) {
    return apiClient.post(
      `/${activityId}/regist`,
      {
        memberId: memberId,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  },

  getPendingMembers(activityId) {
    return apiClient.get(`/${activityId}/registration/pending`)
  },

  getConfirmedMembers(activityId) {
    return apiClient.get(`/${activityId}/registration/confirmed`)
  },

  isLikeExisting(activityId, memberId) {
    return apiClient.get(`/${activityId}/member/${memberId}/like/status`)
  },

  toggleLike(activityId, memberId) {
    return apiClient.post(
      `/${activityId}/like/toggle`,
      {
        memberId: memberId,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  },

  getReview(activityId, reviewId) {
    return apiClient.get(`/review/${reviewId}`)
  },

  deleteReview(activityId, reviewId) {
    return apiClient.delete(`/review/${reviewId}/delete`)
  },

  getAcitivityLikes(activityId) {
    return apiClient.get(`/${activityId}/like`)
  },

  getOtherActivitiesByType(activityId, typeId) {
    return apiClient.get(`/type/${typeId}/except/activity/${activityId}`)
  },
}
