<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="popup">
      <h3><b>有誰收藏</b></h3>
      <div class="scroll-container" v-if="likeList.length !== 0">
        <div v-for="(member, index) in likeList" :key="index" style="font-size: 24px">
          <span v-if="member.profilePhotoBase64">
            <img :src="member.profilePhotoBase64" class="img-fluid rounded-4" alt="image"
              style="max-width: 30px; max-height: 30px; margin: 10px" /></span>
          <span v-else>
            <img :src="defaultAvatar" class="img-fluid rounded-4" alt="image"
              style="max-width: 30px; max-height: 30px; margin: 10px" />
          </span>
          <span v-if="member.name">{{ member.name }}</span>
          <span v-else style="color: gray">( 無名稱 )</span>
        </div>
      </div>
      <div v-else style="color: gray; margin: 50px">目前沒有人收藏</div>
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
})
const emit = defineEmits(['close'])
const likeList = ref([])
const defaultAvatar = "/user_static/images/tool/no-photo.png"

const getLikes = async () => {
  try {
    likeList.value = await activityApi.getActivityLikes(props.activityId);
  } catch (error) {
    console.error('Get like list failed: ', error)
  }
}

onMounted(getLikes)
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

.scroll-container {
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}
</style>