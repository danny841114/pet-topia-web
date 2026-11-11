<template>
  <div class="border rounded-2 px-3 border-dark-subtle">
    <!-- 搜尋列 -->
    <form class="text-center d-flex align-items-center" @submit.prevent="searchVendor">
      <input v-model="keyword" type="text" class="form-control border-0 bg-transparent" placeholder="搜尋友善店家" />
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" @click="searchVendor()">
        <path fill="currentColor"
          d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z" />
      </svg>
    </form>
    <!-- 搜尋列 -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { vendorApi } from '@/api/vendor/vendorApi'
import { useRouter } from 'vue-router'

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜尋友善店家',
  },
})

const emit = defineEmits(['search'])

const router = useRouter()
const keyword = ref('')

const searchVendor = async () => {
  if (!keyword.value) {
    alert('請輸入關鍵字!')
    return
  }

  try {
    const vendorList = await vendorApi.searchVendor(keyword.value)

    emit('search', vendorList)

    router.replace({
      path: '/vendor/search',
      query: { keyword: keyword.value },
    })
  } catch (e) {
    console.error('提交失敗:', e)
    alert('提交失敗，請重試！')
  }
}
</script>

<style scoped></style>
