<template>
  <header class="header-index">
    <div class="preloader-wrapper">
      <div class="preloader"></div>
    </div>

    <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasCart"
      aria-labelledby="My Cart">
      <div class="offcanvas-header justify-content-center">
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>

      <div class="offcanvas-body">
        <div class="order-md-last">
          <h4 class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-primary">Your cart</span>
            <span class="badge bg-primary rounded-circle pt-2">3</span>
          </h4>

          <ul class="list-group mb-3">
            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">Grey Hoodie</h6>
                <small class="text-body-secondary">Brief description</small>
              </div>
              <span class="text-body-secondary">$12</span>
            </li>

            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">Dog Food</h6>
                <small class="text-body-secondary">Brief description</small>
              </div>
              <span class="text-body-secondary">$8</span>
            </li>

            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">Soft Toy</h6>
                <small class="text-body-secondary">Brief description</small>
              </div>
              <span class="text-body-secondary">$5</span>
            </li>

            <li class="list-group-item d-flex justify-content-between">
              <span class="fw-bold">Total (USD)</span>
              <strong>$20</strong>
            </li>
          </ul>

          <button class="w-100 btn btn-primary btn-lg" type="submit">Continue to checkout</button>
        </div>
      </div>
    </div>

    <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasSearch"
      aria-labelledby="Search">
      <div class="offcanvas-header justify-content-center">
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>

      <div class="offcanvas-body">
        <div class="order-md-last">
          <h4 class="text-primary text-uppercase mb-3">Search</h4>
          <div class="search-bar border rounded-2 border-dark-subtle">
            <form id="search-form" class="text-center d-flex align-items-center" action="" method="">
              <input type="text" class="form-control border-0 bg-transparent" placeholder="Search Here" />
              <Icon icon="tabler:search" class="fs-4 me-3"></Icon>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-2">
      <div class="row py-4 pb-0 pb-sm-4 align-items-center">
        <div class="col-sm-4 col-lg-3 text-center text-sm-start">
          <div class="main-logo">
            <router-link to="/">
              <img src="/user_static/images/logo.png" alt="logo" class="img-fluid" />
            </router-link>
          </div>
        </div>

        <div class="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
          <div class=" rounded-2 px-3 ">
          </div>
        </div>

        <div
          class="col-sm-8 col-lg-4 d-flex justify-content-end align-items-center gap-3 mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
          <div class="d-none d-xl-block">
            <ul class="d-flex list-unstyled m-0 gap-3">
              <template v-if="!authStore.isAuthenticated">
                <li>
                  <router-link to="/login" class="mx-3">
                    <Icon icon="mdi:login" class="fs-5"></Icon>
                    <span class="fs-5">登入</span>
                  </router-link>
                </li>

                <li>
                  <router-link to="/register" class="mx-3">
                    <Icon icon="mdi:user-plus" class="fs-5"></Icon>
                    <span class="fs-5">註冊</span>
                  </router-link>
                </li>
              </template>

              <template v-else>
                <li class="user-dropdown-container">
                  <div class="user-profile-btn" @click="toggleUserMenu">
                    <div class="d-flex align-items-center">
                      <div class="avatar-container me-2">
                        <img :src="userAvatar" :alt="userName" class="avatar" @error="handleAvatarError" />
                      </div>

                      <div class="user-info">
                        <span class="user-name">{{ userName }}</span>
                        <Icon icon="mdi:chevron-down" class="ms-1 dropdown-icon"></Icon>
                      </div>
                    </div>
                  </div>

                  <div class="user-dropdown-menu" v-show="showUserMenu">
                    <div class="user-dropdown-header">
                      <img :src="userAvatar" :alt="userName" class="dropdown-avatar" @error="handleAvatarError" />
                      <div class="dropdown-user-info">
                        <span class="dropdown-user-name">{{ userName }}</span>
                        <span class="dropdown-user-email">{{ userEmail }}</span>
                      </div>
                    </div>

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

                      <div class="dropdown-divider"></div>

                      <button type="button" v-if="showBecomeVendorButton" class="dropdown-item vendor-item"
                        @click="handleBecomeVendor">
                        <Icon icon="mdi:store" class="me-2"></Icon>店家專區
                      </button>

                      <div class="dropdown-divider" v-if="showBecomeVendorButton"></div>

                      <button type="button" class="dropdown-item logout-item" @click="handleLogout">
                        <Icon icon="mdi:logout" class="me-2"></Icon>登出
                      </button>
                    </div>
                  </div>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <hr class="m-0" />
    </div>

    <!-- 縮排時顯示之導覽列 -->
    <div class="container">
      <nav class="main-menu d-flex navbar navbar-expand-lg">
        <div v-if="!authStore.isAuthenticated" class="d-flex d-lg-none align-items-end mt-3">
          <ul class="d-flex justify-content-end list-unstyled m-0">
            <li>
              <router-link to="/login" class="mx-3">
                <Icon icon="mdi:login" class="fs-4"></Icon>登入
              </router-link>
            </li>

            <li>
              <router-link to="/register" class="mx-3">
                <Icon icon="mdi:user-plus" class="fs-4"></Icon>註冊
              </router-link>
            </li>
          </ul>
        </div>

        <div v-else class="d-flex d-lg-none align-items-end mt-3">
          <ul class="d-flex justify-content-end list-unstyled m-0">
            <li>
              <router-link to="/profile" class="dropdown-item">
                <Icon icon="mdi:account" class="me-2"></Icon>會員中心
              </router-link>
            </li>

            <li>
              <router-link to="/shop/orderHistory" class="dropdown-item">
                <Icon icon="mdi:package" class="me-2"></Icon>歷史訂單
              </router-link>
            </li>

            <li>
              <router-link to="/profile/management/activity" class="dropdown-item">
                <Icon icon="mdi:heart" class="me-2"></Icon>我的收藏
              </router-link>
            </li>

            <li>
              <button type="button" v-if="showBecomeVendorButton" class="dropdown-item vendor-item"
                @click="handleBecomeVendor">
                <Icon icon="mdi:store" class="me-2"></Icon>店家專區
              </button>
            </li>

            <li>
              <button type="button" class="dropdown-item logout-item" @click="handleLogout">
                <Icon icon="mdi:logout" class="me-2"></Icon>登出
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { memberApi } from '@/api/user/memberApi'
import { authApi } from '@/api/user/authApi'
import { vendorApi } from '@/api/vendor/vendorApi'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const query = route.query

