<template>
  <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasSearch"
    aria-labelledby="Search">
    <div class="offcanvas-header justify-content-center">
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body">
      <div class="order-md-last">
        <h4 class="text-primary text-uppercase mb-3">Search</h4>
        <div class="search-bar border rounded-2 border-dark-subtle">
          <form id="search-form" class="text-center d-flex align-items-center" @submit.prevent="handleSubmit">
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Search Here"
              v-model="keyword" />
            <Icon icon="tabler:search" class="fs-4 me-3" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const keyword = ref('')

const handleSubmit = () => {
  if (!keyword.trim()) return
  router.push({ path: '/shop/search', query: { q: keyword.trim() } })
}
</script>

<style scoped>
.search-bar {
  max-width: 500px;
  margin: 0 auto;
}
</style>
