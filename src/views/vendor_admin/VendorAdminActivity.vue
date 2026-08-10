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
    <button class="floating-button" @click="openAddEventModal">+</button>

    <table id="eventTable" class="table table-bordered table-hover text-center">
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
      <tbody></tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { activityAdminApi } from '@/api/vendor/activityAdminApi'
import axios from 'axios'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'
import DataTable from 'datatables.net-dt'
import 'datatables.net-dt/css/dataTables.dataTables.css'

const authStore = useAuthStore()
const userId = authStore.userId
const router = useRouter()
const imageCache = ref({})
const events = ref([])
const eventFilter = ref('all')
let dataTableInstance = null

const exportToExcel = async () => {
  try {
    const activities = await activityAdminApi.getTop5Activities();

    if (!activities || activities.length === 0) {
      Swal.fire({
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
  } catch (error) {
    console.error('匯出失敗', error)

    Swal.fire({
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
    const res = await activityAdminApi.getActivitiesByUserId(userId, token);
    events.value = res || []
    console.log('活動數據:', response.data)
    await loadEventImages()
  } catch (error) {
    console.error('獲取活動數據失敗', error)
    events.value = []
  }
}

// 获取活动图片
// API prefix is different
const loadEventImages = async () => {
  for (let event of events.value) {
    try {
      let response = await axios.get(`http://localhost:8080/photos/ids`, {
        params: {
          vendorActivityId: event.id
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      let imageIds = response.data
      if (imageIds.length > 0) {
        event.imageUrl = await getImageBlob(imageIds[0]) // 獲取圖片 Blob 並轉換
      } else {
        event.imageUrl = null
      }
    } catch (error) {
      console.error('獲取活動圖片失敗', error)
      event.imageUrl = null // 如果获取失败，设置为默认图片
    }
  }
}

// 使用 axios 獲取圖片的二進制數據，並轉換成 Blob URL
// API prefix is different
const getImageBlob = async (photoId) => {
  try {
    let response = await axios.get(`http://localhost:8080/photos/download`, {
      params: {
        vendorActivityId: photoId
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'blob'  // 設置返回的數據格式為 blob
    })

    // 創建一個 Blob URL
    return URL.createObjectURL(response.data)
  } catch (error) {
    console.error('圖片下載失敗', error)
    return 'https://via.placeholder.com/100' // 預設圖片
  }
}

// 過濾活動
const filteredEvents = computed(() => {
  console.log('過濾後的活動:', events.value)
  let currentDate = new Date()

  return (events.value || []).filter((event) => {
    let startTime = new Date(event.startTime)
    let endTime = new Date(event.endTime)

    // 确保 startTime 和 endTime 是有效的日期对象
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

// 获取活动图片的函数，避免重复请求
const getEventImageUrl = async (eventId) => {
  // 如果缓存中有图片，直接返回
  if (imageCache.value[eventId]) {
    return imageCache.value[eventId]
  }

  // 如果缓存没有，从服务器请求
  try {
    // 请求图片 ID 列表
    const response = await axios.get(`http://localhost:8080/photos/ids`, {
      params: {
        vendorActivityId: eventId
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    const imageIds = response.data
    const firstImageId = imageIds.length > 0 ? imageIds[0] : null

    if (firstImageId) {
      // 获取图片的 Blob 数据
      const imageUrl = await getImageBlob(firstImageId)
      imageCache.value[eventId] = imageUrl  // 缓存图片 URL（Blob URL）
      return imageUrl
    } else {
      // 如果没有图片，返回默认图片链接
      imageCache.value[eventId] = 'https://via.placeholder.com/100'
      return 'https://via.placeholder.com/100'
    }
  } catch (error) {
    console.error('獲取活動圖片失敗', error)
    return null
  }
}

// 日期格式化函數
const formatDate = (dateString) => {
  let date = new Date(dateString)
  return (
    date.toLocaleDateString('zh-TW') +
    ' ' +
    date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
  )
}

// 初始化 DataTable
const initDataTable = () => {
  if (dataTableInstance) dataTableInstance.destroy()

  dataTableInstance = new DataTable('#eventTable', {
    destroy: true,
    autoWidth: false,
    columnDefs: [{ targets: 4, type: 'string' }],
    language: {
      processing: '處理中...',
      lengthMenu: '顯示 _MENU_ 筆資料',
      zeroRecords: '沒有找到相關資料',
      info: '顯示第 _START_ 到 _END_ 筆資料，共 _TOTAL_ 筆',
      infoEmpty: '目前沒有資料',
      infoFiltered: '(從 _MAX_ 筆資料過濾)',
      search: '搜尋：',
      paginate: { first: '第一頁', last: '最後一頁', next: '下一頁', previous: '上一頁' },
      emptyTable: '目前表格內沒有資料',
      loadingRecords: '載入中...',
    },
    drawCallback: function () {
      console.log('DataTable 重新渲染，重新綁定按鈕事件')

      document.querySelectorAll('.view-detail-btn').forEach((el) => {
        el.addEventListener('click', (e) => {
          let activityId = e.target.getAttribute('data-id')
          console.log('查看詳情活動 ID:', activityId)
          if (activityId) {
            router.push({ name: 'VendorAdminActivityDetail', params: { id: activityId } })
          }
        })
      })

      document.querySelectorAll('.registration-btn').forEach((el) => {
        el.addEventListener('click', (e) => {
          let registrationId = e.target.getAttribute('data-id')
          console.log('查看活動報名 ID:', registrationId)
          if (registrationId) {
            router.push({ name: 'VendorAdminActivityRegistration', params: { id: registrationId } })
          }
        })
      })

      document.querySelectorAll('.delete-btn').forEach((el) => {
        el.addEventListener('click', async (e) => {
          e.stopPropagation();
          let activityId = e.target.getAttribute('data-id');

          // 使用 SweetAlert2 替代 confirm
          Swal.fire({
            title: '確定要刪除這個活動嗎？',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '確定',
            cancelButtonText: '取消',
          }).then(async (result) => {
            if (!result.isConfirmed) return;

            try {
              await deleteEvent(activityId);
              Swal.fire({
                icon: 'success',
                title: '活動刪除成功',
                confirmButtonText: '確認',
              });
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: '刪除失敗',
                text: '請稍後再試。',
                confirmButtonText: '確認',
              });
            }
          });
        });
      });
    },
  });
};

// 更新 DataTable
const updateDataTable = async () => {
  if (!dataTableInstance) return

  dataTableInstance.clear() // 清空表格

  let promises = filteredEvents.value
    .filter((event) => events.value.some((e) => e.id === event.id))
    .map(async (event) => {
      // 使用已加载的图片 URL
      let imageUrl = await getEventImageUrl(event.id) // 使用缓存获取图片 URL

      console.log(imageUrl)
      let registrationButton = event.isRegistrationRequired
        ? `<button class="btn btn-info btn-sm registration-btn" data-id="${event.id}">查看報名</button><br>`
        : ''
      return [
        `<img src="${imageUrl}" class="img-fluid rounded imgact" alt="活動圖片">`,
        `<a href="javascript:void(0);" class="event-name" data-id="${event.id}">${event.name}</a>`,
        `${formatDate(event.startTime)} - ${formatDate(event.endTime)}`,
        event.address,
        event.activityType.name,
        event.isRegistrationRequired ? '需報名' : '不需報名',
        event.activityPeopleNumber
          ? `${event.activityPeopleNumber.currentParticipants} / ${event.activityPeopleNumber.maxParticipants}`
          : '未設定',
        event.numberVisitor,
        `
          <button class="btn btn-info btn-sm view-detail-btn" data-id="${event.id}">查看詳情</button><br>
          ${registrationButton}
          <button class="btn btn-danger btn-sm delete-btn" data-id="${event.id}">刪除</button>`,
      ]
    })

  // 等待所有的 promises 完成
  let rows = await Promise.all(promises)
  rows.forEach((row) => {
    if (row) {
      dataTableInstance.row.add(row) // 添加每一行
    }
  })

  await nextTick() // 确保 Vue 完成 DOM 更新
  dataTableInstance.draw() // 刷新 DataTable
}

// 刪除活動
const deleteEvent = async (activityId) => {
  try {
    await axios.delete(`http://localhost:8080/${activityId}`)
    events.value = events.value.filter((event) => event.id !== activityId)

    // 更新 DataTable
    fetchEvents()
    initDataTable()
  } catch (error) {
    console.error('刪除活動失敗', error)
  }
}

// 監聽篩選變化並更新表格
watch(filteredEvents, () => {
  updateDataTable()
})

// 當組件載入時，獲取活動並初始化 DataTables
onMounted(async () => {
  await fetchEvents()

  initDataTable()
  updateDataTable()
})

// ➕ 打開新增活動頁面
const openAddEventModal = () => {
  window.location.href = '/vendor/admin/activity/add'
}
</script>

<style scoped>
/* 表格容器 */
.container {
  width: 70%;
  max-width: 1800px;
  margin: auto;
  overflow-x: auto;
  /* 防止超出畫面 */
}

th {
  background-color: #f4d8b1 !important;
}

/* 確保 DataTable 內容不會跑掉 */
.dataTables_wrapper {
  width: 100%;
  display: block;
}

.form-select {
  width: 150px;
}

td.dt-type-numeric {
  text-align: center !important;
  /* 讓所有數字欄位也置中 */
}

th.dt-type-numeric {
  text-align: center !important;
  /* 讓所有數字欄位也置中 */
}

thead th {
  text-align: center !important;
  vertical-align: middle !important;
}

th {
  white-space: nowrap;
  /* 防止標題換行 */
  padding: 10px 20px;
  white-space: nowrap;
  /* 增加內距 */
}

/* 表格樣式 */
#eventTable {
  width: 100%;
  table-layout: fixed;
  /* 讓欄位寬度平均 */
  border-collapse: collapse;
}

/* 設定表頭與內容 */
#eventTable th,
#eventTable td {
  font-size: 16px;
  /* 讓字體稍微大一點 */
  padding: 8px 12px;
  white-space: nowrap;
  /* 防止換行 */
  text-align: center;
}

/* 限制圖片大小 */
.imgact {
  width: 100px !important;
  height: 100px !important;
  object-fit: cover;
  border-radius: 5px;
}

/* 固定 + 按鈕 */
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
  /* 確保按鈕在最上層 */
}

/* td.pending { */
/* 	color: red; */
/* } */

/* td.approved { */
/* 	color: green; */
/* } */
.btn-sm {
  width: 50px;
}
</style>
