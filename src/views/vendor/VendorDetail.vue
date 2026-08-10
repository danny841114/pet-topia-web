<template>
  <!-- 主要內容開始 -->
  <div class="padding-medium mt-xl-5">
    <div class="container rounded-4" style="background-color: #f9f3ec; padding: 20px">
      <div class="row align-items-center mt-xl-5">
        <div class="h-auto offset-md-1 col-md-5" v-if="vendor.logoImgUrl">
          <img :src="`${apiBase}${vendor.logoImgUrl}`" alt="店家圖片" class="img-fluid rounded-4" width="400"
            @click="openImage(`${apiBase}${vendor.logoImgUrl}`)" />
        </div>
        <div class="h-auto offset-md-1 col-md-5" v-else>
          <img src="/user_static/images/tool/no-photo.png" alt="店家圖片" class="img-fluid rounded-4" width="300" />
        </div>

        <div class="col-md-5 mt-5 mt-md-0">
          <div class="mb-3">
            <h2 class="display-6 fw-semibold" v-if="vendor.name">{{ vendor.name }}</h2>
            <h2 class="display-6 fw-semibold" v-else style="color: gray">(無店家名稱)</h2>
          </div>
          <p>{{ vendor.description }}</p>
          <p>
            分類：
            <span v-if="vendor.categoryName"><b style="color: red">{{ vendor.categoryName }}</b><button
                class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" style="margin-left: 10px"
                @click="openCategory(vendor.categoryId)">
                查看同類別店家
              </button></span>
            <span v-else style="color: gray">( 無分類 )</span>
          </p>
          <p v-if="tagList.length != 0">
            標籤：
            <span v-for="(tag, index) in tagList" :key="index" class="border border-primary p-2 tag-item"
              style="margin-right: 15px; background-color: white">{{ tag.tag.tagName }}
            </span>
          </p>
          <p>
            地址：<b>{{ vendor.address }}</b>
          </p>
          <p>
            電話：<b>{{ vendor.phone }}</b>
          </p>
          <p>
            信箱：<b>{{ vendor.contactEmail }}</b>
          </p>
          <p>
            統編：<b>{{ vendor.taxidNumber }}</b>
          </p>
          <p>
            聯絡人：<b>{{ vendor.contactPerson }}</b>
          </p>
          <p>
            評分：<b><span style="color: #ffd300; font-size: 24px">⁥★</span> {{ avgRate.totalRating }}</b><button
              class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" style="margin-left: 10px"
              @click="openRate()">
              完整評分
            </button>
          </p>

          <div class="d-flex">
            <div class="d-flex flex-wrap mt-3">
              <button class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4" @click="toggleLike()">
                {{ likeStatus }}
              </button>
              <button class="btn btn-primary btn-lg text-uppercase fs-5 rounded-4 me-4" :disabled="isAddReviewDisabled"
                @click="openReview">
                {{ addReviewButton }}
              </button>
            </div>
          </div>
          <br />
          <div @click="openMember()" :style="{ cursor: cursorStyle }" @mouseover="cursorStyle = 'zoom-in'"
            @mouseleave="cursorStyle = 'default'">
            <b>查看誰收藏</b>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 主要內容結束 -->

  <!-- 活動列表開始 -->
  <div class="container mt-4">
    <h2 class="display-6 fw-normal">店家活動</h2>
    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">名稱</th>
          <th scope="col">類別</th>
          <th scope="col">詳情</th>
          <th scope="col">開始時間</th>
          <th scope="col">結束時間</th>
          <th scope="col">需要報名</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(activity, index) in activityList" :key="activity.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>
            <a :href="`/activity/detail/${activity.id}`">{{ activity.name }}</a>
          </td>
          <td>{{ activity.activityType.name }}</td>
          <td>{{ activity.description }}</td>
          <td>{{ formatDate(activity.startTime) }}</td>
          <td>{{ formatDate(activity.endTime) }}</td>
          <td style="text-align: center">
            <span v-if="activity.isRegistrationRequired" style="color: red">是</span>
            <span v-else>否</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- 活動列表結束 -->

  <!-- 圖片區開始 -->
  <div class="padding-medium mt-xl-5" style="padding: 20px" v-if="imageList.length != 0">
    <div class="container">
      <div class="section-header d-md-flex justify-content-between align-items-center mb-3">
        <h2 class="display-6 fw-normal">店家圖片列表</h2>
      </div>
    </div>

    <div class="container rounded-4" style="background-color: #f9f3ec; padding: 20px">
      <div class="container d-flex" style="text-align: center; position: relative">
        <button class="swiper-button-prev custom-prev"></button>
        <Swiper :modules="[Navigation]" :navigation="{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }" :slides-per-view="4" :space-between="300">
          <SwiperSlide v-for="(image, index) in imageList">
            <img :key="index" :src="`${apiBase}${image.imgUrl}`" class="img-fluid rounded-4" alt="image"
              style="max-width: 500px; max-height: 300px; margin: 10px"
              @click="openImage(`${apiBase}${image.imgUrl}`)" />
          </SwiperSlide>
        </Swiper>
        <button class="swiper-button-next custom-next"></button>
      </div>
    </div>
  </div>
  <!-- 圖片區結束 -->

  <!-- 留言區開始 -->
  <div class="container" style="padding: 20px" v-if="reviewList.length != 0">
    <div class="section-header d-md-flex justify-content-between align-items-center mb-3">
      <h2 class="display-6 fw-normal">留言區</h2>
    </div>

    <section v-for="review in reviewList" :key="review.reviewId">
      <div class="comment" :data-id="review.reviewId">
        <div class="container rounded-3" style="background-color: #f9f3ec; padding: 20px">
          <div class="row">
            <div class="col-lg-3">
              <div class="image-container" v-if="review.member?.photoUrl">
                <img class="img-fluid rounded-4" :src="`${apiBase}${review.member.photoUrl}`" alt="alternative"
                  style="max-width: 200px; max-height: 200px" />
              </div>
              <div class="image-container" v-else>
                <img src="/user_static/images/tool/no-photo.png" alt="店家圖片" class="img-fluid rounded-4" width="250" />
              </div>
            </div>

            <div class="col-lg-9">
              <div class="text-container" style="padding-top: 20px">
                <h2>
                  <b v-if="review.member?.name">{{ review.member.name }}</b>
                  <b v-else style="color: gray">( 無名稱 )</b>
                </h2>

                <p>
                  環境評分：
                  <span v-for="i in review.ratingEnv" :key="'env-gold-' + i" style="color: gold">★
                  </span>
                  <span v-for="i in 5 - (review.ratingEnv || 0)" :key="'env-gray-' + i" style="color: gray">★
                  </span>
                </p>

                <p>
                  價格評分：
                  <span v-for="i in review.ratingPrice" :key="'price-gold-' + i" style="color: gold">★
                  </span>
                  <span v-for="i in 5 - (review.ratingPrice || 0)" :key="'price-gray-' + i" style="color: gray">★
                  </span>
                </p>

                <p>
                  服務評分：
                  <span v-for="i in review.ratingService" :key="'service-gold-' + i" style="color: gold">★
                  </span>
                  <span v-for="i in 5 - (review.ratingService || 0)" :key="'service-gray-' + i" style="color: gray">★
                  </span>
                </p>

                <p>發表時間：{{ formatDate(review.time) }}</p>

                <p>
                  留言內容：
                  <span v-if="review.content">{{ review.content }}</span>
                  <span style="color: gray" v-else>( 沒有內容 )</span>
                </p>

                <!-- 評論之圖片 -->
                <div>
                  留言圖片：
                  <span>
                    <span v-if="review.photoUrls?.length == 0" style="color: gray">( 沒有圖片 )</span>
                    <span v-else style="display: flex; flex-wrap: wrap">
                      <img v-for="(photo, index) in review.photoUrls" :key="index" :src="`${apiBase}${photo}`"
                        class="img-fluid rounded-4" alt="image"
                        style="max-width: 150px; max-height: 150px; margin: 10px"
                        @click="openImage(`${apiBase}${photo}`)" />
                    </span>
                  </span>
                </div>
                <!-- 評論之圖片 -->

                <div class="d-flex flex-wrap mt-3" v-if="review.member?.id == memberId">
                  <button class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 me-4"
                    @click="openRewrite(review.id)">
                    修改
                  </button>

                  <button class="btn btn-outline-dark btn-lg text-uppercase fs-5 rounded-4 me-4"
                    @click="deleteComment(review.id)">
                    刪除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </section>
  </div>
  <!-- 留言區結束 -->

  <!-- 店家列表 -->
  <section id="clothing" class="my-5 overflow-hidden">
    <div class="container pb-5">
      <div class="section-header d-md-flex justify-content-between align-items-center mb-3">
        <h2 class="display-6 fw-normal">其他店家</h2>
      </div>

      <div class="row">
        <div class="item bird col-md-4 col-lg-3 my-4" v-for="vendorEach in vendorList" :key="vendorEach.id">
          <div class="card position-relative">
            <a :href="`/vendor/detail/${vendorEach.id}`">
              <img :src="`${apiBase}${vendorEach.logoImgUrl}`" class="img-fluid rounded-4" alt="image"
                style="max-width: 200px; max-height: 200px"
                onerror="this.src='/user_static/images/tool/no-photo.png';" /></a>
            <div class="card-body p-0">
              <a :href="`/vendor/detail/${vendorEach.id}`" v-if="vendorEach.name">
                <h2 class="card-title pt-4 m-0">{{ vendorEach.name }}</h2>
              </a>
              <a :href="`/vendor/detail/${vendorEach.id}`" v-else>
                <h2 class="card-title pt-4 m-0" style="color: #d3d3d3">無店家名稱</h2>
              </a>

              <div class="card-text">
                <span class="rating secondary-font">{{ vendorEach.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- 店家列表 -->

  <!-- 留言視窗 -->
  <div v-if="isPopupReviewVisible" class="overlay">
    <div class="popup-review">
      <h3><b v-if="commentButton">新增評論</b></h3>
      <h3><b v-if="rewriteButton">修改評論</b></h3>
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

        <button type="button" class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" @click="closeReview">
          取消
        </button>
        &emsp;
        <button v-if="rewriteButton" type="button" class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4"
          @click="resetComment()">
          重設
        </button>
        &emsp;
        <button v-if="commentButton" class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" type="submit">
          新增
        </button>
        <button v-if="rewriteButton" class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" type="submit">
          修改
        </button>
      </form>
    </div>
  </div>
  <!-- 留言視窗 -->

  <!-- 放大圖片視窗 -->
  <div v-if="isImageOpen" class="overlay" @click="closeImage">
    <img :src="imageSrc" alt="Large Image" class="large-image" @click.stop />
  </div>
  <!-- 放大圖片視窗 -->

  <!-- 收藏名單視窗 -->
  <div v-if="isPopupMemberVisible" class="overlay">
    <div class="popup">
      <h3><b>有誰收藏</b></h3>
      <div class="scroll-container" v-if="memberList.length != 0">
        <div v-for="(member, index) in memberList" :key="index" style="font-size: 24px">
          <img :src="member.profilePhotoBase64" class="img-fluid rounded-4" alt="image"
            style="max-width: 30px; max-height: 30px; margin: 10px"
            onerror="this.src='/user_static/images/tool/no-photo.png';" />

          <span v-if="member.name">{{ member.name }}</span>
          <span v-else style="color: gray">( 無名稱 )</span>
        </div>
      </div>
      <div v-else style="color: gray; margin: 50px">目前沒有人收藏唷～</div>
      <button class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" style="margin: 5px"
        @click="closeMember()">
        關閉
      </button>
    </div>
  </div>
  <!-- 收藏名單視窗 -->

  <!-- 同類別店家視窗 -->
  <div v-if="isPopupCategoryVisible" class="overlay">
    <div class="popup">
      <h3>
        <b v-if="categoryVendorList.length != 0">同類別店家：<span style="color: red">{{
          categoryVendorList[0].vendorCategory.name
            }}</span></b><b v-else>同類別店家</b>
      </h3>
      <div class="scroll-container" v-if="categoryVendorList.length != 0">
        <div v-for="(vendor, index) in categoryVendorList" :key="index" style="font-size: 24px">
          <img :src="vendor.logoImgBase64" class="img-fluid rounded-4" alt="image"
            style="max-width: 30px; max-height: 30px; margin: 10px"
            onerror="this.src='/user_static/images/tool/no-photo.png';" />
          <a :href="`/vendor/detail/${vendor.id}`">{{ vendor.name }}</a>
        </div>
      </div>
      <div v-else style="color: gray; margin: 50px">目前沒有其他同類別店家～</div>
      <button class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" style="margin: 5px"
        @click="closeCategory()">
        關閉
      </button>
    </div>
  </div>
  <!-- 同類別店家視窗 -->

  <!-- 檢視評分視窗 -->
  <div v-if="isRateVisible" class="overlay">
    <div class="popup">
      <h3>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">項目</th>
              <th scope="col">評分</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="color: red"><b>整體</b></td>
              <td style="color: red">{{ avgRate.totalRating }}</td>
            </tr>
            <tr>
              <td>環境</td>
              <td>{{ avgRate.avgRatingEnvironment }}</td>
            </tr>
            <tr>
              <td>價格</td>
              <td>{{ avgRate.avgRatingPrice }}</td>
            </tr>
            <tr>
              <td>服務</td>
              <td>{{ avgRate.avgRatingService }}</td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" @click="closeRate()">
          關閉
        </button>
      </h3>
    </div>
  </div>

  <!-- 檢視評分視窗 -->
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { vendorApi } from '@/api/vendor/vendorApi'
import { activityApi } from '@/api/vendor/activityApi'
import Swal from 'sweetalert2'

const apiBase = import.meta.env.VITE_API_URL
const props = defineProps({
  vendorId: Number,
})
const cursorStyle = ref('default')
const authStore = useAuthStore()
const memberId = authStore.memberId
const vendor = ref({});
const imageList = ref([])
const reviewList = ref([])
const vendorList = ref([])
const addReviewButton = ref('留言')
const likeStatus = ref('收藏')
const isAddReviewDisabled = ref(false)
const rating1 = ref(0)
const tempRating1 = ref(0)
const rating2 = ref(0)
const tempRating2 = ref(0)
const rating3 = ref(0)
const tempRating3 = ref(0)
const tagList = ref([])
const activityList = ref([])
const isPopupMemberVisible = ref(false)
const memberList = ref([])
const review = ref({})
const reviewPhotos = ref([])
const removeImageList = ref([])
const isPopupReviewVisible = ref(false)
const commentButton = ref(false)
const rewriteReviewId = ref(0) // 此全域變數為修改留言送出之使用
const rewriteButton = ref(false)
const originReviewPhotoList = ref([])
const imageSrc = ref()
const isImageOpen = ref(false)
const categoryVendorList = ref([])
const isPopupCategoryVisible = ref(false)
const isRateVisible = ref(false)
const avgRate = ref([])

/* 0. 隨機排列 */
const shuffleList = (array) => {
  return array.sort(() => Math.random() - 0.5)
}

/* 1. vendorId及預設游標 */


/* 2. 店家資料 */
const fetchVendorData = async () => {
  try {
    vendor.value = await vendorApi.getVendor(props.vendorId);
  } catch (error) {
    console.error('Get vendor data failed:', error)
  }
}
onMounted(() => fetchVendorData());

/* 3. 店家圖片列表 */
const fetchVendorImageList = async () => {
  try {
    imageList.value = await vendorApi.getVendorImages(props.vendorId)
  } catch (error) {
    console.error('獲取店家圖片列表失敗:', error)
  }
}

onMounted(() => fetchVendorImageList())

/* 4. 留言區 */
const fetchVendorReviewList = async () => {
  try {
    reviewList.value = await vendorApi.getVendorReviews(props.vendorId)
  } catch (error) {
    console.error('獲取店家評論清單失敗:', error)
  }
}
onMounted(() => fetchVendorReviewList())

/* 5. 其他店家列表 */
const fetchVendorList = async () => {
  try {
    const data = await vendorApi.getOtherVendors(props.vendorId)
    vendorList.value = shuffleList(data)
  } catch (error) {
    console.error('獲取店家清單失敗:', error)
  }
}
onMounted(() => fetchVendorList())

/* 6. 是否能留言*/
const getReviewIsExisied = async () => {
  let result = await vendorApi.isReviewExisting(props.vendorId, memberId)

  if (result.action) {
    addReviewButton.value = '已留言'
    isAddReviewDisabled.value = true
  } else {
    addReviewButton.value = '留言'
    isAddReviewDisabled.value = false
  }
}
onMounted(() => getReviewIsExisied());

/* 7. 星星評分 */
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

/* 8. 標籤 */
const getTag = async () => {
  tagList.value = await vendorApi.getVendorTags(props.vendorId)
}
onMounted(() => getTag())

/* 9. 時間轉換 */
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? '下午' : '上午'
  hours = hours % 12 || 12
  return `${year}年${month}月${day}日 ${period} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`
}

/* 10. 店家活動 */
const getActivities = async () => {
  activityList.value = await activityApi.getActivitiesByVendorId(props.vendorId)
}
onMounted(() => getActivities())

/* 11. 收藏視窗 */
const getLikeStatus = async () => {
  let result = await vendorApi.isLikeExisting(props.vendorId, memberId)
  likeStatus.value = result.action ? '已收藏' : '收藏'
}
onMounted(() => getLikeStatus())

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

  try {
    const likeData = await vendorApi.toggleLike(props.vendorId, memberId);

    if (likeData.action) {
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
  } catch (error) {
    console.error('切換收藏失敗:', error)

    Swal.fire({
      title: '操作失敗',
      icon: 'error',
      message: '操作失敗',
      confirmButtonText: '確定',
    })
  }
}

/* 12. 留言視窗 */
watch(isPopupReviewVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden' // 禁止滾動
  } else {
    document.body.style.overflow = '' // 恢復滾動
  }
})

