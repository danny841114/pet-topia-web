<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="popup-review">
      <h3><b>評論圖片</b></h3>
      <span v-for="(photo, index) in reviewPhotos" :key="index" class="image-container" style="margin: 10px">
        <img :src="`${apiBase}${photo.imgUrl}`" alt="評論圖片" width="100" />
      </span>
      <div>
        <button type="button" class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" @click="emit('close')"
          style="margin: 5px">
          關閉
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { vendorApi } from '@/api/vendor/vendorApi'

const props = defineProps({
  vendorId: { type: Number, required: true },
  reviewId: { type: Number, required: true }
})

const emit = defineEmits(['close'])

const apiBase = import.meta.env.VITE_API_URL
const reviewPhotos = ref([])

const getReviewPhotos = async () => {
  try {
    reviewPhotos.value = await vendorApi.getVendorReviewPhotos(props.vendorId, props.reviewId);
  } catch (error) {
    console.error(`Get review photos of review ID '${reviewId}' failed: `, error)
  }
}

onMounted(getReviewPhotos)
</script>

<style scoped>
/* 遮罩層樣式 */
.overlay {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;

  z-index: 100;
}

/* 彈出框樣式 */
.popup-review {
  background: white !important;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;

  width: 500px;
  max-width: 90%;
  z-index: 110;
}

.image-container {
  position: relative;
}
</style>