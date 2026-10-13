<template>
  <!-- 主要內容開始 -->
  <div class="padding-medium mt-xl-5">
    <div class="container rounded-4" style="background-color: #f9f3ec; padding: 20px">
      <div class="row align-items-center mt-xl-5">
        <div class="h-auto offset-md-1 col-md-5">
          <div class="d-flex justify-content-center" v-if="activityImageList.length !== 0">
            <button class="swiper-button-prev custom-prev"></button>
            <Swiper :modules="[Pagination, Navigation]" :pagination="{
              clickable: true,
            }" :navigation="{
              nextEl: '.custom-next',
              prevEl: '.custom-prev',
            }">
              <SwiperSlide v-for="(image, index) in activityImageList" :key="index" class="thumbnail" width="400"
                @click="openImage(image.imageBase64)">
                <div style="display: flex; justify-content: center; align-items: center">
                  <img :src="image.imageBase64" class="img-fluid rounded-4" alt="image"
                    style="max-width: 500px; max-height: 300px; margin: 10px" />
                </div>
              </SwiperSlide>
            </Swiper>
            <button class="swiper-button-next custom-next"></button>
          </div>
          <div class="d-flex justify-content-center" v-else>
            <img :src="defaultAvatar" alt="活動圖片" class="img-fluid rounded-4" width="250" />
          </div>
        </div>

        <div class="col-md-5 mt-5 mt-md-0">
          <div class="mb-3">
            <h2 class="display-6 fw-semibold">{{ activity.name }}</h2>
          </div>
          <p>{{ activity.description }}</p>
          <p>
            分類：
            <span v-if="activity.activityType"><b style="color: red">{{ activity.activityType?.name }}</b><button
                class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" style="margin-left: 10px"
                @click="openSameType(activity.activityType?.id)">
                查看同型別活動
              </button></span>
            <span v-else style="color: gray">( 無分類 )</span>
          </p>

          <p>
            主辦店家：
            <span style="margin: 5px" v-if="activity.vendor?.logoImgBase64">
              <img :src="activity.vendor?.logoImgBase64" alt="店家圖片" class="img-fluid rounded-4" width="30" />
            </span>
            <RouterLink :to="`/vendor/detail/${activity.vendor?.id}`" v-if="activity.vendor?.name">
              <b>{{ activity.vendor?.name }}</b>
            </RouterLink>
            <RouterLink :to="`/vendor/detail/${activity.vendor?.id}`" v-else style="color: gray">
              <b>( 無店家名稱)</b>
            </RouterLink>
          </p>
          <p>
            開始時間：<b>{{ formatDate(activity.startTime) }}</b>
          </p>
          <p>
            結束時間：<b>{{ formatDate(activity.endTime) }}</b>
          </p>
          <p>
            地址：<b>{{ activity.address }}</b>
          </p>
          <p>需要報名：<b v-if="activity.registrationRequired">是</b><b v-else>否</b></p>

          <p v-if="activity.registrationRequired">
            報名人數：<b>{{ currentPeople }}</b><button :disabled="!isAvalible" style="margin-left: 10px"
              class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4" @click="registActivityConfirm">
              {{ registractionStatus }}
            </button>

            <button class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4" @click="openRegistrationConditon">
              報名狀態
            </button>
          </p>
          <p v-if="activity.registrationRequired">
            報名人數上限：<b>{{ maxPeople }}</b>
          </p>
          <p>
            瀏覽人數：<b>{{ activityForNumberOfVisitor.numberVisitor }}</b>
          </p>

          <div class="d-flex">
            <div class="d-flex flex-wrap mt-3">
              <button class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4" @click="toggleLike">
                {{ likeStatus }}
              </button>
              <button class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4" :disabled="isAddReviewDisabled"
                @click="openAdd">
                {{ addReviewButton }}
              </button>
              <button class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4" @click="openShare">
                分享
              </button>
            </div>
          </div>
          <br />
          <div @click="openMember" class="cursor-zoom">
            <b>查看誰收藏</b>
          </div>
          <br />
        </div>
      </div>
    </div>
  </div>
  <!-- 主要內容結束 -->

  <!-- 留言區開始 -->
  <div class="container" style="padding: 20px" v-if="reviewList.length !== 0">
    <div class="section-header d-md-flex justify-content-between align-items-center mb-3">
      <h2 class="display-6 fw-normal">留言區</h2>
    </div>

    <div v-for="review in reviewList" :key="review.reviewId">
      <div class="comment">
        <div class="container rounded-3" style="background-color: #f9f3ec; padding: 20px">
          <div class="row">
            <div class="col-lg-3">
              <div class="image-container" v-if="review.profilePhotoBase64">
                <img class="img-fluid rounded-4" :src="review.profilePhotoBase64" alt="alternative"
                  style="max-width: 200px; max-height: 200px" />
              </div>
              <div class="image-container" v-else>
                <img class="img-fluid rounded-4" :src="defaultAvatar" alt="alternative" style="max-width: 250px" />
              </div>
            </div>

            <div class="col-lg-9">
              <div class="text-container" style="padding-top: 20px">
                <h2>
                  <b v-if="review.name">{{ review.name }}</b>
                  <b v-else style="color: gray">( 無名稱 )</b>
                </h2>

                <p>發表時間：{{ formatDate(review.reviewTime) }}</p>

                <p>
                  留言內容：
                  <span v-if="review.reviewContent">{{ review.reviewContent }}</span>
                  <span style="color: gray" v-else>( 沒有內容 )</span>
                </p>

                <div class="d-flex flex-wrap mt-3" v-if="review.memberId == memberId">
                  <button class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 me-4"
                    @click="openRewirte(review.reviewId)">
                    修改
                  </button>

                  <button class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 me-4"
                    @click="deleteComment(review.reviewId)">
                    刪除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
  </div>
  <!-- 留言區結束 -->

  <!-- 活動列表 -->
  <div class="container mt-4">
    <h2 class="display-6 fw-normal">其他活動</h2>
    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">名稱</th>
          <th scope="col">類別</th>
          <th scope="col">主辦店家</th>
          <th scope="col">開始時間</th>
          <th scope="col">結束時間</th>
          <th scope="col">需要報名</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(activity, index) in activityList" :key="activity.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>
            <RouterLink :to="`/activity/detail/${activity.id}`">{{ activity.name }}</RouterLink>
          </td>
          <td>{{ activity.activityType?.name }}</td>
          <td>
            <RouterLink :to="`/vendor/detail/${activity.vendor?.id}`">
              <span v-if="activity.vendor?.name">{{ activity.vendor?.name }}</span>
              <span v-else style="color: #c0c0c0">無店家名稱</span>
            </RouterLink>
          </td>
          <td>{{ formatDate(activity.startTime) }}</td>
          <td>{{ formatDate(activity.endTime) }}</td>
          <td style="text-align: center">
            <span v-if="activity.registrationRequired" style="color: red">是</span>
            <span v-else>否</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- 活動列表 -->


  <!-- 報名狀態 -->
  <ActivityRegistration v-if="isPopupConditionVisible" :activity-id="props.activityId"
    @close="closeRegistrationConditon">
  </ActivityRegistration>

  <!-- 評論留言 -->
  <ActivityReview v-if="isPopupCommentVisible" :activity-id="props.activityId" :update-review-id="targetReviewId"
    :add="isAddComment" :update="isUpdateComment" @close="closeComment" @refresh="fetchReviews"></ActivityReview>

  <!-- 同類別店家 -->
  <ActivityType v-if="isPopupTypeVisible" :activity-id="props.activityId" :type-id="specifiedTypeId"
    @close="closeSameType">
  </ActivityType>

  <!-- 收藏名單 -->
  <ActivityLike v-if="isPopupMemberVisible" :activity-id="props.activityId" @click="closeMember"></ActivityLike>

  <!-- 圖片放大 -->
  <BigPicture v-if="isImageOpen" @click="closeImage"></BigPicture>

  <!-- 活動分享 -->
  <ActitvyShare v-if="isPopupShareVisible" @close="closeShare"></ActitvyShare>
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { ref, onMounted, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation } from 'swiper/modules'
import { useAuthStore } from '@/stores/auth'
import { activityApi } from '@/api/vendor/activityApi'
import { listUtil } from '@/utils/listUtil'
import { dateUtil } from '@/utils/dateUtil'
import BigPicture from '@/components/BigPicture.vue'
import ActivityLike from '@/components/activity/ActivityLike.vue'
import ActivityRegistration from '@/components/activity/ActivityRegistration.vue'
import ActivityReview from '@/components/activity/ActivityReview.vue'
import ActitvyShare from '@/components/activity/ActivityShare.vue'
import ActivityType from '@/components/activity/ActivityType.vue'
import Swal from 'sweetalert2'

