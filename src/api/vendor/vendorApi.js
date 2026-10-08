import apiClient from '../apiClient'

const API_PREFIX = '/api/vendor'

export const vendorApi = {
  getAllVendors() {
    return apiClient.get(`${API_PREFIX}/all`)
  },

  getVendors() {
    return apiClient.get(`${API_PREFIX}/all/for/swiper`)
  },

  // this API should be modified
  getVendorsByKeyword(keyword) {
    const formData = new FormData()
    formData.append('keyword', keyword)

    return apiClient.post(`${API_PREFIX}/find`, formData)
  },

  getVendorCategories() {
    return apiClient.get(`${API_PREFIX}/category/show`)
  },

  getVendor(vendorId) {
    return apiClient.get(`${API_PREFIX}/${vendorId}`)
  },

  getVendorImages(vendorId) {
    return apiClient.get(`${API_PREFIX}/${vendorId}/image`)
  },

  getVendorReviews(vendorId) {
    return apiClient.get(`${API_PREFIX}/${vendorId}/review`)
  },

  getVendorTags(vendorId) {
    return apiClient.get(`${API_PREFIX}/${vendorId}/tag`)
  },

  getOtherVendors(vendorId) {
    return apiClient.get(`${API_PREFIX}/all/except/${vendorId}`)
  },

  getOtherVendorsByCategorty(vendorId, categoryId) {
    return apiClient.get(`${API_PREFIX}/category/${categoryId}/except/vendor/${vendorId}`)
  },

  isReviewExisting(vendorId, memberId) {
    return apiClient.get(`${API_PREFIX}/${vendorId}/member/${memberId}/review/exist`)
  },

  isLikeExisting(vendorId, memberId) {
    return apiClient.get(`${API_PREFIX}/${vendorId}/member/${memberId}/like/status`)
  },

  toggleLike(vendorId, memberId) {
    return apiClient.post(`${API_PREFIX}/${vendorId}/like/toggle`, {
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

    return apiClient.post(`${API_PREFIX}/${vendorId}/review/add/final`, formData)
  },

  getVendorReview(vendorId, reviewId) {
    return apiClient.get(`${API_PREFIX}/review/${reviewId}`)
  },

  getVendorReviewPhotos(vendorId, reviewId) {
    return apiClient.get(`${API_PREFIX}/review/${reviewId}/photo`)
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

    return apiClient.put(`${API_PREFIX}/review/${reviewId}/rewrite/final`, formData)
  },

  deleteVendorReview(vendorId, reviewId) {
    return apiClient.delete(`${API_PREFIX}/review/${reviewId}/delete`)
  },

  getVendorLikes(vendorId) {
    return apiClient.get(`${API_PREFIX}/${vendorId}/like`)
  },

  getVendorAvgRating(vendorId) {
    return apiClient.get(`${API_PREFIX}/${vendorId}/update/rating`)
  },

  getVendorLikesByMemberId(memberId) {
    return apiClient.get(`${API_PREFIX}/member/${memberId}/like`)
  },

  getVendorReviewsByMemberId(memberId) {
    return apiClient.get(`${API_PREFIX}/member/${memberId}/like`)
  },

  deleteLike(likeId) {
    return apiClient.delete(`${API_PREFIX}/like/${likeId}/delete`)
  },

  // By Liou
  getSlogans(vendorId, token) {
    return apiClient.get(`${API_PREFIX}/${vendorId}/slogans`, {
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
    categoryId,
    deletedImageIds = [],
    imagePreviews = [],
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
    formData.append('categoryId', categoryId)

    if (Array.isArray(deletedImageIds)) {
      deletedImageIds.forEach((imgId) => {
        formData.append('deletedImageIds', imgId)
      })
    }

    if (Array.isArray(imagePreviews)) {
      imagePreviews.forEach((img) => {
        formData.append('files', img.file)
      })
    }

    let logoFile = null
    if (logoInput instanceof File) {
      logoFile = logoInput
    } else if (logoInput?.files?.[0] instanceof File) {
      logoFile = logoInput.files[0]
    } else if (Array.isArray(logoInput) && logoInput[0] instanceof File) {
      logoFile = logoInput[0]
    }

    if (logoFile) {
      formData.append('vendorLogoImg', logoFile)
      console.log('LOGO 檔案成功加入 FormData:', logoFile.name)
    } else {
      console.warn('未檢測到新的 LOGO 檔案')
    }

    return apiClient.put(`${API_PREFIX}/update/${vendorId}`, formData)
  },

  // 改成 GET
  searchVendor(keyword) {
    const formData = new FormData()
    formData.append('keyword', keyword)

    return apiClient.get(`${API_PREFIX}/find`, formData)
  },

  getNotifications(userId) {
    return apiClient.get(`${API_PREFIX}/notification/${userId}`)
  },

  readNotification(notificationId) {
    return apiClient.put(`${API_PREFIX}/notification/read/${notificationId}`)
  },

  deleteNotification(userId) {
    return apiClient.delete(`${API_PREFIX}/notification/delete/${userId}`)
  },

  checkVendorEligibility(token) {
    return apiClient.get(`${API_PREFIX}/convert/check`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  getVendorEligibility(token) {
    return apiClient.post(
      `${API_PREFIX}/convert`,
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
      `${API_PREFIX}/switch-back`,
      { confirm: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  },
}
