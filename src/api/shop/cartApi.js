import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/shop/cart`,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const cartApi = {
  // 改為 GET
  getCartsByMemberId(memberId) {
    return apiClient.post('', null, { params: { memberId } })
  },

  // 方法改為 PUT, 參數改為 Request Body
  updateCart(memberId, productId, quantity) {
    return apiClient.post(
      '/api/updateCartProductQuantity',
      {},
      { params: { memberId, productId, quantity } }
    )
  },

  // 改為 DELETE
  deleteCart(cartId) {
    return apiClient.get('/api/deleteCartById', { params: { cartId } })
  },
}