const handleSubmit = () => {
  if (commentButton.value) {
    submitReviewFinal()
    console.log('執行新增')
  } else if (rewriteButton.value) {
    submitRewirte()
    console.log('執行修改')
  }
}

const openReview = async () => {
  if (memberId == null) {
    await Swal.fire({
      title: '無法留言',
      text: '請先登入再執行',
      icon: 'error',
      confirmButtonText: '確定',
    })
    return
  }
  isPopupReviewVisible.value = true
  commentButton.value = true
}

const closeReview = async () => {
  const ask = await Swal.fire({
    title: '確定取消？',
    icon: 'warning',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: '確認',
    cancelButtonText: '返回',
    reverseButtons: true,
  })
  if (!ask.isConfirmed) {
    return
  }
  isPopupReviewVisible.value = false
  removeImageList.value = []
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
  console.log(removeImageList.value)
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
    await vendorApi.addVendorReview(props.vendorId, memberId, rating1.value, rating2.value, rating3.value, review.value.content, reviewPhotos.value)

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

/* 13. 放大圖片視窗 */
const openImage = (imagUrl) => {
  isImageOpen.value = true
  imageSrc.value = imagUrl
  document.body.style.overflow = 'hidden'
}

const closeImage = () => {
  isImageOpen.value = false
  document.body.style.overflow = ''
}

/* 14. 留言改寫視窗 */
const openRewrite = async (reviewId) => {
  isPopupReviewVisible.value = true
  rewriteButton.value = true
  rewriteReviewId.value = reviewId

  // 把內容及評分寫入一個全域變數
  const res = await vendorApi.getVendorReview(props.vendorId, reviewId)
  review.value.content = res.review.reviewContent
  rating1.value = res.review.ratingEnvironment
  rating2.value = res.review.ratingPrice
  rating3.value = res.review.ratingService

  originReviewPhotoList.value = await vendorApi.getVendorReviewPhotos(props.vendorId, reviewId)
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
    await vendorApi.updateVendorReview(props.vendorId, rewriteReviewId.value, rating1.value, rating2.value, rating3.value, review.value.content, reviewPhotos.value, removeImageList.value)

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

/* 14. 留言刪除 */
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
    await vendorApi.deleteVendorReview(props.vendorId, reviewId);

    await Swal.fire({
      title: '成功刪除',
      icon: 'success',
      confirmButtonText: '關閉',
    })

    reviewList.value = reviewList.value.filter(
      (review) => review.id !== reviewId,
    )

    addReviewButton.value = '留言'
    isAddReviewDisabled.value = false
  } catch (error) {
    console.error('提交失敗:', error)
    alert('留言刪除失敗！')
  }
}

