import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
    userRole: localStorage.getItem('userRole') || null,
    username: localStorage.getItem('username') || null,
    userEmail: localStorage.getItem('userEmail') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    avatarUrl: null,
  }),

  getters: {
    memberId: (state) => {
      if (state.userRole === 'VENDOR' && state.user && state.user.memberId) {
        return state.user.memberId
      }
      return state.userId
    },

    isAuthenticated: (state) => !!state.token && !!state.userId,
  },

  actions: {
    setToken(token, userId, userRole, userData) {
      this.clearToken()

      if (!token || !userId) {
        console.error('缺少必要的認證資料')
        return
      }

      this.token = token
      this.userId = userId
      this.userRole = userRole

      const completeUserData = {
        ...userData,
        userId: userId,
        userRole: userRole,
      }

      this.user = completeUserData

      // 儲存到 localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
      localStorage.setItem('userRole', userRole)
      localStorage.setItem('user', JSON.stringify(completeUserData))
    },

    clearToken() {
      this.token = null
      this.userId = null
      this.userRole = null
      this.username = null
      this.userEmail = null
      this.user = null

      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userRole')
      localStorage.removeItem('username')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('user')
    },

    setUser(userData) {
      let currentStoredUser = null
      try {
        const storedUserStr = localStorage.getItem('user')
        if (storedUserStr) {
          currentStoredUser = JSON.parse(storedUserStr)
        }
      } catch (e) {
        console.error('讀取本地用戶信息失敗:', e)
      }

      const updatedUserData = {
        ...userData,
        userId: this.userId || userData.userId,
        userRole: this.userRole || userData.userRole,
      }

      // ===== 強化第三方登入用戶名稱處理邏輯 =====

      // 處理名稱優先級：
      // 1. 如果 userData 中的名稱不是郵箱，優先使用
      // 2. 如果本地有存儲的名稱且不是郵箱，使用本地存儲的
      // 3. 如果有 OAuth2 返回的名稱，使用它
      // 4. 最後才使用郵箱

      // 檢查是否是第三方登入
      if (updatedUserData.provider) {
        console.log('處理第三方登入用戶名稱:', {
          提供的名稱: updatedUserData.name,
          提供的memberName: updatedUserData.memberName,
          郵箱: updatedUserData.email,
          本地存儲名稱: currentStoredUser?.name,
        })

        if (updatedUserData.name === updatedUserData.email || !updatedUserData.name) {
          if (
            currentStoredUser &&
            currentStoredUser.name &&
            currentStoredUser.name !== currentStoredUser.email &&
            currentStoredUser.name !== 'null' &&
            currentStoredUser.name !== 'undefined'
          ) {
            console.log('使用本地存儲的更新名稱:', currentStoredUser.name)
            updatedUserData.name = currentStoredUser.name
            updatedUserData.memberName = currentStoredUser.name
          }
        }

        // console.log('最終使用的用戶名稱:', {
        //   name: updatedUserData.name,
        //   memberName: updatedUserData.memberName,
        //   來源: updatedUserData.name !== updatedUserData.email ? '非郵箱名稱' : '郵箱作為名稱',
        // })
      }

      if (!updatedUserData.memberName && updatedUserData.name) {
        updatedUserData.memberName = updatedUserData.name
      }
      if (!updatedUserData.name && updatedUserData.memberName) {
        updatedUserData.name = updatedUserData.memberName
      }

      // 移除 undefined 屬性
      Object.keys(updatedUserData).forEach((key) => {
        if (updatedUserData[key] === undefined) {
          delete updatedUserData[key]
        }
      })

      this.user = updatedUserData
      localStorage.setItem('user', JSON.stringify(updatedUserData))

      console.log('用戶資訊已更新:', this.user)
    },

    setAvatarUrl(url) {
      this.avatarUrl = url
    },

    setUserInfo(token, userId, userRole, username, userEmail) {
      this.clearToken()

      if (!token || !userId) return

      this.token = token
      this.userId = userId
      this.userRole = userRole
      this.username = username
      this.userEmail = userEmail

      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
      localStorage.setItem('userRole', userRole)
      localStorage.setItem('username', username)
      localStorage.setItem('userEmail', userEmail)
    },
  },
})