// 檢查字符串是否為郵箱格式
const isEmailFormat = (text, email) => {
  if (!text || !email) return false
  if (text.toLowerCase() === email.toLowerCase()) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(text)
}

// 修改 userName 計算屬性
const userName = computed(() => {
  // 從 authStore 和 localStorage 獲取最新資料
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const user = authStore.user || userData
  const userEmail = user?.email || ''

  // 優先使用資料庫緩存的名稱
  if (authStore.userId) {
    const cachedName = localStorage.getItem(`db_name_${authStore.userId}`)
    if (cachedName && cachedName !== 'null' && cachedName !== 'undefined') {
      return cachedName
    }
  }

  // 如果有用戶資料，按優先順序使用名稱
  if (user) {
    // 優先使用 name
    if (user.name && user.name !== 'null' && user.name !== 'undefined' && !isEmailFormat(user.name, userEmail)) {
      return user.name
    }

    // 其次使用 memberName
    if (user.memberName && user.memberName !== 'null' && user.memberName !== 'undefined' && !isEmailFormat(user.memberName, userEmail)) {
      return user.memberName
    }

    // 再次使用 given_name（針對第三方登入）
    if (user.given_name && user.given_name !== 'null' && user.given_name !== 'undefined') {
      return user.given_name
    }

    // 最後使用郵箱名稱部分
    if (userEmail) {
      return userEmail.split('@')[0]
    }
  }

  return '用戶'
})

// 添加一個新方法，強制從資料庫獲取最新名稱
const fetchNameFromDatabase = async () => {
  if (!authStore.token || !authStore.userId) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (!authStore.token || !authStore.userId) {
      console.error('認證狀態仍未就緒，放棄獲取')
      return null
    }
  }

  try {
    const userEmail = authStore.email || ''

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
      const updatedUserData = {
        ...userData,
        name: validName,
      }

      localStorage.setItem('userData', JSON.stringify(updatedUserData))

      authStore.setUser({
        ...authStore.user,
        name: validName,
      })

      return validName
    } else {
      console.warn('未能從任何 API 獲取有效的用戶名稱')
      return null
    }
  } catch (error) {
    console.error('從資料庫獲取用戶名稱失敗:', error)
    return null
  }
}

// 添加状态管理
const isLoading = ref(false)
const avatarUrl = ref(null)

