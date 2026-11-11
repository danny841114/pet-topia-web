<template>

  <div v-if="authStore.isAuthenticated" class="user-dropdown-container">
    <div class="user-profile-btn" @click="toggleUserMenu">
      <div class="d-flex align-items-center">
        <div class="avatar-container me-2">
          <img :src="userAvatar" :alt="userName" class="avatar" @error="handleAvatarError" />
        </div>

        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <Icon icon="mdi:chevron-down" class="ms-1 dropdown-icon" :class="{ rotate: showUserMenu }"></Icon>
        </div>
      </div>
    </div>

    <div class="user-dropdown-menu" v-show="showUserMenu">
      <!-- <div class="user-dropdown-header">
        <img :src="userAvatar" :alt="userName" class="dropdown-avatar" @error="handleAvatarError" />
        <div class="dropdown-user-info">
          <span class="dropdown-user-name">{{ userName }}</span>
          <span class="dropdown-user-email">{{ authStore.userEmail }}</span>
        </div>
      </div> -->

      <div class="user-dropdown-items">
        <router-link to="/profile" class="dropdown-item">
          <Icon icon="mdi:account" class="me-2"></Icon>會員中心
        </router-link>

        <router-link to="/shop/orderHistory" class="dropdown-item">
          <Icon icon="mdi:package" class="me-2"></Icon>歷史訂單
        </router-link>

        <router-link to="/profile/management/activity" class="dropdown-item">
          <Icon icon="mdi:heart" class="me-2"></Icon>我的收藏
        </router-link>

        <div class="dropdown-divider" v-if="authStore.canBecomeVendor"></div>

        <button type="button" class="dropdown-item vendor-item" v-if="authStore.canBecomeVendor"
          @click="handleBecomeVendor">
          <Icon icon="mdi:store" class="me-2"></Icon>店家專區
        </button>

        <div class="dropdown-divider" v-if="authStore.canBecomeVendor"></div>

        <button type="button" class="dropdown-item logout-item" @click="handleLogout">
          <Icon icon="mdi:logout" class="me-2"></Icon>登出
        </button>
      </div>
    </div>
  </div>

  <div v-else>
    <div class="d-flex gap-3">
      <router-link to="/login" class="login-item me-3">
        <Icon icon="mdi:login"></Icon>登入
      </router-link>

      <router-link to="/register" class="register-item me-3">
        <Icon icon="mdi:user-plus"></Icon>註冊
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { memberApi } from '@/api/user/memberApi'

const authStore = useAuthStore()
const route = useRoute()

const emit = defineEmits(['logout', 'become-vendor'])

const showUserMenu = ref(false)
const isLoading = ref(false)
const avatarUrl = ref(null)
const shouldForceRefreshUserData = ref(false)

const isEmailFormat = (text, email) => {
  if (!text || !email) return false
  if (text.toLowerCase() === email.toLowerCase()) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(text)
}

const userName = computed(() => authStore.displayName)

const userAvatar = computed(() => {
  if (!authStore.user) return '/user_static/images/default-avatar.png'
  if (authStore.user.provider) {
    return authStore.user.avatar || authStore.user.picture || '/user_static/images/default-avatar.png'
  }
  if (avatarUrl.value) return avatarUrl.value
  return '/user_static/images/default-avatar.png'
})

const fetchNameFromDatabase = async (force = false) => {
  if (!authStore.token || !authStore.userId) {
    if (!force) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      if (!authStore.token || !authStore.userId) {
        console.error('èªè­‰ç‹€æ…‹ä»æœªå°±ç·’ï¼Œæ”¾æ£„ç²å–')
        return null
      }
    }
  }

  try {
    const userEmail = authStore.userEmail || ''
    const data = await memberApi.getProfile(authStore.token)
    const name = data.name || (data.member ? data.member.name : null)

    let validName = null
    if (name && name !== 'null' && name !== 'undefined' && !isEmailFormat(name, userEmail)) {
      validName = name
    }

    if (validName) {
      if (authStore.userId) {
        localStorage.setItem(`db_name_${authStore.userId}`, validName)
        localStorage.setItem(`db_name_${authStore.userId}_temp`, validName)
      }
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      localStorage.setItem('userData', JSON.stringify({ ...userData, name: validName }))
      authStore.setUser({ ...authStore.user, name: validName })
      return validName
    }
    return null
  } catch (error) {
    console.error('å¾žè³‡æ–™åº«ç²å–ç”¨æˆ¶åç¨±å¤±æ•—:', error)
    return null
  }
}

