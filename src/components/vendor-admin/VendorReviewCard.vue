<template>
  <div class="review-card">
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <h5 class="mb-0">評論詳情</h5>
        <button class="btn-close" @click="emit('close')"></button>
      </div>
      <div class="card-body">
        <p><strong>環境評分：</strong> {{ generateStars(ratingEnv) }} ({{ ratingEnv }})</p>
        <p><strong>價格評分：</strong> {{ generateStars(ratingPrice) }} ({{ ratingPrice }})</p>
        <p><strong>服務評分：</strong> {{ generateStars(ratingService) }} ({{ ratingService }})</p>
        <hr>
        <div class="photo-container">
          <img v-for="url in photoUrls" :key="url" :src="url" alt="Review Photo" class="review-photo"
            @click="openBigImage(url)">
        </div>
      </div>
    </div>
  </div>

  <BigPicture v-if="isBigPictureVisible" :img-src="bigPictureUrl" @close="isBigPictureVisible = false" />
</template>

<script setup>
import BigPicture from '../BigPicture.vue';
import { adminApi } from '@/api/vendor/adminApi';
import { vendorAdminApi } from '@/api/vendor/vendorAdminApi';
import { ref, onMounted, onUnmounted } from 'vue'

const token = localStorage.getItem('token')
const props = defineProps({
  reviewId: Number,
})
const emit = defineEmits(['close'])
const ratingEnv = ref(null)
const ratingPrice = ref(null)
const ratingService = ref(null)
const reviewPhotoIds = ref([])
const photoUrls = ref([])
const isBigPictureVisible = ref(false)
const bigPictureUrl = ref("")

const generateStars = (rating) => {
  let stars = ''
  for (let i = 0; i < 5; i++) {
    stars += i < rating ? '⭐ ' : ' '
  }
  return stars
}

const openBigImage = (imgUrl) => {
  bigPictureUrl.value = imgUrl
  isBigPictureVisible.value = true
}

const getImageSrc = async (photoId) => {
  try {
    const res = await adminApi.getVendorReviewPhotoById(photoId, token)
    return URL.createObjectURL(res);
  } catch (error) {
    console.error('圖片加載失敗', error);
  }
}

const getReviewDetail = async () => {
  try {
    const data = await vendorAdminApi.getVendorReviewById(props.reviewId)

    ratingEnv.value = data.ratingEnvironment
    ratingPrice.value = data.ratingPrice
    ratingService.value = data.ratingService
  } catch (error) {
    console.error("Get review detail failed: ", error)
  }
}

const getReviewPhotos = async () => {
  try {
    reviewPhotoIds.value = await adminApi.getVendorReviewPhotos(props.reviewId, token)
    photoUrls.value = await Promise.all(reviewPhotoIds.value.map(id => getImageSrc(id)));
  } catch (error) {
    console.error('Get review photos faield:', error)
  }
}

onMounted(() => { getReviewDetail(), getReviewPhotos() })

onUnmounted(() => {
  photoUrls.value.forEach(url => URL.revokeObjectURL(url))
})
</script>

<style scoped>
.review-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  z-index: 1050;
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.card-header {
  background: #F4D8B1 !important;
  color: rgb(0, 1, 3) !important;
  padding: 12px 16px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  padding: 20px;
  font-size: 16px;
}

.review-photo {
  max-width: 100px;
  max-height: 100px;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.review-photo:hover {
  transform: scale(1.1);
}

.photo-modal-content img {
  width: 800px;
  height: 600px;
  object-fit: contain;
  border-radius: 10px;
}
</style>