const authStore = useAuthStore()
const formatDate = dateUtil.formatDateTime
const memberId = authStore.memberId
const props = defineProps({
  activityId: Number,
})
const activity = ref({})
const activityImageList = ref([])
const reviewList = ref([])
const activityList = ref([])
const activityForNumberOfVisitor = ref({})
const currentPeople = ref()
const maxPeople = ref()
const addReviewButton = ref('留言')
const isAddReviewDisabled = ref(false)
const imageSrc = ref()
const isImageOpen = ref(false)
const registractionStatus = ref()
const isAvalible = ref(true)
const isPopupConditionVisible = ref(false)
const pendingList = ref([])
const confirmedList = ref([])
const likeStatus = ref('收藏')
const isPopupCommentVisible = ref(false)
const isPopupMemberVisible = ref(false)
const isPopupTypeVisible = ref(false)
const isPopupShareVisible = ref(false)
const specifiedTypeId = ref()
const isAddComment = ref(false)
const isUpdateComment = ref(false)
const targetReviewId = ref()
const defaultAvatar = "/user_static/images/tool/no-photo.png"

/* 2. 活動資料 */
const fetchActivityData = async () => {
  try {
    activity.value = await activityApi.getActivity(props.activityId)
  } catch (error) {
    console.error('獲取活動資料失敗:', error)
  }
}

