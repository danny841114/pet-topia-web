<template>
  <div class="notification-card">
    <h4>報名{{ props.operationType ? '接受' : '拒絕' }}通知</h4>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">標題</label>
        <input type="text" class="form-control" v-model="notificationTitle" required>
      </div>

      <div class="mb-3">
        <label class="form-label">內容</label>
        <textarea class="form-control" v-model="notificationContent" required></textarea>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-secondary" @click="getDemo" type="button">Demo</button>
        <button class="btn btn-primary" type="submit">發送</button>
        <button type="button" class="btn btn-secondary" @click="emit('close')">取消</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { vendorAdminApi } from '@/api/vendor/vendorAdminApi';
import { ref } from 'vue';

const props = defineProps({
  // operationType: true => 接受, false => 拒絕
  operationType: Boolean,
  registrations: Array,
})
const emit = defineEmits(['close', 'refresh'])
const token = localStorage.getItem('token');
const notificationTitle = ref('');
const notificationContent = ref('');

const handleSubmit = async () => {
  if (!props.registrations || props.registrations.length === 0) return;

  try {
    const requests = props.registrations.map(async (registration) => {
      if (props.operationType) {
        await vendorAdminApi.acceptRegister(registration.id)
      } else {
        await vendorAdminApi.rejectRegister(registration.id)
      }

      // 發送通知
      return vendorAdminApi.notifyMember(
        registration.member.id,
        registration.vendorActivity.id,
        notificationTitle.value,
        notificationContent.value,
        token
      )
    });

    // 等待所有請求完成
    await Promise.all(requests);

    emit('close')
  } catch (error) {
    console.error("Send notification failed: ", error);
  }
};

const getDemo = () => {
  if (props.operationType) {
    notificationTitle.value = '報名失敗通知';
    notificationContent.value = '抱歉，活動報名失敗';
  } else {
    notificationTitle.value = '報名失敗通知';
    notificationContent.value = '抱歉，活動報名失敗';
  }
}
</script>

<style scoped>
.notification-card {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  height: auto;
  font-size: 18px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  z-index: 1050;
  overflow: hidden;
}
</style>
