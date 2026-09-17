<template>
  <div v-if="isOpen" class="overlay">
    <div class="popup-review">
      <h3><b v-if="add">新增評論</b></h3>
      <h3><b v-if="update">修改評論</b></h3>
      <form @submit.prevent="handleSubmit()">
        <textarea v-model="review.content" placeholder="輸入感想" style="width: 400px; height: 100px" required></textarea>
        <br />

        <!--星星-->
        <div class="stars">
          <span v-for="star in 5" :key="star" class="star" :class="{
            active: tempRating1 > 0 ? star <= tempRating1 : star <= rating1, // hover執行順序優於click
          }" @click="setRating1(star)" @mouseover="hoverRating1(star)" @mouseout="resetHover1">
            ★
          </span>
          <span>環境：{{ rating1 }}</span>
        </div>

        <div class="stars">
          <span v-for="star in 5" :key="star" class="star" :class="{
            active: tempRating2 > 0 ? star <= tempRating2 : star <= rating2, // hover執行順序優於click
          }" @click="setRating2(star)" @mouseover="hoverRating2(star)" @mouseout="resetHover2">
            ★
          </span>
          <span>價格：{{ rating2 }}</span>
        </div>

        <div class="stars">
          <span v-for="star in 5" :key="star" class="star" :class="{
            active: tempRating3 > 0 ? star <= tempRating3 : star <= rating3, // hover執行順序優於click
          }" @click="setRating3(star)" @mouseover="hoverRating3(star)" @mouseout="resetHover3">
            ★
          </span>
          <span>服務：{{ rating3 }}</span>
        </div>
        <!--星星-->

        <input type="file" multiple @change="handleFileUpload"
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" />

        <div class="scroll-container">
          <!-- 原有圖片 -->
          <div v-if="originReviewPhotoList.length != 0">=== 原有圖片 ===</div>
          <div class="image-preview">
            <div v-for="(photo, index) in originReviewPhotoList" :key="index" class="image-container">
              <img :src="`${apiBase}${photo.imgUrl}`" alt="選擇的圖片" class="preview-img"
                v-if="!removeImageList.includes(photo.id)" />
              <button type="button" class="img-button" @click="removeOriginImage(photo.id)"
                v-if="!removeImageList.includes(photo.id)">
                刪除
              </button>
            </div>
          </div>
          <!-- 原有圖片 -->

          <!-- 新增圖片 -->
          <div v-if="reviewPhotos.length != 0">=== 新增圖片 ===</div>
          <div class="image-preview">
            <div v-for="(photo, index) in reviewPhotos" :key="index" class="image-container">
              <img :src="photo.previewUrl" alt="選擇的圖片" class="preview-img" />
              <button type="button" class="img-button" @click="removeImage(index)">刪除</button>
            </div>
          </div>
          <!-- 新增圖片 -->
        </div>
        <br />

        <button type="button" class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" @click="closeModal">
          取消
        </button>
        &emsp;
        <button v-if="update" type="button" class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          @click="resetComment()">
          重設
        </button>
        &emsp;
        <button v-if="add" class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" type="submit">
          新增
        </button>
        <button v-if="update" class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" type="submit">
          修改
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { vendorApi } from '@/api/vendor/vendorApi'
import Swal from 'sweetalert2'

const props = defineProps({
  isOpen: Boolean,
  vendorId: Number,
  add: Boolean,
  update: Boolean,
  updateReviewId: Number
})

const emit = defineEmits(['close'])

const authStore = useAuthStore()
const memberId = authStore.memberId
const review = ref({})
const reviewPhotos = ref([])
const originReviewPhotoList = ref([])
const removeImageList = ref([])
const rating1 = ref(0)
const tempRating1 = ref(0)
const rating2 = ref(0)
const tempRating2 = ref(0)
const rating3 = ref(0)
const tempRating3 = ref(0)

// 第一組
const setRating1 = (value) => {
  rating1.value = value
}
const hoverRating1 = (value) => {
  tempRating1.value = value
}
const resetHover1 = () => {
  tempRating1.value = 0
}

// 第二組
const setRating2 = (value) => {
  rating2.value = value
}
const hoverRating2 = (value) => {
  tempRating2.value = value
}
const resetHover2 = () => {
  tempRating2.value = 0
}