const userAvatar = computed(() => {
  // 如果沒有用戶信息，使用默認頭像
  if (!authStore.user) {
    console.error('未找到用戶信息，使用默認頭像');
    return '/user_static/images/default-avatar.png';
  }

  // console.log('處理用戶頭像:', {
  //   provider: authStore.user.provider,
  //   avatar: authStore.user.avatar,
  //   picture: authStore.user.picture,
  //   currentAvatarUrl: avatarUrl.value,
  // });

  // 如果是第三方登錄用戶，優先使用第三方頭像
  if (authStore.user.provider) {
    const avatar = authStore.user.avatar || authStore.user.picture || '/user_static/images/default-avatar.png';
    return avatar;
  }

  // 本地用戶，從後端獲取頭像
  if (avatarUrl.value) {
    return avatarUrl.value;
  }

  // 如果沒有頭像URL，立即觸發獲取
  fetchAvatar();
  return '/user_static/images/default-avatar.png';
});

// 獲取用戶頭像
const fetchAvatar = async () => {
  if (!authStore.user || !authStore.token) {
    console.error('用戶未登入，無法獲取頭像')
    return
  }

  isLoading.value = true

  try {
    const timestamp = Date.now() // 添加時間戳防止快取
    const data = await memberApi.getProfilePhotoByTimestamp(timestamp, authStore.token)

    if (data.size > 0) {
      // 釋放舊的 URL
      if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl.value)
      }
      const newAvatarUrl = URL.createObjectURL(blob)
      avatarUrl.value = newAvatarUrl

      // 觸發重新渲染
      shouldForceRefreshUserData.value = !shouldForceRefreshUserData.value
    }
  } catch (error) {
    console.error('獲取頭像失敗:', error)
  } finally {
    isLoading.value = false
  }
}

// 头像加载错误处理
const handleAvatarError = () => {
  if (!isLoading.value) {
    fetchAvatar()
  }
}

// 完全替換同步用戶信息的函數
const syncUserFromLocalStorage = () => {
  try {
    // 從 localStorage 獲取用戶數據
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null')

    // console.log('本地存儲中的用戶數據:', {
    //   userData,
    //   storedUser,
    //   currentAuthUser: authStore.user,
    // })

    // 如果本地存儲有用戶資訊
    if (userData && Object.keys(userData).length > 0) {
      // 檢查用戶ID是否匹配
      if (userData.userId === authStore.userId) {
        // 確保名稱不為空
        if (userData.name && userData.name !== 'null' && userData.name !== 'undefined') {

          // 更新 authStore 中的用戶資訊
          authStore.setUser({
            ...authStore.user,
            name: userData.name,
            memberName: userData.memberName || userData.name,
          })

          // 同時更新緩存
          localStorage.setItem(`db_name_${userData.userId}`, userData.name)
        } else {
          // 如果本地存儲中沒有名稱，嘗試從緩存中獲取
          const cachedName = localStorage.getItem(`db_name_${userData.userId}`)
          if (cachedName && cachedName !== 'null' && cachedName !== 'undefined') {
            // 更新 authStore
            authStore.setUser({
              ...authStore.user,
              name: cachedName,
              memberName: cachedName,
            })

            // 更新本地存儲
            userData.name = cachedName
            userData.memberName = cachedName
            localStorage.setItem('userData', JSON.stringify(userData))
          }
        }
      }
    }

    // 如果用戶已登入但沒有名稱，嘗試從資料庫獲取
    if (authStore.isAuthenticated && (!authStore.user?.name || authStore.user?.name === 'null')) {
      console.warn('用戶已登入但沒有名稱，嘗試從資料庫獲取')

      fetchNameFromDatabase(true).then((dbName) => {
        if (dbName) {
          console.log('成功從資料庫獲取到名稱:', dbName)
          authStore.setUser({
            ...authStore.user,
            name: dbName,
            memberName: dbName,
          })

          // 更新本地存儲
          const updatedUserData = {
            ...userData,
            name: dbName,
            memberName: dbName,
          }
          localStorage.setItem('userData', JSON.stringify(updatedUserData))
          localStorage.setItem(`db_name_${authStore.userId}`, dbName)
        }
      })
    }
  } catch (error) {
    console.error('同步本地存儲用戶信息失敗:', error)
  }
}

