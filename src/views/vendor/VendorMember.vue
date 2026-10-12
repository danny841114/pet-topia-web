<template>
  <div class="profile-page">
    <div class="container-fluid py-4">
      <div class="page-container">
        <ProfileSidebar />
        <div class="main-container">
          <nav>
            <h1 class="mb-3">店家管理</h1>
            <button class="btn btn-primary" @click="switchLikePage()" style="margin-right: 20px">
              收藏
            </button>
            <button class="btn btn-primary" @click="switchReviewPage()">評論</button>
          </nav>

          <!-- 店家收藏 -->
          <div class="container mt-4" v-if="isLikeVisible">
            <h2 class="mb-3">店家收藏列表</h2>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>編號</th>
                  <th>店家名稱</th>
                  <th>店家類別</th>
                  <th>店家詳情</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(like, index) in likeList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <RouterLink :to="`/vendor/detail/${like.vendorId}`">
                      <span v-if="like.vendorName">{{ like.vendorName }}</span>
                      <span v-else style="color: #cfcfcf"> 無店家名稱 </span>
                    </RouterLink>
                  </td>
                  <td>{{ like.vendorCategory }}</td>
                  <td>{{ like.vendorDescription }}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="deleteLike(like.id)">刪除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 店家收藏 -->

          <!-- 店家評論 -->
          <div class="container mt-4" v-if="isReviewVisible">
            <h2 class="mb-3">店家評論列表</h2>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>編號</th>
                  <th>店家名稱</th>
                  <th>評論內容</th>
                  <th>環境評分</th>
                  <th>價錢評分</th>
                  <th>服務評分</th>
                  <th>評論圖片</th>
                  <th>評論時間</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(review, index) in reviewList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <RouterLink :to="`/vendor/detail/${review.vendor?.id}`">
                      <span v-if="review.vendor?.name">{{ review.vendor.name }}</span>
                      <span v-else style="color: #cfcfcf"> 無店家名稱 </span>
                    </RouterLink>
                  </td>
                  <td>{{ review.reviewContent }}</td>
                  <td>{{ review.ratingEnv }}</td>
                  <td>{{ review.ratingPrice }}</td>
                  <td>{{ review.ratingService }}</td>
                  <td>
                    <span class="hover-area" @click="openReviewPhoto(review.id)" v-if="review.photoUrls?.length">
                      {{ review.photoUrls?.length }}張
                    </span>
                    <span v-else>0張</span>
                  </td>
                  <td>{{ formatDate(review.time) }}</td>
                  <td>
                    <button class="btn btn-danger btn-sm"
                      @click="openReview(review.id, review.vendor?.id, review.vendor?.name)">
                      修改
                    </button>
                    <button class="btn btn-danger btn-sm" style="margin-left: 10px" @click="deleteReview(review.id)">
                      刪除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <!-- 店家評論 -->
        </div>
      </div>
    </div>
  </div>


  <!-- 留言修改視窗 -->
  <VendorReview v-if="isPopupReviewVisible" :vendor-id="reviewVendorId" :vendor-name="reviewVendorName"
    :update-reviewId="rewriteReviewId" :update="true" @close=closeReview @refresh="fetchVendorReviews">
  </VendorReview>

  <!-- 評論圖片視窗 -->
  <VendorReviewPhotos v-if="isPopupPhotoVisible" :vendor-id="reviewVendorId" :review-id="rewriteReviewId"
    @close="closePhoto"></VendorReviewPhotos>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { vendorApi } from '@/api/vendor/vendorApi'
import { dateUtil } from '@/utils/dateUtil'
import Swal from 'sweetalert2'
import ProfileSidebar from '@/components/ProfileSidebar.vue'
import VendorReview from '@/components/vendor/VendorReview.vue'
import VendorReviewPhotos from '@/components/vendor/VendorReviewPhotos.vue'

const authStore = useAuthStore()
const memberId = authStore.memberId
const formatDate = dateUtil.formatDateTime
const likeList = ref([])
const reviewList = ref([])
const isPopupReviewVisible = ref(false)
const rewriteReviewId = ref(null)
const isPopupPhotoVisible = ref(false)
const reviewVendorId = ref(null)
const reviewVendorName = ref(null)

/* 1. 獲取收藏列表 */
const fetchVendorLikes = async () => {
  try {
    likeList.value = await vendorApi.getVendorLikesByMemberId(memberId);
  } catch (error) {
    console.error('獲取收藏資料失敗:', error)
  }
}

/* 2. 獲取評論列表 */
const fetchVendorReviews = async () => {
  try {
    reviewList.value = await vendorApi.getVendorReviewsByMemberId(memberId)
  } catch (error) {
    console.error('獲取評論資料失敗:', error)
  }
}

/* 3. 取消收藏 */
const deleteLike = async (likeId) => {
  const ask = await Swal.fire({
    title: '確定取消？',
    icon: 'warning',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: '確認',
    cancelButtonText: '返回',
    reverseButtons: true,
  })

  if (!ask.isConfirmed) return

  try {
    await vendorApi.deleteLike(likeId);
    likeList.value = likeList.value.filter((like) => like.id !== likeId)
  } catch (error) {
    console.error('取消收藏失敗:', error)
  }
}

/* 4. 修改評論 */
const openReview = async (reviewId, vendorId, vendorName) => {
  isPopupReviewVisible.value = true
  reviewVendorId.value = vendorId
  reviewVendorName.value = vendorName
  rewriteReviewId.value = reviewId
}

const closeReview = async () => {
  isPopupReviewVisible.value = false
}

/* 5. 刪除評論 */
const deleteReview = async (reviewId) => {
  const ask = await Swal.fire({
    title: '確定刪除？',
    icon: 'warning',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: '確認',
    cancelButtonText: '返回',
    reverseButtons: true,
  })

  if (!ask.isConfirmed) return

  try {
    await vendorApi.deleteVendorReview(null, reviewId)
    reviewList.value = reviewList.value.filter((review) => review.id !== reviewId)
  } catch (error) {
    console.error('刪除評論失敗:', error)
  }
}

/* 7. 頁面切換按鈕 */
const isLikeVisible = ref(true)
const isReviewVisible = ref(false)

const switchLikePage = () => {
  isLikeVisible.value = true
  isReviewVisible.value = false
}

const switchReviewPage = () => {
  isLikeVisible.value = false
  isReviewVisible.value = true
}

/* 8. 開啟評論圖片 */
const openReviewPhoto = async (reviewId) => {
  rewriteReviewId.value = reviewId
  isPopupPhotoVisible.value = true
}

const closePhoto = () => {
  isPopupPhotoVisible.value = false
}

onMounted(() => {
  fetchVendorLikes()
  fetchVendorReviews()
})
</script>

<style scoped>
/* 限制表格最大寬度 */
.table-container {
  max-width: 800px;
  overflow-x: auto;
}

/* 頁面容器樣式 */
.profile-page {
  background: url('/user_static/images/background-img.png') no-repeat center center/cover;
  min-height: calc(100vh - 60px);
  width: 100%;
  margin: 0;
  padding: 0;
}

.container-fluid {
  width: 100%;
  max-width: 100%;
  padding: 0 2%;
}

.page-container {
  display: flex;
  width: 100%;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

/* 主內容區域樣式 */
.main-container {
  position: relative;
  flex: 1;
  min-width: 0;
  /* 防止flex子項溢出 */
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.hover-area {
  cursor: zoom-in;
}
</style>