const syncUserFromLocalStorage = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    if (userData && Object.keys(userData).length > 0 && userData.userId === authStore.userId) {
      if (userData.name && userData.name !== 'null' && userData.name !== 'undefined') {
        authStore.setUser({
          ...authStore.user,
          name: userData.name,
          memberName: userData.memberName || userData.name,
        })
        localStorage.setItem(`db_name_${userData.userId}`, userData.name)
      } else {
        const cachedName = localStorage.getItem(`db_name_${userData.userId}`)
        if (cachedName && cachedName !== 'null' && cachedName !== 'undefined') {
          authStore.setUser({
            ...authStore.user,
            name: cachedName,
            memberName: cachedName,
          })
          userData.name = cachedName
          userData.memberName = cachedName
          localStorage.setItem('userData', JSON.stringify(userData))
        }
      }
    }
    if (authStore.isAuthenticated && (!authStore.user?.name || authStore.user?.name === 'null')) {
      fetchNameFromDatabase(true).then((dbName) => {
        if (dbName) {
          authStore.setUser({ ...authStore.user, name: dbName, memberName: dbName })
          localStorage.setItem('userData', JSON.stringify({
            ...JSON.parse(localStorage.getItem('userData') || '{}'),
            name: dbName,
            memberName: dbName,
          }))
          localStorage.setItem(`db_name_${authStore.userId}`, dbName)
        }
      })
    }
  } catch (error) {
    console.error('åŒæ­¥æœ¬åœ°å­˜å„²ç”¨æˆ¶ä¿¡æ¯å¤±æ•—:', error)
  }
}

const fetchAvatar = async () => {
  if (!authStore.user || !authStore.token) return
  isLoading.value = true
  try {
    const timestamp = Date.now()
    const data = await memberApi.getProfilePhotoByTimestamp(timestamp, authStore.token)
    if (data.size > 0) {
      if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl.value)
      }
      avatarUrl.value = URL.createObjectURL(data)
      shouldForceRefreshUserData.value = !shouldForceRefreshUserData.value
    }
  } catch (error) {
    console.error('ç²å–é ­åƒå¤±æ•—:', error)
  } finally {
    isLoading.value = false
  }
}

const handleAvatarError = () => {
  if (!isLoading.value) fetchAvatar()
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleBecomeVendor = () => {
  emit('become-vendor')
}

const handleLogout = () => {
  emit('logout')
}

onMounted(() => {
  const newLogin = route.query.user_new_login === 'true'
  const oauthSuccess = route.query.oauth_success === 'true'
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const user = authStore.user || userData

  if (authStore.isAuthenticated) {
    if (!avatarUrl.value) fetchAvatar()
    if (user && user.provider) {
      const userEmail = user.email || ''
      const currentName = user.name || ''
      const needsFetch = isEmailFormat(currentName, userEmail)
        || newLogin || oauthSuccess || !localStorage.getItem(`db_name_${authStore.userId}`)
      if (needsFetch) fetchNameFromDatabase(true)
    }
    if (newLogin || oauthSuccess) {
      const url = new URL(window.location.href)
      url.searchParams.delete('user_new_login')
      url.searchParams.delete('oauth_success')
      window.history.replaceState({}, document.title, url.toString())
    }
  }
  syncUserFromLocalStorage()
})

watch(
  () => authStore.isAuthenticated,
  (newValue) => {
    if (newValue) {
      syncUserFromLocalStorage()
      if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl.value)
        avatarUrl.value = null
      }
      fetchAvatar()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarUrl.value)
  }
})
</script>

<style scoped>
.user-profile {
  position: relative;
  margin-right: 1rem;
}

.avatar-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #2b4f76;
  background-color: #fff;
  padding: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-dropdown-container {
  position: relative;
}

.user-profile-btn {
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background-color 0.3s;
  list-style: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  color: inherit;
}

.user-dropdown-container ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.user-profile-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dropdown-icon {
  transition: transform 0.3s;
}

.dropdown-icon.rotate {
  transform: rotate(180deg);
}

.user-dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  width: 250px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.user-dropdown-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  gap: 12px;
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2b4f76;
  flex-shrink: 0;
}

.dropdown-user-info {
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
}

.dropdown-user-name {
  font-weight: 600;
  color: #2b4f76;
  font-size: 1rem;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-user-email {
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-dropdown-items {
  padding: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.95rem;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-divider {
  height: 1px;
  background-color: #eee;
  margin: 8px 0;
}

.logout-item {
  color: #dc3545;
}

.logout-item:hover {
  background-color: #fff8f8;
}

.vendor-item {
  color: #2b6d53;
  font-weight: 500;
  border-radius: 4px;
  margin: 0 8px;
  transition: all 0.3s;
}

.vendor-item:hover {
  background-color: rgba(43, 109, 83, 0.1);
  color: #1a503c;
}

.login-item,
.register-item {
  color: #333;
  border: none;
  background: none;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.login-item:hover,
.register-item:hover {
  background-color: #f8f9fa;
  color: #2b4f76;
}

.login-item .nav-link,
.register-item .nav-link {
  color: inherit;
  text-decoration: none;
}
</style>
