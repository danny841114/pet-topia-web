<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="popup">
      <h3>
        <b v-if="categoryVendors.length > 0">
          同類別店家：<span class="text-danger">{{ categoryCategoryName }}</span>
        </b>
        <b v-else>同類別店家</b>
      </h3>

      <div v-if="categoryVendors.length > 0" class="scroll-container">
        <div v-for="vendor in categoryVendors" :key="vendor.id"
          class="d-flex align-items-center justify-content-center my-2 fs-5">
          <img :src="vendor.logoImgBase64 || defaultPhoto" class="img-fluid rounded-4 me-2" alt="店家 Logo"
            style="width: 30px; height: 30px; object-fit: cover" @error="handleImageError" />
          <RouterLink :to="`/vendor/detail/${vendor.id}`" class="text-decoration-none">
            {{ vendor.name || '無店家名稱' }}
          </RouterLink>
        </div>
      </div>

      <div v-else class="text-secondary my-5">
        目前沒有其他同類別店家～
      </div>

      <button type="button" class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 mt-3"
        @click="emit('close')">
        關閉
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  categoryVendors: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

const defaultPhoto = '/user_static/images/tool/no-photo.png'

// 安全取得類別名稱
const categoryCategoryName = computed(() => {
  return props.categoryVendors[0]?.vendorCategory?.name || ''
})

// 圖片載入失敗時的備援處理
const handleImageError = (e) => {
  e.target.src = defaultPhoto
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.popup {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 500px;
  max-width: 90%;
}

.scroll-container {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 10px;
  margin-top: 15px;
}
</style>