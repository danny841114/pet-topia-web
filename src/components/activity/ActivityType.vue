<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="popup">
      <h3>
        <b v-if="typeActivityList.length !== 0">
          同類別活動：
          <span style="color: red">{{ typeActivityList[0].activityType?.name }}</span>
        </b>
        <b v-else>同類別活動</b>
      </h3>
      <div class="scroll-container" v-if="typeActivityList.length !== 0">
        <div v-for="(activity, index) in typeActivityList" :key="index" style="font-size: 24px">
          <!-- 圖片抓法要改 -->
          <!-- <img
            :src="activity.logoImgBase64"
            class="img-fluid rounded-4"
            alt="image"
            style="max-width: 30px; max-height: 30px; margin: 10px"
          /> -->
          <RouterLink :to="`/activity/detail/${activity.id}`">{{ activity.name }}</RouterLink>
        </div>
      </div>
      <div v-else style="color: gray; margin: 50px">目前沒有其他同類別活動～</div>

      <button class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" style="margin: 5px"
        @click="emit('close')">
        關閉
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { activityApi } from '@/api/vendor/activityApi'

const props = defineProps({
  activityId: Number,
  typeId: Number
})
const emit = defineEmits(['close'])
const typeActivityList = ref([])

const getSameTypeActivities = async () => {
  try {
    typeActivityList.value = await activityApi.getOtherActivitiesByType(props.activityId, props.typeId)
  } catch (error) {
    console.error("Failed to get same type activities: ", error)
  }
}

onMounted(getSameTypeActivities)
</script>

<style scoped>
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

.popup {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;

  width: 500px;
  max-width: 90%;
}
</style>