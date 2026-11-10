import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 檢查字符串是否為郵箱格式
const isEmailFormat = (text, email) => {
  if (!text || !email) return false
  if (text.toLowerCase() === email.toLowerCase()) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(text)
}

export const useAuthStore = defineStore('auth', () => {
  // ============ State (ref) ============
  const token = ref(localStorage.getItem('token') || null)
  const userId = ref(localStorage.getItem('userId') || null)
  const userRole = ref(localStorage.getItem('userRole') || null)
  const username = ref(localStorage.getItem('username') || null)
  const userEmail = ref(localStorage.getItem('userEmail') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const avatarUrl = ref(null)

  // ============ Getters (computed) ============
  const memberId = computed(() => {
    if (userRole.value === 'VENDOR' && user.value && user.value.memberId) {
      return user.value.memberId
    }
    return userId.value
  })

  const isAuthenticated = computed(() => !!token.value && !!userId.value)

  const displayName = computed(() => {
    if (!user.value) return '用戶'

    const email = user.value.email || ''

    // 1. 優先使用非郵箱的 name
    if (
      user.value.name &&
      user.value.name !== 'null' &&
      user.value.name !== 'undefined' &&
      !isEmailFormat(user.value.name, email)
    ) {
      return user.value.name
    }

    // 2. 其次 memberName
    if (
      user.value.memberName &&
      user.value.memberName !== 'null' &&
      user.value.memberName !== 'undefined' &&
      !isEmailFormat(user.value.memberName, email)
    ) {
      return user.value.memberName
    }

    // 3. 第三方登入 given_name
    if (
      user.value.given_name &&
      user.value.given_name !== 'null' &&
      user.value.given_name !== 'undefined'
    ) {
      return user.value.given_name
    }

    // 4. 最後郵箱前綴
    if (email) {
      return email.split('@')[0]
    }

    return '用戶'
  })

  const canBecomeVendor = computed(() => {
    if (!isAuthenticated.value) return false
    return user.value?.userRole === 'MEMBER'
  })

  // ============ Actions (functions) ============
  function setToken(tokenVal, userIdVal, userRoleVal, userData) {
    clearToken()

    if (!tokenVal || !userIdVal) {
      console.error('缺少必要的認證資料')
      return
    }

    token.value = tokenVal
    userId.value = userIdVal
    userRole.value = userRoleVal

    const completeUserData = {
      ...userData,
      userId: userIdVal,
      userRole: userRoleVal,
    }

    user.value = completeUserData

    // 儲存到 localStorage
    localStorage.setItem('token', tokenVal)
    localStorage.setItem('userId', userIdVal)
    localStorage.setItem('userRole', userRoleVal)
    localStorage.setItem('user', JSON.stringify(completeUserData))
  }

  function clearToken() {
    token.value = null
    userId.value = null
    userRole.value = null
    username.value = null
    userEmail.value = null
    user.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('user')
  }

  function setUser(userData) {
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
      userId: userId.value || userData.userId,
      userRole: userRole.value || userData.userRole,
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

    user.value = updatedUserData
    localStorage.setItem('user', JSON.stringify(updatedUserData))

    console.log('用戶資訊已更新:', user.value)
  }

  function setAvatarUrl(url) {
    avatarUrl.value = url
  }

  function setUserInfo(tokenVal, userIdVal, userRoleVal, usernameVal, userEmailVal) {
    clearToken()

    if (!tokenVal || !userIdVal) return

    token.value = tokenVal
    userId.value = userIdVal
    userRole.value = userRoleVal
    username.value = usernameVal
    userEmail.value = userEmailVal

    localStorage.setItem('token', tokenVal)
    localStorage.setItem('userId', userIdVal)
    localStorage.setItem('userRole', userRoleVal)
    localStorage.setItem('username', usernameVal)
    localStorage.setItem('userEmail', userEmailVal)
  }

  // ============ Return exposed API ============
  return {
    // State
    token,
    userId,
    userRole,
    username,
    userEmail,
    user,
    avatarUrl,
    // Getters
    memberId,
    isAuthenticated,
    displayName,
    canBecomeVendor,
    // Actions
    setToken,
    clearToken,
    setUser,
    setAvatarUrl,
    setUserInfo,
  }
})
