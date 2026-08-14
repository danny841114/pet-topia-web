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

  // this API should be modified
  getVendorsByKeyword(keyword) {
    const formData = new FormData()
    formData.append('keyword', keyword)

    return apiClient.post(`/find`, formData)
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
    return apiClient.post(`/${vendorId}/like/toggle`, {
      memberId,
    })
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
    reviewPhotos.forEach(({ file }) => {
      formData.append('reviewPhotos', file)
    })

    return apiClient.post(`/${vendorId}/review/add/final`, formData)
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

    return apiClient.put(`/review/${reviewId}/rewrite/final`, formData)
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

  // By Liou
  getSlogans(vendorId, token) {
    return apiClient.get(`/${vendorId}/slogans`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  // By Liou
  updateVendor(
    vendorId,
    vendorName,
    contactEmail,
    vendorPhone,
    vendorAddress,
    vendorDescription,
    contactPerson,
    vendorTaxIdNumber,
    category,
    deletedImageIds,
    imagePreviews,
    logoInput
  ) {
    const formData = new FormData()

    formData.append('vendorId', vendorId) // 與path重複
    formData.append('vendorName', vendorName)
    formData.append('contactEmail', contactEmail)
    formData.append('vendorPhone', vendorPhone)
    formData.append('vendorAddress', vendorAddress)
    formData.append('vendorDescription', vendorDescription)
    formData.append('contactPerson', contactPerson)
    formData.append('vendorTaxIdNumber', vendorTaxIdNumber)
    formData.append('category', category)

    deletedImageIds.forEach((imgId) => {
      formData.append('deletedImageIds', imgId)
    })

    imagePreviews.forEach((img) => {
      formData.append('files', img.file)
    })

    if (logoInput.length > 0) {
      formData.append('vendorLogoImg', logoInput.files[0])
    }

    return apiClient.put(`/update/${vendorId}`, formData)
  },

  // 改成 GET
  searchVendor(keyword) {
    const formData = new FormData()
    formData.append('keyword', keyword)

    return apiClient.get(`/find`, formData)
  },

  getNotifications(userId) {
    return apiClient.get(`/notification/${userId}`)
  },

  readNotification(notificationId) {
    return apiClient.put(`/notification/read/${notificationId}`)
  },

  deleteNotification(userId) {
    return apiClient.delete(`/notification/delete/${userId}`)
  },

  checkVendorEligibility(token) {
    return apiClient.get(`/convert/check`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  getVendorEligibility(token) {
    return apiClient.post(
      `/convert`,
      { confirm: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  },

  switchBackToMember(token) {
    return apiClient.post(
      `/switch-back`,
      { confirm: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  },
}
