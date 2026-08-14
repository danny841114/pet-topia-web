import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/shop`,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const shopApi = {
  getCheckoutData(memberId, productIds) {
    return apiClient.get('/checkout', { params: { memberId, productIds } })
  },

  getMemberData(memberId, cancelToken) {
    return apiClient.get('/checkout', {
      params: { memberId },
      cancelToken: cancelToken,
    })
  },

  getAddressData(memberId, cancelToken) {
    return apiClient.get('/shipping/address', {
      params: { memberId },
      cancelToken: cancelToken,
    })
  },

  sendCheckoutData(
    memberId,
    couponId,
    shippingCategoryId,
    paymentCategoryId,
    paymentAmount,
    street,
    city,
    receiverName,
    receiverPhone,
    cartItems
  ) {
    return apiClient.post(
      '/checkout',
      {
        couponId,
        shippingCategoryId,
        paymentCategoryId,
        paymentAmount,
        street,
        city,
        receiverName,
        receiverPhone,
        cartItems,
      },
      { params: { memberId }, withCredentials: true }
    )
  },

  getProducts(start, rows, category, keyword) {
    return apiClient.get('/products', { params: { start, rows, category, keyword } })
  },

  getProductDetail(productDetailId) {
    return apiClient.get('/productDetail', { params: { productDetailId } })
  },

  confirmProduct(memberId, productDetailId, productSizeId, productColorId) {
    return apiClient.post('/productDetail/api/getConfirmProductByDetailIdSizeIdColorId', null, {
      params: { memberId, productDetailId, productSizeId, productColorId },
    })
  },

  getProductByOption(productDetailId, optionId, optionName) {
    return apiClient.post('/productDetail/api/getProductByOption', null, {
      params: { productDetailId, optionId, optionName },
    })
  },

  getProductByDetailId(productDetailId) {
    return apiClient.get('/productDetail/api/getProductByProductDetailId', {
      params: { productDetailId },
    })
  },

  addProductIntoCart(memberId, productDetailId, productSizeId, productColorId, quantity) {
    return apiClient.post('/productDetail/api/addProductToCart', null, {
      params: { memberId, productDetailId, productSizeId, productColorId, quantity },
    })
  },
}