// 第三組
const setRating3 = (value) => {
  rating3.value = value
}
const hoverRating3 = (value) => {
  tempRating3.value = value
}
const resetHover3 = () => {
  tempRating3.value = 0
}

const handleSubmit = () => {
  if (props.add) {
    submitReviewFinal()
    console.log('執行新增')
  } else if (props.update) {
    submitRewirte()
    console.log('執行修改')
  }
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)

  // 確保圖片存入 review.value.reviewPhotos
  const newPhotos = files.map((file) => ({
    file,
    previewUrl: URL.createObjectURL(file),
  }))

  reviewPhotos.value.push(...newPhotos)
}

const removeImage = (index) => {
  // 釋放內存
  URL.revokeObjectURL(reviewPhotos.value[index].previewUrl)
  // 移除圖片
  reviewPhotos.value.splice(index, 1)
}


const removeOriginImage = (photoId) => {
  if (!removeImageList.value.includes(photoId)) {
    removeImageList.value.push(photoId)
  }
}

const submitReviewFinal = async () => {
  if (!review.value.content || !rating1.value || !rating2.value || !rating3.value) {
    Swal.fire({
      title: '欄位未填寫完整',
      icon: 'error',
      confirmButtonText: '確定',
    })
    return
  }

  try {
    await vendorApi.addVendorReview(
      props.vendorId,
      memberId,
      rating1.value,
      rating2.value,
      rating3.value,
      review.value.content,
      reviewPhotos.value
    )

    await Swal.fire({
      title: '提送成功',
      icon: 'success',
      confirmButtonText: '確定',
    })

    window.location.reload() // 重刷頁面，之後有時間改渲染
  } catch (error) {
    console.error('提交失敗:', error)
    alert('提交失敗，請重試！')
  }
}

const submitRewirte = async () => {
  const ask = await Swal.fire({
    title: '確定修改？',
    icon: 'warning',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: '確認',
    cancelButtonText: '返回',
    reverseButtons: true,
  })

  if (!ask.isConfirmed) return

  try {
    await vendorApi.updateVendorReview(
      props.vendorId,
      rewriteReviewId.value,
      rating1.value,
      rating2.value,
      rating3.value,
      review.value.content,
      reviewPhotos.value,
      removeImageList.value
    )

    await Swal.fire({
      title: '修改成功',
      icon: 'success',
      confirmButtonText: '確定',
    })

    window.location.reload()
  } catch (error) {
    console.error('提交失敗:', error)
    alert('留言修改失敗，請重試！')
  }
}

const resetComment = async () => {
  const ask = await Swal.fire({
    title: '確定重置？',
    icon: 'warning',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: '確認',
    cancelButtonText: '返回',
    reverseButtons: true,
  })

  if (!ask.isConfirmed) return

  const res = await vendorApi.getVendorReview(props.vendorId, rewriteReviewId.value)
  review.value.content = res.review.reviewContent
  rating1.value = res.review.ratingEnvironment
  rating2.value = res.review.ratingPrice
  rating3.value = res.review.ratingService

  originReviewPhotoList.value = await vendorApi.getVendorReviewPhotos(props.vendorId, rewriteReviewId.value)

  removeImageList.value = []
  reviewPhotos.value = []
}

const closeModal = () => {
  review.value = ""
  reviewPhotos.value = []
  originReviewPhotoList.value = []
  removeImageList.value = []
  rating1.value = 0
  rating2.value = 0
  rating3.value = 0

  emit('close')
}

onMounted(async () => {
  console.log("欲修改之評論ID", props.updateReviewId)

  if (props.updateReviewId) {
    const res = await vendorApi.getVendorReview(props.vendorId, props.updateReviewId)
    review.value.content = res.review.reviewContent
    rating1.value = res.review.ratingEnvironment
    rating2.value = res.review.ratingPrice
    rating3.value = res.review.ratingService

    originReviewPhotoList.value = await vendorApi.getVendorReviewPhotos(props.vendorId, props.updateReviewId)
  }
})
</script>

<style scoped>
.popup-review {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;

  width: 500px;
  max-width: 90%;
}

.stars {
  display: flex;
  justify-content: center;
  font-size: 30px;
  cursor: pointer;
}

.star {
  color: gray;
  transition: color 0.2s;
}

.star.active {
  color: gold;
}

.star.hover {
  color: gold;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-container {
  position: relative;
}

.preview-img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}

.img-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: red;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 5px;
  border-radius: 4px;
}
</style>