// 在組件掛載時
onMounted(() => {
  // 檢查是否有新的登入標誌
  const newLogin = query.user_new_login === 'true'
  const oauthSuccess = query.oauth_success === 'true'

  // 獲取用戶信息
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const user = authStore.user || userData

  // console.log('檢測到用戶信息:', {
  //   isAuthenticated: authStore.isAuthenticated,
  //   hasAvatar: !!avatarUrl.value,
  //   newLogin,
  //   oauthSuccess,
  //   user: user
  //     ? {
  //       provider: user.provider,
  //       name: user.name,
  //       email: user.email,
  //     }
  //     : null,
  // })

  // 如果用戶已登入
  if (authStore.isAuthenticated) {
    // 如果沒有頭像，嘗試獲取頭像
    if (!avatarUrl.value) {
      fetchAvatar()
    }

    // 第三方登入特別處理
    if (user && user.provider) {
      const userEmail = user.email || ''
      const currentName = user.name || ''

      // 判斷是否需要從資料庫獲取名稱
      const needsFetch = isEmailFormat(currentName, userEmail)
        || newLogin
        || oauthSuccess
        || !localStorage.getItem(`db_name_${authStore.userId}`)

      if (needsFetch) {
        fetchNameFromDatabase(true)
      }
    }

    // 移除URL參數以避免重複處理
    if (newLogin || oauthSuccess) {
      const url = new URL(window.location.href)
      url.searchParams.delete('user_new_login')
      url.searchParams.delete('oauth_success')
      window.history.replaceState({}, document.title, url.toString())
    }
  }

  // 監聽用戶菜單點擊外部關閉事件
  window.addEventListener('click', handleClickOutside)

  // 監聽用戶登入事件
  window.addEventListener('user-login', handleUserLogin)

  // 監聽用戶資訊更新事件
  window.addEventListener('user-info-updated', handleUserInfoUpdated)

  // 同步本地存儲的用戶信息
  syncUserFromLocalStorage()

  // 添加個人資料更新事件監聽
  window.addEventListener('profile-updated', handleProfileUpdate)

  // 定期檢查並更新頭像（每5分鐘）
  const avatarUpdateInterval = setInterval(() => {
    if (authStore.isAuthenticated) {
      fetchAvatar()
    }
  }, 5 * 60 * 1000)

  // 組件卸載時清理
  onUnmounted(() => {
    window.removeEventListener('profile-updated', handleProfileUpdate)
    clearInterval(avatarUpdateInterval)
    // 清理 blob URL
    if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(avatarUrl.value)
    }
  })
})

// 修改監聽認證狀態變化
watch(
  () => authStore.isAuthenticated,
  (newValue, oldValue) => {
    console.log('認證狀態變化:', { newValue, oldValue });

    if (newValue) {
      // 確保從本地存儲同步最新資訊
      syncUserFromLocalStorage();
      // 重置頭像 URL
      if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl.value);
        avatarUrl.value = null;
      }
      // 重新獲取頭像
      fetchAvatar();
    }
  },
  { immediate: true }
);

// 監聽 localStorage 變化 (可以檢測到其他標籤頁的更改)
window.addEventListener('storage', (event) => {
  if (event.key === 'user' && event.newValue) {
    console.log('檢測到 localStorage 用戶信息變化')
    syncUserFromLocalStorage()
  }
})

const handleLogout = async () => {
  try {
    await authApi.logout(authStore.token)

    // 清理頭像 blob URL
    if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(avatarUrl.value);
      avatarUrl.value = null;
    }

    // 清除認證資料
    authStore.clearToken();

    // 清除用戶相關的本地存儲
    localStorage.removeItem('userData');
    localStorage.removeItem('oauth2_provider');
    localStorage.removeItem('oauth2_timestamp');
    localStorage.removeItem('oauth2_email');

    // 清除名稱緩存
    const keys = Object.keys(localStorage);
    const nameCacheKeys = keys.filter(key => key.startsWith('db_name_'));
    nameCacheKeys.forEach(key => localStorage.removeItem(key));

    // 關閉用戶選單
    showUserMenu.value = false;

    // 導航到登入頁面
    router.push({
      path: '/login',
      query: { logout: 'true' }
    });
  } catch (error) {
    console.error('登出過程中發生錯誤:', error);
    // 即使發生錯誤，也清除本地狀態
    if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(avatarUrl.value);
      avatarUrl.value = null;
    }

    authStore.clearToken();
    router.push({
      path: '/login',
      query: { logout: 'true' }
    });
  }
}

const userEmail = computed(() => {
  if (!authStore.user) return ''
  return authStore.user.email || ''
})

const showUserMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const shouldForceRefreshUserData = ref(false)

