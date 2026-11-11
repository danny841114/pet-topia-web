<template>
  <nav class="main-menu d-flex navbar navbar-expand-lg">
    <div class="d-flex d-lg-none align-items-end mt-3">
      <ul class="d-flex justify-content-end list-unstyled m-0 gap-5">
        <li v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="dropdown-item mx-0">
            <Icon icon="mdi:login" class="fs-4"></Icon>登入
          </router-link>
        </li>

        <li v-if="!authStore.isAuthenticated">
          <router-link to="/register" class="dropdown-item mx-0">
            <Icon icon="mdi:user-plus" class="fs-4"></Icon>註冊
          </router-link>
        </li>

        <template v-else>
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

          <li v-if="authStore.canBecomeVendor">
            <button type="button" class="dropdown-item vendor-item" @click="handleBecomeVendor">
              <Icon icon="mdi:store" class="me-2"></Icon>店家專區
            </button>
          </li>

          <li>
            <button type="button" class="dropdown-item logout-item" @click="handleLogout">
              <Icon icon="mdi:logout" class="me-2"></Icon>登出
            </button>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const emit = defineEmits(['logout', 'become-vendor'])

const handleBecomeVendor = () => {
  emit('become-vendor')
}

const handleLogout = () => {
  emit('logout')
}
</script>

<style scoped>
/* 行動選單按鈕統一樣式：滑鼠懸停時字體變色 */
.dropdown-item:hover {
  background-color: transparent;
  color: #2b4f76;
}

.vendor-item,
.logout-item {
  color: #333;
}

.vendor-item:hover,
.logout-item:hover {
  background-color: transparent;
  color: #2b4f76;
}
</style>
