<template>
  <header>
    <div class="preloader-wrapper">
      <div class="preloader">
      </div>
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
          <h4 class="text-primary text-uppercase mb-3">
            Search
          </h4>

          <div class="border rounded-2 border-dark-subtle">
            <form id="search-form" class="text-center d-flex align-items-center" action="" method="">
              <input type="text" class="form-control border-0 bg-transparent" placeholder="Search Here" />
              <Icon icon="tabler:search" class="fs-4 me-3"></Icon>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-2">
      <div class="row py-4 pb-0 pb-sm-4 align-items-center ">
        <div class="col-sm-4 col-lg-3 text-center text-sm-start">
          <div class="main-logo">
            <router-link to="/">
              <img src="/user_static/images/logo.png" alt="logo" class="img-fluid">
            </router-link>
          </div>
        </div>

        <div class="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
          <div class=" rounded-2 px-3">
          </div>
        </div>

        <div
          class="col-sm-8 col-lg-4 d-flex justify-content-end align-items-center gap-3 mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
          <div class="d-none d-xl-block">
            <ul class="d-flex list-unstyled m-0 gap-3">
              <li v-if="!authStore.isAuthenticated">
                <router-link to="/login" class="mx-3">
                  <Icon icon="mdi:login" class="fs-5"></Icon> <span class="fs-5">登入</span>
                </router-link>
              </li>

              <li v-if="!authStore.isAuthenticated">
                <router-link href="/register" class="mx-3">
                  <Icon icon="mdi:user-plus" class="fs-5"></Icon> <span class="fs-5">註冊</span>
                </router-link>
              </li>

              <li v-if="authStore.isAuthenticated && authStore.userRole === 'VENDOR'">
                <button type="button" class="mx-3" @click="switchBackToMember">
                  <Icon icon="mdi:account-switch" class="fs-5"></Icon>
                  <span class="fs-5">切換回會員</span>
                </button>
              </li>

              <li v-if="authStore.isAuthenticated">
                <button type="button" class="mx-3" @click="handleLogout">
                  <Icon icon="mdi:logout" class="fs-5"></Icon>
                  <span class="fs-5">登出</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <hr class="m-0">
    </div>

    <div class="container">
      <nav class="main-menu d-flex navbar navbar-expand-lg ">
        <div class="d-flex d-lg-none align-items-end mt-3">
          <ul class="d-flex justify-content-end list-unstyled m-0">
            <li v-if="!authStore.isAuthenticated">
              <router-link to="/login" class="mx-3">
                <Icon icon="mdi:login" class="fs-4"></Icon>登入
              </router-link>
            </li>

            <li v-if="!authStore.isAuthenticated">
              <router-link to="account.html" class="mx-3">
                <Icon icon="mdi:user-plus" class="fs-4"></Icon>註冊
              </router-link>
            </li>

            <li v-if="authStore.isAuthenticated && authStore.userRole === 'VENDOR'">
              <button type="button" class="mx-3" @click.prevent="switchBackToMember">
                <Icon icon="mdi:account-switch" class="fs-4"></Icon>切換回會員
              </button>
            </li>

            <li v-if="authStore.isAuthenticated">
              <button type="button" class="mx-3" @click.prevent="handleLogout">
                <Icon icon="mdi:logout" class="fs-4"></Icon>登出
              </button>
            </li>

            <li>
              <button type="button" class="mx-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSearch"
                aria-controls="offcanvasSearch">
                <Icon icon="tabler:search" class="fs-4"></Icon>搜尋
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
</template>
<script setup>
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth';
import { vendorApi } from '@/api/vendor/vendorApi';
import Swal from 'sweetalert2';

const authStore = useAuthStore();

const handleLogout = async () => {
  authStore.clearToken();

  // 發送登出事件通知其他組件
  window.dispatchEvent(new CustomEvent('user-logout'));

  await Swal.fire({
    icon: 'success',
    title: '登出成功！',
    text: '感謝您的使用',
    confirmButtonText: '確定'
  })

  // 使用 window.location.href 進行完整頁面刷新
  window.location.href = '/?logout=true';
};

const switchBackToMember = async () => {
  try {
    const data = await vendorApi.switchBackToMember(authStore.token)

    // 更新認證狀態
    authStore.setToken(
      data.token,
      data.userId,
      data.role,
      {
        userId: data.userId,
        email: data.email,
        userRole: data.role
      }
    );

    // 顯示成功訊息
    await Swal.fire({
      title: '切換成功',
      text: '已切換回會員帳號',
      icon: 'success',
      confirmButtonText: '確定'
    })

    // 使用 window.location.href 進行完整頁面刷新
    window.location.href = '/?switch_back=true';
  } catch (error) {
    console.error('切換回會員失敗:', error);
    Swal.fire({
      title: '切換失敗',
      text: '切換回會員帳號時發生錯誤',
      icon: 'error',
      confirmButtonText: '確定'
    });
  }
};
</script>

<style></style>
