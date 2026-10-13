<template>
  <div class="overlay">
    <div class="popup">
      <h3 class="fw-bold mb-3">
        {{ isEdit ? '修改評論' : '新增評論' }}
      </h3>

      <span v-if="props.activityName">
        <h5>
          {{ props.activityName }}
        </h5>
      </span>

      <textarea rows="5" col="10" style="resize: none" v-model.trim="reviewContent" required></textarea>

      <div>
        <button class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" style="margin: 5px"
          @click="emit('close')">
          關閉
        </button>
        <button v-if="!isEdit" class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" style="margin: 5px"
          @click="submitAdd">
          送出
        </button>
        <button v-if="isEdit" class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" style="margin: 5px"
          @click="submitUpdate">
          修改
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { activityApi } from '@/api/vendor/activityApi'
import Swal from 'sweetalert2'

const props = defineProps({
  activityId: { type: Number, required: true },
  activityName: { type: String, required: false },
  updateReviewId: { type: Number, default: null },
  add: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'refresh'])
const isEdit = computed(() => props.update && !!props.updateReviewId)
const authStore = useAuthStore()
const memberId = authStore.memberId
const reviewContent = ref("")

const getReview = async () => {
  if (!props.updateReviewId) return
  try {
    const data = await activityApi.getReview(props.activityId, props.updateReviewId)
    reviewContent.value = data.review.reviewContent
  } catch (error) {
    console.error("Get review content failed: ", error)
  }
}

const submitAdd = async () => {
  try {
    await activityApi.addReview(props.activityId, memberId, reviewContent.value)

    emit('refresh')
    emit('close')
  } catch (error) {
    console.error('Add review failed: ', error)
  }
}

const submitUpdate = async () => {
  const ask = await Swal.fire({
    title: '確定送出？',
    icon: 'warning',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: '確認',
    cancelButtonText: '返回',
    reverseButtons: true,
  })

  if (!ask.isConfirmed) return

  try {
    await activityApi.updateReview(props.activityId, props.updateReviewId, reviewContent.value)

    emit('refresh')
    emit('close')
  } catch (error) {
    console.error('Update review failed: ', error)
  }
}

onMounted(getReview)
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