/* 3. 活動圖片列表 */
const fetchActivityImages = async () => {
  try {
    activityImageList.value = await activityApi.getActivityPhotos(props.activityId);
  } catch (error) {
    console.error('獲取活動圖片列表失敗:', error)
  }
}

/* 4. 留言區 */
const fetchReviews = async () => {
  try {
    reviewList.value = await activityApi.getActivityReviews(props.activityId);
  } catch (error) {
    console.error('獲取活動留言清單失敗:', error)
  }
}

/* 5. 其他活動列表 */
const fetchActivities = async () => {
  try {
    const data = await activityApi.getOtherActivities(props.activityId);
    activityList.value = listUtil.shuffleList(data)
  } catch (error) {
    console.error('獲取店家清單失敗:', error)
  }
}

/* 6. 瀏覽人數 */
const getViewCount = async () => {
  try {
    activityForNumberOfVisitor.value = await activityApi.getViewCount(props.activityId)
  } catch {
    console.error('獲取瀏覽人數失敗:', error)
  }
}

/* 7. 報名人數 */
const getParticipantCount = async () => {
  try {
    const data = await activityApi.getParticipantCount(props.activityId)
    currentPeople.value = data.currentParticipants
    maxPeople.value = data.maxParticipants
  } catch {
    console.error('獲取報名人數失敗:', error)
  }
}

/* 8. 是否能留言*/
const isReviewExisting = async () => {
  let result = await activityApi.isReviewExisting(props.activityId, memberId);

  if (result.action) {
    addReviewButton.value = '已留言'
    isAddReviewDisabled.value = true
  } else {
    addReviewButton.value = '留言'
    isAddReviewDisabled.value = false
  }
}

/* 10. 圖片放大 */
const openImage = (image) => {
  isImageOpen.value = true
  imageSrc.value = image
  document.body.style.overflow = 'hidden'
}

const closeImage = () => {
  isImageOpen.value = false
  document.body.style.overflow = ''
}

/* 11. 活動報名 */
const isActivityAvalible = async () => {
  // 判斷人數是否達上限，達到上限true，未達上限true
  const res = await activityApi.isActivityAvalible(props.activityId)
  isAvalible.value = res

  // 判斷報名狀態
  const isRegistered = await activityApi.isActivityRegistered(props.activityId, memberId)

  // 報名達上限還可以取消報名
  if (res == false && isRegistered.action == true) {
    isAvalible.value = true
  }
}

const getRegistractionStatus = async () => {
  let result = await activityApi.isActivityRegistered(props.activityId, memberId)

  if (result.action) {
    registractionStatus.value = '已報名'
  } else {
    registractionStatus.value = '報名'
  }
}

const registActivityConfirm = async () => {
  if (memberId == null) {
    await Swal.fire({
      title: '無法報名',
      text: '請先登入再執行',
      icon: 'error',
      confirmButtonText: '確定',
    })

    return
  }

  let regisitrationStatus = await activityApi.isActivityRegistered(props.activityId, memberId)

  if (regisitrationStatus.action) {
    const result = await Swal.fire({
      title: '取消報名？',
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonText: '返回',
      confirmButtonText: '確認',
      reverseButtons: true,
    })

    if (result.isConfirmed) toggleRegistration()
  } else {
    const result = await Swal.fire({
      title: '執行報名？',
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonText: '返回',
      confirmButtonText: '確認',
      reverseButtons: true,
    })

    if (result.isConfirmed) toggleRegistration()
  }
}

const toggleRegistration = async () => {
  let regisitrationStatus = await activityApi.toggleRegistration(props.activityId, memberId)

  if (!isActivityAvalible.value) {
    isActivityAvalible.value = true
  }

  if (regisitrationStatus.action) {
    currentPeople.value += 1
    Swal.fire({
      title: '報名成功',
      icon: 'success',
      confirmButtonText: '確定',
    })

    registractionStatus.value = '已報名'
  } else {
    currentPeople.value -= 1
    Swal.fire({
      title: '報名取消',
      icon: 'success',
      confirmButtonText: '確定',
    })

    registractionStatus.value = '報名'
  }
}