// 處理點擊外部關閉用戶菜單
const handleClickOutside = (event) => {
  const userDropdown = document.querySelector('.user-dropdown-container')
  const userProfileBtn = document.querySelector('.user-profile-btn')

  if (
    (userDropdown && !userDropdown.contains(event.target)) ||
    (userProfileBtn &&
      userProfileBtn.contains(event.target) &&
      event.target.closest('.dropdown-item'))
  ) {
    showUserMenu.value = false
  }
}

// 處理用戶登入事件
const handleUserLogin = (event) => {
  if (event.detail && event.detail.user) {
    // 如果是第三方登入，需要檢查名稱
    if (event.detail.user.provider) {
      const userEmail = event.detail.user.email || ''
      const userName = event.detail.user.name || ''

      // 如果當前名稱是郵箱格式，立即從資料庫獲取最新名稱
      if (isEmailFormat(userName, userEmail)) {

        // 立即獲取資料庫名稱
        fetchNameFromDatabase(true).then((dbName) => {
          if (dbName && dbName !== userName) {
            shouldForceRefreshUserData.value = true

            // 立即更新 authStore
            if (authStore.user) {
              authStore.setUser({
                ...authStore.user,
                name: dbName,
              })
            }

            // 更新 localStorage
            const userData = JSON.parse(localStorage.getItem('userData') || '{}')
            localStorage.setItem(
              'userData',
              JSON.stringify({
                ...userData,
                name: dbName,
              })
            )

            // 發出全局事件通知其他組件重新獲取用戶信息
            window.dispatchEvent(
              new CustomEvent('user-info-updated', {
                detail: { user: { ...event.detail.user, name: dbName } },
              })
            )
          }
        })
      }
    }

    // 重新獲取頭像
    fetchAvatar()
  }
}

// 處理用戶資訊更新事件
const handleUserInfoUpdated = (event) => {
  if (event.detail && event.detail.user) {
    // 強制更新 UI
    const isUsernameExisting = (!authStore.user || event.detail.user.name !== authStore.user.name)
    if (event.detail.user.name && isUsernameExisting) {
      // 更新 authStore
      authStore.setUser({
        ...authStore.user,
        ...event.detail.user,
      })

      // 設置強制更新標誌
      shouldForceRefreshUserData.value = true
    }

    // 如果有頭像更新，也獲取最新頭像
    if (event.detail.updateAvatar) {
      fetchAvatar()
    }
  }
}

const showBecomeVendorButton = computed(() => {
  // 只有當用戶是會員（MEMBER）角色時才顯示
  if (!authStore.isAuthenticated) return false
  return authStore.user?.role === 'MEMBER' || !authStore.user?.role
})

// 處理成為商家點擊事件
const handleBecomeVendor = async () => {
  try {
    // 首先檢查用戶是否有資格成為商家
    const checkResult = await vendorApi.checkVendorEligibility(authStore.token)

    if (!checkResult.eligible) {
      Swal.fire({
        icon: 'warning',
        title: '無法成為商家',
        text: checkResult.message || '您目前無法成為商家',
        confirmButtonColor: '#2b4f76'
      })
      return
    }

    // 根據檢查結果決定下一步操作
    if (checkResult.hasExistingAccount) {
      // 如果已有商家帳號，詢問是否切換
      const result = await Swal.fire({
        title: '切換商家模式',
        text: '您已有商家帳號，是否切換到商家模式？',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        confirmButtonColor: '#2b4f76',
        cancelButtonColor: '#6c757d'
      })

      if (result.isConfirmed) {
        await switchToVendor()
      }
    } else {
      // 如果沒有商家帳號，詢問是否創建
      const result = await Swal.fire({
        title: '轉換為商家',
        text: '需創建一個新的商家帳號，是否繼續？',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        confirmButtonColor: '#2b4f76',
        cancelButtonColor: '#6c757d'
      })

      if (result.isConfirmed) {
        await convertToVendor()
      }
    }
  } catch (error) {
    console.error('處理成為商家請求失敗:', error)
    Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: '處理請求時發生錯誤，請稍後再試',
      confirmButtonColor: '#2b4f76'
    })
  }
}

