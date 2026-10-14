<template>
  <div class="container">
    <div class="d-flex align-items-center gap-2">
      <select v-model="eventFilter" class="form-select w-auto">
        <option value="all">顯示全部</option>
        <option value="ongoing">顯示進行中</option>
        <option value="ended">顯示已結束</option>
      </select>
      <button class="btn btn-info" @click="exportToExcel">產生熱門活動報表</button>
    </div>
    <RouterLink to="/vendor/admin/activity/add" class="floating-button text-decoration-none text-white">+</RouterLink>

    <table class="table table-bordered table-hover text-center">
      <thead class="table-primary">
        <tr>
          <th>活動首圖</th>
          <th>活動名稱</th>
          <th>活動時間</th>
          <th>地點</th>
          <th>活動類型</th>
          <th>是否需要報名</th>
          <th>報名成功數/最大人數</th>
          <th>瀏覽數</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="event in filteredEvents" :key="event.id">
          <!-- 活動圖片 -->
          <td>
            <img :src="event.imageUrl || 'https://via.placeholder.com/100'" class="img-fluid rounded imgact" alt="活動圖片">
          </td>
          <!-- 活動名稱 -->
          <td>
            {{ event.name }}
          </td>
          <!-- 活動時間 -->
          <td>
            {{ formatDate(event.startTime) }}<br>{{ formatDate(event.endTime) }}
          </td>
          <!-- 地點 -->
          <td>{{ event.address }}</td>
          <!-- 活動類型 -->
          <td>{{ event.activityType?.name }}</td>
          <!-- 是否需要報名 -->
          <td>{{ event.registrationRequired ? '需報名' : '不需報名' }}</td>
          <!-- 報名人數 -->
          <td>
            <span v-if="event.registrationRequired"> {{ event.activityPeopleNumber ?
              `${event.activityPeopleNumber.currentParticipants} /
              ${event.activityPeopleNumber.maxParticipants}` : '未設定' }}</span>
            <span v-else>N/A</span>
          </td>
          <td>{{ event.numberVisitor }}</td>
          <td>
            <button class="btn btn-info btn-sm mb-1" @click="viewDetail(event.id)">查看詳情</button><br>
            <div v-if="event.registrationRequired">
              <button class="btn btn-info btn-sm mb-1" @click="viewRegistration(event.id)">查看報名</button><br>
            </div>
            <button class="btn btn-danger btn-sm" @click="deleteEvent(event.id)">刪除</button>
          </td>
        </tr>
        <tr v-if="filteredEvents.length === 0">
          <td colspan="9" class="text-center">目前沒有資料</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { vendorAdminApi } from '@/api/vendor/vendorAdminApi'
import { dateUtil } from '@/utils/dateUtil'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'

const router = useRouter()
const authStore = useAuthStore()
const userId = authStore.userId
const events = ref([])
const eventFilter = ref('all')

const formatDate = dateUtil.formatDateTime

const exportToExcel = async () => {
  try {
    const activities = await vendorAdminApi.getTop5Activities();

    if (!activities || activities.length === 0) {
      await Swal.fire({
        icon: 'info',
        title: '沒有活動數據可匯出',
        text: '請確認目前有活動資料',
        confirmButtonText: '確定'
      })

      return
    }

    // 修改資料的 keys 為中文標題
    const modifiedActivities = activities.map(activity => ({
      活動名稱: activity.activityName,
      活動內容: activity.description,
      報名人數: activity.registrationCount
    }))

    // 轉換為 SheetJS 格式
    const ws = XLSX.utils.json_to_sheet(modifiedActivities)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '熱門活動報表')

    // 下載 Excel
    XLSX.writeFile(wb, '熱門活動報表.xlsx')
  } catch (e) {
    console.error('匯出失敗', e)

    await Swal.fire({
      icon: 'error',
      title: '匯出失敗',
      text: '請檢查 API 是否正常',
      confirmButtonText: '我知道了'
    })
  }
}

// 獲取活動列表
const fetchEvents = async () => {
  try {
    const token = localStorage.getItem('token');
    events.value = await vendorAdminApi.getActivitiesByUserId(userId, token);
    await loadEventImages()
  } catch (e) {
    console.error('獲取活動數據失敗', e)
  }
}

// API prefix is different
const loadEventImages = async () => {
  for (let event of events.value) {
    try {
      const token = localStorage.getItem('token')
      const imageIds = await vendorAdminApi.getActivityPhotos(event.id, token)

      if (imageIds.length > 0) {
        event.imageUrl = await getImageBlob(imageIds[0]) // 獲取圖片 Blob 並轉換
      } else {
        event.imageUrl = null
      }
    } catch (e) {
      console.error('獲取活動圖片失敗', e)
      event.imageUrl = null // 如果获取失败，设置为默认图片
    }
  }
}

// API prefix is different
const getImageBlob = async (photoId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await vendorAdminApi.getActivityPhotoById(photoId, token)
    return URL.createObjectURL(res)
  } catch (e) {
    console.error('圖片下載失敗', e)
    return 'https://via.placeholder.com/100' // 預設圖片
  }
}

// 過濾活動
const filteredEvents = computed(() => {
  let currentDate = new Date()

  return (events.value || []).filter((event) => {
    let startTime = new Date(event.startTime)
    let endTime = new Date(event.endTime)

    if (isNaN(startTime) || isNaN(endTime)) {
      return false
    }

    if (eventFilter.value === 'ongoing') {
      return startTime >= currentDate && endTime >= currentDate
    } else if (eventFilter.value === 'ended') {
      return endTime < currentDate
    }
    return true
  })
})

// 刪除活動
const deleteEvent = async (activityId) => {
  try {
    await vendorAdminApi.deleteActivity(activityId)
    events.value = events.value.filter((event) => event.id !== activityId)
  } catch (e) {
    console.error('刪除活動失敗', e)
  }
}

const viewDetail = (id) => {
  router.push({ name: 'VendorAdminActivityDetail', params: { id } })
}

const viewRegistration = (id) => {
  router.push({ name: 'VendorAdminActivityRegistration', params: { id } })
}

onMounted(async () => {
  await fetchEvents()
})
</script>

<style scoped>
/* 表格容器 */
.container {
  width: 70%;
  max-width: 1800px;
  margin: auto;
  overflow-x: auto;
}

.form-select {
  width: 150px;
}

/* 限制圖片大小 */
.imgact {
  width: 100px !important;
  height: 100px !important;
  object-fit: cover;
  border-radius: 5px;
}

/* 固定右下角位置之按鈕 */
.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 30px;
  text-align: center;
  line-height: 60px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 9999;
}

.btn-sm {
  width: 50px;
}
</style>
