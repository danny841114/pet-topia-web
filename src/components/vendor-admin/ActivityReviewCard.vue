<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="reviews-container">
      <h4>評論</h4>
      <div v-if="reviews[activity.id] && reviews[activity.id].length > 0" class="review-list">
        <div v-for="review in reviews[activity.id]" :key="review.id" class="review-item">
          <div class="review-header">
            <span class="review-username">會員ID：{{ review.memberId }}</span>
            <span class="review-date">{{ dateUtil.formatDateTime(review.reviewTime) }}</span>
          </div>
          <div class="review-body">
            <p class="review-content">評論內容：{{ review.reviewContent }}</p>
          </div>
          <button class="btn btn-danger" @click="deleteReview(review.id, activity.id)">
            刪除評論
          </button>
        </div>
      </div>
      <p v-else>此活動沒有評論！</p>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { vendorAdminApi } from '@/api/vendor/vendorAdminApi'
import { dateUtil } from '@/utils/dateUtil'

const props = defineProps({
  activity: Object,
  reviews: Object
});
const emit = defineEmits(['close'])

const loadReviews = async () => {
  try {
    props.reviews[props.activity.id] = await vendorAdminApi.getActivityReviews(props.activity.id)
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

const deleteReview = async (reviewId, activityId) => {
  try {
    await vendorAdminApi.deleteActivityReview(activityId, reviewId)

    Swal.fire({
      icon: 'success',
      title: '刪除成功！',
      timer: 1000,
      showConfirmButton: false
    });

    loadReviews(activityId);
  } catch (error) {
    console.error('Error deleting review:', error);

    Swal.fire({
      icon: 'error',
      title: '刪除失敗',
      text: '請稍後再試'
    });
  }
};
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

.reviews-container {
  width: 100%;
  background-color: #f8f9fa;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-height: 500px;
  overflow-y: auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.review-item {
  background-color: #ffffff;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #6c757d;
}

.review-username {
  font-weight: bold;
  color: #495057;
}

.review-body {
  padding-top: 10px;
  padding-bottom: 10px;
}

.review-content {
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  text-align: left;
  /* 确保评论内容左对齐 */
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 0.875rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-danger:hover {
  background-color: #c82333;
}

p {
  color: #6c757d;
  font-size: 1rem;
  text-align: center;
}
</style>
