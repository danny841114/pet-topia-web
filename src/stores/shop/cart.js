import { defineStore } from 'pinia'
import axios from 'axios'

const PATH = `${import.meta.env.VITE_API_URL}`

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartCount: 0,
  }),

  actions: {
    async fetchCartCount(memberId) {
      if (memberId) {
        try {
          const response = await axios({
            method: 'get',
            url: `${PATH}/shop/cart/api/getMemberCartCount`,
            params: { memberId: memberId },
          })

          this.cartCount = response.data
          // console.log(response.data);
        } catch (error) {
          console.log(error)
        }
      } else {
        this.cartCount = 0
      }
    },
  },

  persist: {
    strategies: [
      {
        key: 'cart-store', // 存儲 key
        storage: sessionStorage,
      },
    ],
  },
})
