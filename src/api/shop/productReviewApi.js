import axios from 'axios'

const URL = import.meta.env.VITE_API_URL

//新增商品評論
export const createProductReview = async (
  productId,
  memberId,
  rating,
  reviewDescription,
  reviewPhotos
) => {
  const formData = new FormData()

  formData.append('memberId', memberId)
  formData.append('rating', rating)
  formData.append('reviewDescription', reviewDescription)

  reviewPhotos.forEach((file) => {
    formData.append('reviewPhotos', file)
  })

  try {
    return await axios({
      method: 'POST',
      url: `${URL}/shop/product/${productId}/review/create`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (error) {
    console.error('提交評論時發生錯誤:', error)
    throw error
  }
}

// 獲取該會員的所有商品評論，並支持分頁
export const getMemberReviews = async (memberId, page = 1, size = 10) => {
  try {
    return await axios({
      method: 'GET',
      url: `${URL}/shop/reviews/member/${memberId}`,
      params: {
        page: page,
        size: size,
      },
    })
  } catch (error) {
    throw error
  }
}

export const updateProductReview = async (
  reviewId,
  rating,
  reviewDescription,
  deletePhotoIds,
  reviewPhoto
) => {
  const formData = new FormData()

  formData.append('reviewId', reviewId)
  formData.append('rating', rating)
  formData.append('reviewDescription', reviewDescription)

  if (deletePhotoIds && deletePhotoIds.length > 0) {
    deletePhotoIds.forEach((id) => {
      formData.append('deletePhotoIds', id)
    })
  }

  if (reviewPhoto && reviewPhoto.length > 0) {
    reviewPhoto.forEach((fileObj) => {
      if (fileObj.file instanceof File) {
        formData.append('newPhotos', fileObj.file)
      } else {
        console.warn('忽略非 File 類型的項目:', fileObj)
      }
    })
  }

  try {
    if (!reviewId) throw new Error('缺少 reviewId, 無法更新評論')

    return await axios({
      method: 'PUT',
      url: `${URL}/shop/reviews/${reviewId}/update`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (error) {
    console.error('更新評論時發生錯誤:', error)
    throw error
  }
}

// 獲取某個商品的平均評分
export const getAverageRating = async (productDetailId) => {
  try {
    const response = await axios.get(`${URL}/shop/products/${productDetailId}/reviews/avgRating`)
    console.log('API 回應資料:', response.data)
    return response.data
  } catch (error) {
    throw error
  }
}

// 找某商品的總評論述
export const getReviewCount = async (productDetailId) => {
  try {
    const response = await axios.get(`${URL}/shop/products/${productDetailId}/reviews/count`)
    return response.data
  } catch (error) {
    throw error
  }
}

// 找某商品的所有評論&分頁
export const getProductReviews = async (productDetailId, page = 1, size = 10) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/shop/reviews/product/${productDetailId}`,
      params: { page, size },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

//是否對該商品評論過
export const checkIfReviewed = async (productId, memberId) => {
  try {
    const response = await axios.get(`${URL}/shop/review/hasReviewed`, {
      params: { productId, memberId },
    })
    return response.data
  } catch (error) {
    console.error('API 請求錯誤:', error)
    return { hasReviewed: false }
  }
}
