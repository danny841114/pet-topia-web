<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="popup">
      <h3 class="fw-bold mb-4">詳細評分</h3>

      <div class="rating-list">
        <!-- 整體平均 (重點標示) -->
        <div class="rating-item main-item">
          <span class="label">整體平均</span>
          <span class="score-badge main-badge">
            ★ {{ formatRating(avgRate?.totalRating) }}
          </span>
        </div>

        <!-- 分項評分 -->
        <div class="rating-item">
          <span class="label">環境</span>
          <span class="score">★ {{ formatRating(avgRate?.avgRatingEnvironment) }}</span>
        </div>

        <div class="rating-item">
          <span class="label">價格</span>
          <span class="score">★ {{ formatRating(avgRate?.avgRatingPrice) }}</span>
        </div>

        <div class="rating-item">
          <span class="label">服務</span>
          <span class="score">★ {{ formatRating(avgRate?.avgRatingService) }}</span>
        </div>
      </div>

      <!-- 關閉按鈕 -->
      <button type="button" class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 mt-4 w-100"
        @click="emit('close')">
        關閉
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  avgRate: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

const formatRating = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '-'
  return Number(val).toFixed(1)
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
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 400px;
  max-width: 90%;
}

/* 評分清單容器 */
.rating-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 評分單項目 */
.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 10px;
  font-size: 1.1rem;
}

.label {
  color: #495057;
  font-weight: 500;
}

.score {
  font-weight: bold;
  color: #ffc107;
}

/* 整體評分強調 */
.main-item {
  background-color: #fff5f5;
  border: 1px solid #ffe3e3;
}

.main-item .label {
  color: #e03131;
  font-weight: bold;
}

.main-badge {
  background-color: #e03131;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.1rem;
}
</style>