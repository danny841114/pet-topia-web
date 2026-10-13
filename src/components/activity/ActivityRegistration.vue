<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="popup">
      <h3><b>報名狀況</b></h3>

      <div class="scroll-container">
        <div v-if="confirmedList.length !== 0">
          <h5><b>核准名單</b></h5>
          <div v-for="(confirmed, index) in confirmedList" :key="index" style="font-size: 24px">
            <span v-if="confirmed.member?.profilePhotoBase64">
              <img :src="confirmed.member?.profilePhotoBase64" class="img-fluid rounded-4" alt="image"
                style="max-width: 30px; max-height: 30px; margin: 10px" />
            </span>
            <span v-else>
              <img :src="defaultAvatarUrl" class="img-fluid rounded-4" alt="image"
                style="max-width: 30px; max-height: 30px; margin: 10px" />
            </span>
            <span v-if="confirmed.member.name">{{ confirmed.member?.name }}</span>
            <span v-else style="color: gray">( 無名稱 )</span>
          </div>
        </div>

        <div v-if="pendingList.length !== 0">
          <h5><b>待核准名單</b></h5>
          <div v-for="(pending, index) in pendingList" :key="index" style="font-size: 24px">
            <span v-if="pending.member?.profilePhotoBase64"><img :src="pending.member?.profilePhotoBase64"
                class="img-fluid rounded-4" alt="image"
                style="max-width: 30px; max-height: 30px; margin: 10px" /></span>
            <span v-else><img :src="defaultAvatarUrl" class="img-fluid rounded-4" alt="image"
                style="max-width: 30px; max-height: 30px; margin: 10px" /></span>
            <span v-if="pending.member.name">{{ pending.member?.name }}</span>
            <span v-else style="color: gray">( 無名稱 )</span>
          </div>
        </div>

        <div v-if="confirmedList.length === 0 && pendingList.length === 0" style="color: gray; margin: 50px">
          目前沒有人報名
        </div>
      </div>

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

const confirmedList = ref([])
const pendingList = ref([])
const props = defineProps({
  activityId: Number,
})
const emit = defineEmits(['close'])
const defaultAvatarUrl = "/user_static/images/tool/no-photo.png"

const getRegisteredMembers = async () => {
  try {
    pendingList.value = await activityApi.getPendingMembers(props.activityId)
    confirmedList.value = await activityApi.getConfirmedMembers(props.activityId)
  } catch (error) {
    console.error("Get registered members failed: ", error)
  }
}

onMounted(getRegisteredMembers)
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