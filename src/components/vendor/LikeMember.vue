<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="popup">
      <h3 class="fw-bold mb-3">有誰收藏</h3>

      <!-- 收藏名單列表 -->
      <div v-if="members.length > 0" class="scroll-container">
        <div v-for="member in members" :key="member.id || member.name"
          class="d-flex align-items-center justify-content-center my-2 fs-5">
          <img :src="member.profilePhotoBase64 || defaultPhoto" class="img-fluid rounded-4 me-2" alt="會員大頭貼"
            style="width: 30px; height: 30px; object-fit: cover" @error="handleImageError" />
          <span :class="{ 'text-secondary': !member.name }">
            {{ member.name || '(無名稱)' }}
          </span>
        </div>
      </div>

      <!-- 空資料提示 -->
      <div v-else class="text-secondary my-5 fs-5">
        目前沒有人收藏唷～
      </div>

      <!-- 關閉按鈕 -->
      <button type="button" class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 mt-3"
        @click="emit('close')">
        關閉
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  members: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

const defaultPhoto = '/user_static/images/tool/no-photo.png'

// 圖片載入失敗時自動備援
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