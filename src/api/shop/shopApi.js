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
}
