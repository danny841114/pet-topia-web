<template>
  <header class="header-index">
    <div class="preloader-wrapper">
      <div class="preloader"></div>
    </div>

    <HeaderCart />
    <HeaderSearch />

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
          <div class="rounded-2 px-3"></div>
        </div>

        <div
          class="col-sm-8 col-lg-4 d-flex justify-content-end align-items-center gap-3 mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
          <div class="d-none d-xl-block">
            <HeaderUserMenu @logout="handleLogout" @become-vendor="handleBecomeVendor" />
          </div>

          <div class="d-block d-xl-none">
            <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSearch"
              aria-controls="offcanvasSearch">
              <Icon icon="tabler:search" class="fs-4"></Icon>
            </button>

            <button class="btn btn-primary position-relative" type="button" data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
              <Icon icon="mdi:cart" class="fs-4"></Icon>
            </button>
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
        <HeaderMobileMenu @logout="handleLogout" @become-vendor="handleBecomeVendor" />
      </nav>
    </div>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { authApi } from '@/api/user/authApi'
import { vendorApi } from '@/api/vendor/vendorApi'
import Swal from 'sweetalert2'
import HeaderSearch from './HeaderSearch.vue'
import HeaderCart from './HeaderCart.vue'
import HeaderUserMenu from './HeaderUserMenu.vue'
import HeaderMobileMenu from './HeaderMobileMenu.vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await authApi.logout(authStore.token)
  } catch (error) {
    console.error('Logout failed: ', error)
  } finally {
    authStore.clearToken()
    router.push({
      path: '/login',
      query: { logout: 'true' },
    })
  }
}

const handleBecomeVendor = async () => {
  try {
    const checkResult = await vendorApi.checkVendorEligibility(authStore.token)

    if (!checkResult.eligible) {
      Swal.fire({
        icon: 'warning',
        title: '無法成為商家',
        text: checkResult.message || '您目前無法成為商家',
        confirmButtonColor: '#2b4f76',
      })
      return
    }

    const result = await vendorApi.getVendorEligibility(authStore.token)

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

    await Swal.fire({
      icon: 'success',
      title: '切換成功',
      text: '已轉成商家帳號',
      confirmButtonColor: '#2b4f76',
    })

    router.push('/vendor/admin/profile')
  } catch (error) {
    console.error('切換到商家帳號失敗:', error)
    Swal.fire({
      icon: 'error',
      title: '切換失敗',
      text: '轉換成商家帳號時發生錯誤',
      confirmButtonColor: '#2b4f76',
    })
  }
}
</script>

<style scoped>
.header-index {
  position: relative;
  z-index: 1030;
}

.preloader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.preloader {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #2b4f76;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
