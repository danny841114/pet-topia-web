import apiClient from '../apiClient'

const API_PREFIX = '/api/activity'

export const activityApi = {
  getActivities() {
    return apiClient.get(`${API_PREFIX}/all`)
  },

  getActivitiesByVendorId(vendorId) {
    return apiClient.get(`${API_PREFIX}/vendor/${vendorId}`)
  },

  // API要修改
  getByKeyword(keyword) {
    return apiClient.post(`${API_PREFIX}/find`, {
      keyword,
    })
  },

  getActivityTypes() {
    return apiClient.get(`${API_PREFIX}/type/show`)
  },

  getActivity(activityId) {
    return apiClient.get(`${API_PREFIX}/${activityId}`)
  },

  getActivityPhotos(activityId) {
    return apiClient.get(`${API_PREFIX}/${activityId}/image`)
  },

  getActivityReviews(activityId) {
    return apiClient.get(`${API_PREFIX}/${activityId}/review`)
  },

  getOtherActivities(activityId) {
    return apiClient.get(`${API_PREFIX}/all/except/${activityId}`)
  },

  getViewCount(activityId) {
    return apiClient.get(`${API_PREFIX}/${activityId}/increase/number/visitor`)
  },

  getParticipantCount(activityId) {
    return apiClient.get(`${API_PREFIX}/${activityId}/registration/people/number`)
  },

  isReviewExisting(activityId, memberId) {
    return apiClient.get(`${API_PREFIX}/${activityId}/member/${memberId}/review/exist`)
  },

  isActivityAvalible(activityId) {
    return apiClient.get(`${API_PREFIX}/${activityId}/registration/status`)
  },

  isActivityRegistered(activityId, memberId) {
    return apiClient.get(`${API_PREFIX}/${activityId}/member/${memberId}/register/status`)
  },

  toggleRegistration(activityId, memberId) {
    return apiClient.post(`${API_PREFIX}/${activityId}/register`, {
      memberId,
    })
  },

  getPendingMembers(activityId) {
    return apiClient.get(`${API_PREFIX}/${activityId}/registration/pending`)
  },

  getConfirmedMembers(activityId) {
    return apiClient.get(`${API_PREFIX}/${activityId}/registration/confirmed`)
  },

  isLikeExisting(activityId, memberId) {
    return apiClient.get(`${API_PREFIX}/${activityId}/member/${memberId}/like/status`)
  },

  toggleLike(activityId, memberId) {
    return apiClient.post(`${API_PREFIX}/${activityId}/like/toggle`, {
      memberId,
    })
  },

  getReview(activityId, reviewId) {
    return apiClient.get(`${API_PREFIX}/review/${reviewId}`)
  },

  deleteReview(activityId, reviewId) {
    return apiClient.delete(`${API_PREFIX}/review/${reviewId}/delete`)
  },

  getActivityLikes(activityId) {
    return apiClient.get(`${API_PREFIX}/${activityId}/like`)
  },

  getOtherActivitiesByType(activityId, typeId) {
    return apiClient.get(`${API_PREFIX}/type/${typeId}/except/activity/${activityId}`)
  },

  getActivityLikesByMemberId(memberId) {
    return apiClient.get(`${API_PREFIX}/member/${memberId}/like`)
  },

  getActivityReviewsByMemberId(memberId) {
    return apiClient.get(`${API_PREFIX}/member/${memberId}/review`)
  },

  getActivityRegistrationsByMemberId(memberId) {
    return apiClient.get(`${API_PREFIX}/member/${memberId}/registration`)
  },

  deleteActivityLike(likeId) {
    return apiClient.delete(`${API_PREFIX}/like/${likeId}/delete`)
  },

  deleteRegistrationById(registrationId) {
    return apiClient.delete(`${API_PREFIX}/registration/${registrationId}/delete`)
  },

  // 改成 GET
  searchActivity(keyword) {
    return apiClient.post(`${API_PREFIX}/find`, { keyword })
  },

  addReview(activityId, content) {
    return apiClient.post(`${API_PREFIX}/${activityId}/review/add`, { content })
  },

  updateReview(activityId, reviewId, content) {
    return apiClient.post(`${API_PREFIX}/review/${reviewId}/rewrite`, { content })
  },
}
