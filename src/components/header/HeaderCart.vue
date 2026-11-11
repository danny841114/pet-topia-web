<template>
  <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasCart" aria-labelledby="My Cart">
    <div class="offcanvas-header justify-content-center">
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body">
      <div class="order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-primary">Your cart</span>
          <span class="badge bg-primary rounded-circle pt-2">{{ cartCount }}</span>
        </h4>

        <ul v-if="cartItems.length > 0" class="list-group mb-3">
          <li v-for="item in cartItems" :key="item.id" class="list-group-item d-flex justify-content-between lh-sm">
            <div>
              <h6 class="my-0">{{ item.name }}</h6>
              <small class="text-body-secondary">{{ item.description || 'Brief description' }}</small>
            </div>
            <span class="text-body-secondary">${{ item.price }}</span>
          </li>

          <li class="list-group-item d-flex justify-content-between">
            <span class="fw-bold">Total (USD)</span>
            <strong>${{ total }}</strong>
          </li>
        </ul>

        <div v-else class="text-center py-3">
          <p class="text-muted">Your cart is empty</p>
        </div>

        <button class="w-100 btn btn-primary btn-lg" type="submit" :disabled="cartItems.length === 0">
          Continue to checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const cartCount = computed(() => cartStore.cartCount)

// TODO: 後續擴展 cart store 以支援完整購物車項目列表
// 目前 cart store 僅有 cartCount，這裡使用假資料作為佔位
const cartItems = computed(() => [
  { id: 1, name: 'Grey Hoodie', description: 'Brief description', price: 12 },
  { id: 2, name: 'Dog Food', description: 'Brief description', price: 8 },
  { id: 3, name: 'Soft Toy', description: 'Brief description', price: 5 },
])

const total = computed(() => cartItems.value.reduce((sum, item) => sum + item.price, 0))
</script>

<style scoped>
/* 購物車離canvas樣式 */
</style>
