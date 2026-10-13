<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="popup">
      <h3><b>分享</b></h3>
      <div class="container d-flex justify-content-center">
        <div @click="shareOnFacebook" v-html="facebookSvg">
        </div>
        &emsp;
        <div @click="shareOnLine">
          <img :src=lineLogoUrl alt="LINE Logo" width="100px" height="100px" />
        </div>
        &emsp;
        <div @click="shareOnX">
          <img :src=xLogoUrl alt="X Logo" width="100px" height="100px" />
        </div>
      </div>
      <br />

      <div>
        <input class="share-url" v-model="shareUrl" readonly />&emsp;<button
          class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" @click="copyUrl()">
          複製
        </button>
      </div>
      <div>{{ copyMessage }}</div>

      <button class="btn btn-outline-dark btn-1g text-uppercase fs-5 rounded-4" style="margin: 5px"
        @click="emit('close')">
        關閉
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const facebookSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="blue">
  <path d="M22.675 0h-21.35C.597 0 0 .598 0 1.333v21.333C0 23.402.597 24 1.325 24h11.5v-9.3h-3.1v-3.6h3.1v-2.7c0-3.1 1.9-4.8 4.7-4.8 1.3 0 2.5.1 2.8.1v3.3h-1.9c-1.5 0-1.9.7-1.9 1.8v2.3h3.8l-.5 3.6h-3.3V24h6.5c.7 0 1.3-.598 1.3-1.333V1.333C24 .598 23.402 0 22.675 0z" />
</svg>
`
const lineLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/LINE_logo.svg/480px-LINE_logo.svg.png"
const xLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/450px-X_logo_2023.svg.png"

const props = defineProps({
  activityId: Number,
  typeId: Number
})
const emit = defineEmits(['close'])
const shareUrl = ref(window.location.href)
const copyMessage = ref("")

const shareOnFacebook = () => {
  const urlChange = shareUrl.value.replace('localhost', '127.0.0.1') // FB沒辦法直接分享localhost
  const url = encodeURIComponent(urlChange) // 取得當前網址
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}

const shareOnLine = () => {
  const url = encodeURIComponent(shareUrl.value)
  window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, '_blank')
}

const shareOnX = () => {
  const url = encodeURIComponent(shareUrl.value)
  window.open(`https://x.com/intent/tweet?url=${url}`, '_blank')
}

const copyUrl = () => {
  navigator.clipboard.writeText(shareUrl.value)
  copyMessage.value = '複製成功'
}
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

.share-url {
  width: 300px;
  padding: 5px;
  border: 2px solid black;
  border-radius: 10px;
  font-size: 14px;
}
</style>