/* 15. 重置留言 */
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

/* 16. 收藏之會員視窗 */
watch(isPopupMemberVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden' // 禁止滾動
  } else {
    document.body.style.overflow = '' // 恢復滾動
  }
})

const openMember = async () => {
  isPopupMemberVisible.value = true

  try {
    memberList.value = await vendorApi.getVendorLikes(props.vendorId)
  } catch (error) {
    console.error('讀取會員失敗:', error)
  }
}

const closeMember = () => {
  isPopupMemberVisible.value = false
}

/* 17. 同類別店家視窗 */
watch(isPopupCategoryVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden' // 禁止滾動
  } else {
    document.body.style.overflow = '' // 恢復滾動
  }
})

const openCategory = async (categoryId) => {
  isPopupCategoryVisible.value = true

  try {
    categoryVendorList.value = await vendorApi.getOtherVendorsByCategorty(props.vendorId, categoryId);
  } catch (error) {
    console.error('讀取同類別店家失敗:', error)
  }
}

const closeCategory = () => {
  isPopupCategoryVisible.value = false
}

/* 18. 評分檢視視窗 */
watch(isRateVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden' // 禁止滾動
  } else {
    document.body.style.overflow = '' // 恢復滾動
  }
})

const fetchAvgRate = async () => {
  try {
    avgRate.value = await vendorApi.getVendorAvgRating(props.vendorId)
  } catch (error) {
    console.error('讀取評分失敗:', error)
  }
}
onMounted(() => fetchAvgRate())

