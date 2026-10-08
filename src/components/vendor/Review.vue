<template>
  <div class="overlay">
    <div class="popup-review">
      <h3 class="fw-bold mb-3">
        {{ isEdit ? '修改評論' : '新增評論' }}
      </h3>

      <form @submit.prevent="handleSubmit">
        <!-- 評論內容 -->
        <textarea v-model.trim="reviewContent" class="form-control mb-3" rows="4" placeholder="分享你的消費體驗與感想..."
          required></textarea>

        <!-- 星星評分區塊 -->
        <div class="ratings-container mb-3">
          <div v-for="category in ratingCategories" :key="category.key"
            class="d-flex align-items-center justify-content-center gap-2 mb-2">
            <span class="rating-label fw-bold">{{ category.label }}：</span>
            <div class="stars">
              <span v-for="star in 5" :key="star" class="star"
                :class="{ active: star <= (hoverRatings[category.key] || ratings[category.key]) }"
                @click="ratings[category.key] = star" @mouseover="hoverRatings[category.key] = star"
                @mouseout="hoverRatings[category.key] = 0">
                ★
              </span>
            </div>
            <span class="rating-num ms-1">{{ ratings[category.key] }} 分</span>
          </div>
        </div>

        <!-- 圖片上傳區塊 -->
        <div class="mb-3">
          <label class="btn btn-outline-secondary rounded-3 w-100 py-2 cursor-pointer">
            <i class="bi bi-cloud-upload me-2"></i>選擇 / 上傳照片
            <input type="file" multiple accept="image/*" class="d-none" @change="handleFileUpload" />
          </label>
        </div>

        <!-- 圖片預覽區域 -->
        <div class="scroll-container mb-4" v-if="originReviewPhotoList.length > 0 || reviewPhotos.length > 0">
          <!-- 原有圖片 -->
          <div v-if="activeOriginPhotos.length > 0" class="text-start mb-2">
            <small class="text-muted fw-bold">原有照片：</small>
            <div class="image-preview">
              <div v-for="photo in activeOriginPhotos" :key="photo.id" class="image-container">
                <img :src="photo.imgUrl" alt="原有圖片" class="preview-img" />
                <button type="button" class="img-button" @click="removeOriginImage(photo.id)">✕</button>
              </div>
            </div>
          </div>

          <!-- 新增圖片 -->
          <div v-if="reviewPhotos.length > 0" class="text-start">
            <small class="text-muted fw-bold">新增照片：</small>
            <div class="image-preview">
              <div v-for="(photo, index) in reviewPhotos" :key="index" class="image-container">
                <img :src="photo.previewUrl" alt="預覽圖片" class="preview-img" />
                <button type="button" class="img-button" @click="removeImage(index)">✕</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按鈕群 -->
        <div class="d-flex justify-content-center gap-2">
          <button type="button" class="btn btn-outline-secondary btn-lg rounded-4 px-4" @click="handleCancel">
            取消
          </button>

          <button v-if="isEdit" type="button" class="btn btn-outline-warning btn-lg rounded-4 px-4"
            @click="resetReview">
            重設
          </button>

          <button type="submit" class="btn btn-dark btn-lg rounded-4 px-4" :disabled="isSubmitting">
            {{ isSubmitting ? '處理中...' : (isEdit ? '儲存修改' : '發佈評論') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { vendorApi } from '@/api/vendor/vendorApi'
import Swal from 'sweetalert2'

const props = defineProps({
  vendorId: { type: Number, required: true },
  add: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  updateReviewId: { type: Number, default: null }
})

const emit = defineEmits(['close', 'refresh'])

const authStore = useAuthStore()
const memberId = authStore.memberId

const isEdit = computed(() => props.update && !!props.updateReviewId)
const isSubmitting = ref(false)

// 評分項目配置
const ratingCategories = [
  { key: 'environment', label: '環境' },
  { key: 'price', label: '價格' },
  { key: 'service', label: '服務' }
]

// Ratings 狀態響應式物件
const ratings = ref({ environment: 0, price: 0, service: 0 })
const hoverRatings = ref({ environment: 0, price: 0, service: 0 })

const reviewContent = ref('')
const reviewPhotos = ref([])
const originReviewPhotoList = ref([])
const removeImageList = ref([])

// 過濾掉被標記刪除的原有圖片
const activeOriginPhotos = computed(() => {
  return originReviewPhotoList.value.filter(photo => !removeImageList.value.includes(photo.id))
})

// 圖片上傳處理
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  const newPhotos = files.map(file => ({
    file,
    previewUrl: URL.createObjectURL(file)
  }))
  reviewPhotos.value.push(...newPhotos)
  event.target.value = '' // 清空 input 讓重複選相同檔案也能觸發
}

const removeImage = (index) => {
  URL.revokeObjectURL(reviewPhotos.value[index].previewUrl)
  reviewPhotos.value.splice(index, 1)
}

const removeOriginImage = (photoId) => {
  if (!removeImageList.value.includes(photoId)) {
    removeImageList.value.push(photoId)
  }
}

// 表單驗證
const validateForm = () => {
  if (Object.values(ratings.value).some(score => score === 0)) {
    Swal.fire({ title: '請完成所有項目的評分', icon: 'warning', confirmButtonText: '確定' })
    return false
  }
  return true
}

// 提交表單
const handleSubmit = async () => {
  if (!validateForm()) return
  isSubmitting.value = true

  try {
    if (isEdit.value) {
      await vendorApi.updateVendorReview(
        props.vendorId,
        props.updateReviewId,
        ratings.value.environment,
        ratings.value.price,
        ratings.value.service,
        reviewContent.value,
        reviewPhotos.value,
        removeImageList.value
      )

      await Swal.fire({ title: '修改成功', icon: 'success', timer: 1500, showConfirmButton: false })
    } else {
      await vendorApi.addVendorReview(
        props.vendorId,
        memberId,
        ratings.value.environment,
        ratings.value.price,
        ratings.value.service,
        reviewContent.value,
        reviewPhotos.value
      )

      await Swal.fire({ title: '發佈成功', icon: 'success', timer: 1500, showConfirmButton: false })
    }

    emit('refresh')
    emit('close')
  } catch (error) {
    console.error('提交失敗:', error)
    Swal.fire({ title: '提交失敗', text: '請稍後再試！', icon: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

// 重置評論
const resetReview = async () => {
  const ask = await Swal.fire({
    title: '確定重置嗎？',
    text: '尚未儲存的修改將會遺失',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '重置',
    cancelButtonText: '取消'
  })

  if (ask.isConfirmed) {
    await fetchReviewData()
  }
}

// 取消並關閉 Modal
const handleCancel = () => {
  cleanUpBlobUrls()
  emit('close')
}

// 載入資料
const fetchReviewData = async () => {
  if (!props.updateReviewId) return
  try {
    const res = await vendorApi.getVendorReview(props.vendorId, props.updateReviewId)
    reviewContent.value = res.review.reviewContent
    ratings.value = {
      environment: res.review.ratingEnvironment,
      price: res.review.ratingPrice,
      service: res.review.ratingService
    }

    originReviewPhotoList.value = await vendorApi.getVendorReviewPhotos(props.vendorId, props.updateReviewId)
    removeImageList.value = []
    cleanUpBlobUrls()
    reviewPhotos.value = []
  } catch (err) {
    console.error('讀取評論失敗:', err)
  }
}

// 清理內存中的 Blob URL
const cleanUpBlobUrls = () => {
  reviewPhotos.value.forEach(photo => {
    if (photo.previewUrl) URL.revokeObjectURL(photo.previewUrl)
  })
}

onMounted(() => {
  if (isEdit.value) {
    fetchReviewData()
  }
})

// 元件銷毀時自動釋放圖片內存
onUnmounted(() => {
  cleanUpBlobUrls()
})
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

.popup-review {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 520px;
  max-width: 90%;
}

.rating-label {
  min-width: 60px;
  text-align: right;
  font-size: 1rem;
}

.stars {
  display: flex;
  font-size: 26px;
  cursor: pointer;
}

.star {
  color: #dee2e6;
  transition: color 0.15s ease-in-out;
  user-select: none;
}

.star.active {
  color: #ffc107;
}

.rating-num {
  min-width: 40px;
  font-size: 0.9rem;
  color: #6c757d;
}

.scroll-container {
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 10px;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
}

.image-container {
  position: relative;
}

.preview-img {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.img-button {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #dc3545;
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.cursor-pointer {
  cursor: pointer;
}
</style>