/* 12. 報名狀況 */
watch(isPopupConditionVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden' // 禁止滾動
  } else {
    document.body.style.overflow = '' // 恢復滾動
  }
})

const openRegistrationConditon = async () => {
  isPopupConditionVisible.value = true
  pendingList.value = await activityApi.getPendingMembers(props.activityId)
  confirmedList.value = await activityApi.getConfirmedMembers(props.activityId)
}

const closeRegistrationConditon = () => {
  isPopupConditionVisible.value = false
}

/* 13. 切換收藏 */
const getLikeStatus = async () => {
  let result = await activityApi.isLikeExisting(props.activityId, memberId)

  if (result.action) {
    likeStatus.value = '已收藏'
  } else {
    likeStatus.value = '收藏'
  }
}

const toggleLike = async () => {
  if (memberId == null) {
    await Swal.fire({
      title: '無法收藏',
      text: '請先登入再執行',
      icon: 'error',
      confirmButtonText: '確定',
    })

    return
  }

  const result = await activityApi.toggleLike(props.activityId, memberId)

  if (result.action) {
    Swal.fire({
      title: '成功收藏',
      icon: 'success',
      confirmButtonText: '確定',
    })

    likeStatus.value = '已收藏'
  } else {
    Swal.fire({
      title: '取消收藏',
      icon: 'success',
      confirmButtonText: '確定',
    })

    likeStatus.value = '收藏'
  }
}

/* 14. 新增留言 */
watch(isPopupCommentVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden' // 禁止滾動
  } else {
    document.body.style.overflow = '' // 恢復滾動
  }
})

const openAdd = () => {
  if (memberId == null) {
    Swal.fire({
      title: '無法留言',
      text: '請先登入再執行',
      icon: 'error',
      confirmButtonText: '確定',
    })

    return
  }

  isAddComment.value = true
  isUpdateComment.value = false
  isPopupCommentVisible.value = true
}

const closeComment = () => {
  isPopupCommentVisible.value = false
  isAddComment.value = false
  isUpdateComment.value = false
}

/* 15. 修改留言 */
const openRewirte = async (reviewId) => {
  isUpdateComment.value = true
  isAddComment.value = false
  targetReviewId.value = reviewId
  isPopupCommentVisible.value = true
}

/* 16. 刪除留言 */
const deleteComment = async (reviewId) => {
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
    await activityApi.deleteReview(props.activityId, reviewId)

    Swal.fire({
      title: '成功刪除',
      icon: 'success',
      confirmButtonText: '關閉',
    })

    reviewList.value = reviewList.value.filter(
      (review) => review.reviewId !== reviewId // 過濾reviewId等於reviewId的留言
    )

    addReviewButton.value = '留言'
    isAddReviewDisabled.value = false
  } catch (error) {
    console.error('刪除留言失敗:', error)
  }
}

/* 17. 收藏之會員視窗 */
watch(isPopupMemberVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden' // 禁止滾動
  } else {
    document.body.style.overflow = '' // 恢復滾動
  }
})

const openMember = async () => {
  isPopupMemberVisible.value = true
}

const closeMember = () => {
  isPopupMemberVisible.value = false
}

/* 18. 同類別活動視窗 */
watch(isPopupTypeVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden' // 禁止滾動
  } else {
    document.body.style.overflow = '' // 恢復滾動
  }
})

const openSameType = (typeId) => {
  specifiedTypeId.value = typeId
  isPopupTypeVisible.value = true
}

const closeSameType = () => {
  isPopupTypeVisible.value = false
}

/* 19. 分享視窗 */
const openShare = () => {
  isPopupShareVisible.value = true
}

const closeShare = () => {
  isPopupShareVisible.value = false
}

onMounted(async () => {
  console.log('活動ID:', props.activityId)
  await fetchActivityData()
  fetchActivityImages()
  fetchReviews()
  fetchActivities()
  getViewCount()
  getParticipantCount()
  isReviewExisting()
  isActivityAvalible()
  getRegistractionStatus()
  getLikeStatus()
})
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

  z-index: 10;
}

/* 彈出框樣式 */
.popup {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;

  width: 500px;
  max-width: 90%;
}

/* 圖片自訂按鈕樣式 */
.custom-prev,
.custom-next {
  position: relative;
  transform: translateY(0%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  width: 50px;
  height: 200px;
  cursor: pointer;
  z-index: 10;
}

.custom-prev {
  left: -5px;
}

.custom-next {
  left: 5px;
}

.custom-prev:hover,
.custom-next:hover {
  background: rgba(0, 0, 0, 0.8);
}

.thumbnail {
  width: 200px;
  cursor: zoom-in;
}

.cursor-zoom {
  cursor: zoom-in;
}
</style>