const openRate = () => {
  isRateVisible.value = true
}

const closeRate = () => {
  isRateVisible.value = false
}

/* 19. 取得店家座標 */
// const coordinate = ref({})
// const fetchCoordinate = async () => {
//   try {
//     const response = await fetch(`${apiBase}/api/vendor/${props.vendorId}/coordinate`, {
//       method: 'GET',
//     })
//     let result = await response.json()
//     coordinate.value = result

//     // 確保經緯度是數字，避免 API 回傳的是字串
//     coordinate.value = {
//       ...result,
//       latitude: parseFloat(result.latitude),
//       longitude: parseFloat(result.longitude),
//     }
//   } catch (error) {
//     console.error('讀取座標失敗:', error)
//   }
// }
// onMounted(() => {fetchCoordinate()})

/* 20. Google Maps */
// const loadGoogleMaps = () => {
//   const script = document.createElement('script')
//   script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAdtvNzj4RCUhcxxFuXDpvjXCglqPja6cI&callback=initMap&loading=async`
//   script.async = true
//   script.defer = true
//   document.head.appendChild(script)
// }

// const initMap = () => {
//   const map = new google.maps.Map(document.getElementById('map'), {
//     center: { lat: coordinate.value.latitude, lng: coordinate.value.longitude },
//     zoom: 15,
//   })

