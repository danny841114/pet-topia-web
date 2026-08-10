import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/vendor`,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const vendorApi = {
  getAllVendors() {
    return apiClient.get(`/all`)
  },

  getVendors() {
    return apiClient.get(`/all/for/swiper`)
  },

  getVendorCategories() {
    return apiClient.get(`/category/show`)
  },

  getVendor(vendorId) {
    return apiClient.get(`/${vendorId}`)
  },

  getVendorImages(vendorId) {
    return apiClient.get(`/${vendorId}/image`)
  },

  getVendorReviews(vendorId) {
    return apiClient.get(`/${vendorId}/review`)
  },

  getVendorTags(vendorId) {
    return apiClient.get(`/${vendorId}/tag`)
  },

  getOtherVendors(vendorId) {
    return apiClient.get(`/all/except/${vendorId}`)
  },

  getOtherVendorsByCategorty(vendorId, categoryId) {
    return apiClient.get(`/category/${categoryId}/except/vendor/${vendorId}`)
  },

  isReviewExisting(vendorId, memberId) {
    return apiClient.get(`/${vendorId}/member/${memberId}/review/exist`)
  },

  isLikeExisting(vendorId, memberId) {
    return apiClient.get(`/${vendorId}/member/${memberId}/like/status`)
  },

  toggleLike(vendorId, memberId) {
    return apiClient.post(
      `/${vendorId}/like/toggle`,
      {
        memberId: memberId,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  },

  addVendorReview(
    vendorId,
    memberId,
    ratingEnv,
    ratingPrice,
    ratingService,
    content,
    reviewPhotos
  ) {
    const formData = new FormData()

    formData.append('memberId', memberId)
    formData.append('ratingEnv', ratingEnv)
    formData.append('ratingPrice', ratingPrice)
    formData.append('ratingService', ratingService)
    formData.append('content', content)

    // 確保正確讀取圖片
    reviewPhotos.forEach(({ file }) => {
      formData.append('reviewPhotos', file)
    })

    return apiClient.post(`/${vendorId}/review/add/final`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getVendorReview(vendorId, reviewId) {
    return apiClient.get(`/review/${reviewId}`)
  },

  getVendorReviewPhotos(vendorId, reviewId) {
    return apiClient.get(`/review/${reviewId}/photo`)
  },

  updateVendorReview(
    vendorId,
    reviewId,
    ratingEnv,
    ratingPrice,
    ratingService,
    content,
    reviewPhotos,
    removeImageList
  ) {
    const formData = new FormData()

    formData.append('ratingEnv', ratingEnv)
    formData.append('ratingPrice', ratingPrice)
    formData.append('ratingService', ratingService)
    formData.append('content', content)
    formData.append('deletePhotoIds', removeImageList.length > 0 ? removeImageList : [0])

    reviewPhotos.forEach(({ file }) => {
      formData.append('reviewPhotos', file)
    })

    return apiClient.put(`/review/${reviewId}/rewrite/final`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deleteVendorReview(vendorId, reviewId) {
    return apiClient.delete(`/review/${reviewId}/delete`)
  },

  getVendorLikes(vendorId) {
    return apiClient.get(`/${vendorId}/like`)
  },

  getVendorAvgRating(vendorId) {
    return apiClient.get(`/${vendorId}/update/rating`)
  },

  getVendorLikesByMemberId(memberId) {
    return apiClient.get(`/member/${memberId}/like`)
  },

  getVendorReviewsByMemberId(memberId) {
    return apiClient.get(`/member/${memberId}/like`)
  },

  deleteLike(likeId) {
    return apiClient.delete(`/like/${likeId}/delete`)
  },
}
