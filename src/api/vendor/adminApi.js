import apiClient from '../apiClient'

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
}
