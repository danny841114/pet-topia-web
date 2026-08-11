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

  getVendorReviewPhotos(reviewId, token) {
    return apiClient.get(`/review_photos/ids`, {
      params: { vendorReviewId: reviewId },
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  getVendorReviewPhotoById(photoId, token) {
    return apiClient.get(`/review_photos/download`, {
      params: { photoId },
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    })
  },

  getCertifications() {
    return apiClient.get(`/api/certification_type/all`)
  },

  // API要修改
  updateActivity(
    vendorId,
    activityId,
    activityName,
    activityTypeId,
    activityDescription,
    activityAddress,
    startTime,
    endTime,
    isRegistrationRequired,
    maxParticipants,
    deletedImageIds,
    imagePreviews
  ) {
    const formData = new FormData()

    // 屬性名稱要改
    formData.append('vendor_id', vendorId)
    formData.append('activity_id', activityId)
    formData.append('activity_name', activityName)
    formData.append('activity_type_id', activityTypeId)
    formData.append('activity_description', activityDescription)
    formData.append('activity_address', activityAddress)
    formData.append('start_time', startTime)
    formData.append('end_time', endTime)
    formData.append('is_registration_required', isRegistrationRequired)
    formData.append('max_participants', maxParticipants)

    deletedImageIds.forEach((id) => formData.append('deletedImageIds', id))

    imagePreviews.forEach((img) => formData.append('files', img.file))

    return apiClient.post('/api/vendor_activity/update', formData) // post要改put
  },

  getActivityPhotoById(photoId, token) {
    return apiClient.get(`/photos/download`, {
      params: { photoId },
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    })
  },

  getActivityPhotos(activityId) {
    return apiClient.get(`/photos/ids`, {
      params: { vendorActivityId: activityId },
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  deleteActivity(activityId) {
    return apiClient.delete(`${activityId}`)
  },
}
