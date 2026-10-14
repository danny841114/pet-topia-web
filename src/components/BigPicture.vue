<template>
  <div class="overlay" @click.self="emit('close')">
    <img :src=props.imgSrc alt="Large Image" class="large-image" />
  </div>
</template>

<script setup>
const props = defineProps({
  imgSrc: String,
})

const emit = defineEmits(['close'])
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

  z-index: 1100;
}

.large-image {
  max-width: 90%;
  max-height: 90%;
}
</style>
