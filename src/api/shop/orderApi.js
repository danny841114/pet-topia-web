import axios from 'axios'

const URL = import.meta.env.VITE_API_URL

//取得訂單詳情By訂單ID
export const fetchOrderDetails = async (orderId, memberId) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/shop/orders/${orderId}`,
      params: {
        memberId: memberId,
      },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// 取得訂單歷史列表
export const fetchOrderHistory = async (filters, memberId) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/shop/orderHistory`,
      params: {
        orderStatus: filters.orderStatus,
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
        keyword: filters.searchProduct || null,
        page: filters.page,
        size: filters.size,
        memberId
      },
    })

    if (response.status === 200) {
      return {
        orders: response.data.content || [], // 返回訂單列表
        totalPages: Math.ceil(response.data.totalElements / filters.size), // 計算總頁數
      }
    } else if (response.status === 204) {
      return {
        orders: [],
        totalPages: 1,
      }
    }
  } catch (error) {
    throw error
  }
}