//   const marker = new google.maps.Marker({
//     position: { lat: coordinate.value.latitude, lng: coordinate.value.longitude },
//     map: map,
//     title: coordinate.value.name,
//     icon: {
//       url: coordinate.value.vendor.logoImgBase64,
//       scaledSize: new google.maps.Size(50, 50),
//       labelOrigin: new google.maps.Point(25, 60),
//     },
//     label: {
//       text: coordinate.value.name,
//       color: 'black',
//       fontSize: '16px',
//       fontWeight: 'bold',
//     },
//   })

//   const infoWindow = new google.maps.InfoWindow({
//     content: `<h3>${coordinate.value.name}</h3><p>${coordinate.value.address}</p>`,
//   })

//   marker.addListener('click', () => {
//     infoWindow.open(map, marker)
//   })
// }

// onMounted(async () => {
//   window.initMap = initMap // 將 initMap 註冊到全域對象，讓 Google Maps API 可以調用
//   await fetchCoordinate() // 確保先取得座標
//   loadGoogleMaps()
// })
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

  z-index: 1;
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

.popup-review {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;

  width: 500px;
  max-width: 90%;
}

/* 星星樣式 */
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

/* 列表視窗 */
.scroll-container {
  max-height: 240px;
  /* 設定最大高度，超過則產生滾動條 */
  overflow-y: auto;
  /* 當內容超過 max-height 時顯示垂直滾動條 */
  border: 1px solid #ccc;
  /* 可選，增加邊框以區分區塊 */
  padding: 10px;
  /* 可選，增加內邊距 */
}

/* 上傳圖片預覽 */
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

/* 圖片放大 */
.large-image {
  max-width: 90%;
  max-height: 90%;
}

/* 避免標籤換行 */
.tag-item {
  margin-right: 10px;
  background-color: white;
  white-space: nowrap;
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

.custom-prev:hover,
.custom-next:hover {
  background: rgba(0, 0, 0, 0.8);
}
</style>
