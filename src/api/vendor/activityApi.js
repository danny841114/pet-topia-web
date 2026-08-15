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
  getActivities() {
    return apiClient.get(`/all`)
  },

  getActivitiesByVendorId(vendorId) {
    return apiClient.get(`/vendor/${vendorId}`)
  },

  // API要修改
  getByKeyword(keyword) {
    return apiClient.post(`/find`, {
      keyword,
    })
  },

  getActivityTypes() {
    return apiClient.get(`/type/show`)
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
    return apiClient.get(`/${activityId}/member/${memberId}/register/status`)
  },

  toggleRegistration(activityId, memberId) {
    return apiClient.post(`/${activityId}/register`, {
      memberId,
    })
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
    return apiClient.post(`/${activityId}/like/toggle`, {
      memberId,
    })
  },

  getReview(activityId, reviewId) {
    return apiClient.get(`/review/${reviewId}`)
  },

  deleteReview(activityId, reviewId) {
    return apiClient.delete(`/review/${reviewId}/delete`)
  },

  getActivityLikes(activityId) {
    return apiClient.get(`/${activityId}/like`)
  },

  getOtherActivitiesByType(activityId, typeId) {
    return apiClient.get(`/type/${typeId}/except/activity/${activityId}`)
  },

  getActivityLikesByMemberId(memberId) {
    return apiClient.get(`/member/${memberId}/like`)
  },

  getActivityReviewsByMemberId(memberId) {
    return apiClient.get(`/member/${memberId}/review`)
  },

  getActivityRegistrationsByMemberId(memberId) {
    return apiClient.get(`/member/${memberId}/registration`)
  },

  deleteActivityLike(likeId) {
    return apiClient.delete(`/like/${likeId}/delete`)
  },

  deleteRegistrationById(registrationId) {
    return apiClient.delete(`/registration/${likeId}/delete`)
  },

  // 改成 GET
  searchActivity(keyword) {
    return apiClient.post(`/find`, { keyword })
  },

  addReview(activityId, content) {
    return apiClient.post(`/${activityId}/review/add`, { content })
  },

  updateReview(activityId, reviewId, content) {
    return apiClient.post(`/review/${reviewId}/rewrite`, { content })
  },
}