// 切換到已有商家帳號
const switchToVendor = async () => {
  try {
    // 檢查認證狀態
    if (!authStore.token) {
      console.error('未登入或 token 已過期');
      Swal.fire({
        icon: 'warning',
        title: '請先登入',
        text: '請先登入系統',
        confirmButtonColor: '#2b4f76'
      });
      return;
    }

    // console.log('開始切換到商家帳號，當前認證狀態:', {
    //   token: authStore.token,
    //   userId: authStore.userId,
    //   userRole: authStore.userRole
    // });

    const result = await vendorApi.getVendorEligibility(authStore.token)
    console.log('切換到商家帳號成功，收到資料:', result);

    // 驗證返回的資料
    if (!result.token || !result.vendorId || !result.role) {
      console.error('API 返回資料不完整:', result);
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: '系統返回資料不完整，請稍後再試',
        confirmButtonColor: '#2b4f76'
      });
      return;
    }

    // 更新認證狀態
    authStore.setToken(
      result.token,
      result.vendorId,
      result.role,
      {
        id: result.vendorId,
        email: result.email,
        role: result.role,
        provider: 'LOCAL',
      }
    );

    // console.log('認證狀態已更新:', {
    //   token: result.token,
    //   vendorId: result.vendorId,
    //   role: result.role
    // });

    // 顯示成功訊息
    await Swal.fire({
      icon: 'success',
      title: '切換成功',
      text: '已轉成商家帳號',
      confirmButtonColor: '#2b4f76'
    });

    // 使用 window.location 進行跳轉
    window.location.href = '/vendor/admin/profile'
  } catch (error) {
    console.error('切換到商家帳號失敗:', error);
    Swal.fire({
      icon: 'error',
      title: '切換失敗',
      text: '轉換成商家帳號時發生錯誤',
      confirmButtonColor: '#2b4f76'
    });
  }
}

// 創建並轉換為新的商家帳號
const convertToVendor = async () => {
  try {
    const result = await vendorApi.getVendorEligibility(authStore.token)

    // 更新認證狀態
    authStore.setToken(
      result.token,
      result.vendorId,
      result.role,
      {
        id: result.vendorId,
        email: result.email,
        role: result.role,
        provider: 'LOCAL',
      }
    )

    // 顯示成功訊息
    await Swal.fire({
      icon: 'success',
      title: '轉換成功',
      text: '您已成功成為商家，請完成後續資料填寫',
      confirmButtonColor: '#2b4f76'
    })

    // 使用 window.location 進行跳轉
    window.location.href = '/vendor/admin/profile'
  } catch (error) {
    console.error('成為商家失敗:', error)
    Swal.fire({
      icon: 'error',
      title: '轉換失敗',
      text: '轉換商家時發生錯誤，請稍後再試',
      confirmButtonColor: '#2b4f76'
    })
  }
}

const handleProfileUpdate = async (event) => {

  try {
    const userData = await memberApi.getProfile(authStore.token)

    // 更新 authStore
    const updatedUser = {
      ...authStore.user,
      name: userData.name,
      memberName: userData.name,
      avatar: userData.avatar,
    }
    authStore.setUser(updatedUser)

    // 更新 localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}')
    const updatedUserData = {
      ...storedUserData,
      name: userData.name,
      memberName: userData.name,
      avatar: userData.avatar,
    }
    localStorage.setItem('userData', JSON.stringify(updatedUserData))

    // 更新名稱緩存
    if (authStore.userId) {
      localStorage.setItem(`db_name_${authStore.userId}`, userData.name)
    }

    // 強制重新獲取頭像
    avatarUrl.value = null // 清除現有頭像
    await fetchAvatar() // 立即獲取新頭像

    // 觸發重新渲染
    shouldForceRefreshUserData.value = !shouldForceRefreshUserData.value

    // 發送全局事件通知其他組件更新
    window.dispatchEvent(
      new CustomEvent('user-info-updated', {
        detail: {
          user: updatedUser,
          updateAvatar: true,
        },
      })
    )
  } catch (error) {
    console.error('同步用戶資料失敗:', error)
  }
}

// 添加監聽器來觀察頭像變化
watch(avatarUrl, (newUrl, oldUrl) => {
  if (newUrl !== oldUrl) {
    // 觸發重新渲染
    shouldForceRefreshUserData.value = !shouldForceRefreshUserData.value
  }
})

// 添加監聽器來觀察 authStore.user 的變化
watch(
  () => authStore.user,
  (newUser, oldUser) => {
    if (newUser?.name !== oldUser?.name) {
      // 強制更新緩存
      if (authStore.userId && newUser?.name) {
        localStorage.setItem(`db_name_${authStore.userId}`, newUser.name)
      }
    }
  },
  { deep: true }
)
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

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-info .username {
  color: #fff;
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.user-dropdown-container {
  position: relative;
}

.user-profile-btn {
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.user-profile-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dropdown-icon {
  transition: transform 0.3s;
}

.user-dropdown-container:hover .dropdown-icon {
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
</style>
