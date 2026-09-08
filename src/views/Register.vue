<template>
  <div class="register-page">
    <div class="container">
      <div class="row justify-content-end">
        <div class="col-md-5">
          <div class="register-container">
            <h2 class="mb-4">會員註冊</h2>

            <!-- 驗證提示 -->
            <div v-if="showVerification" class="verification-notice">
              <div class="alert alert-success">
                <h4 class="alert-heading">註冊成功！</h4>
                <p>我們已發送驗證郵件至您的信箱：{{ email }}</p>
                <p>請在 {{ countdown }} 秒內完成驗證</p>
                <div class="verification-form mt-3">
                  <div class="form-group mb-3">
                    <label for="verificationCode">請輸入驗證碼</label>
                    <input type="text" class="form-control" id="verificationCode" v-model="verificationCode"
                      placeholder="請輸入6位數驗證碼" maxlength="6">
                  </div>
                  <button class="btn btn-primary w-100 mb-3" @click="verifyEmail" :disabled="!verificationCode">
                    驗證
                  </button>
                </div>
                <hr>
                <p class="mb-0">
                  沒收到驗證信？
                  <button class="btn btn-link p-0" @click="resendVerification" :disabled="countdown > 0">
                    重新發送
                  </button>
                </p>
              </div>
            </div>

            <!-- 郵箱驗證成功後顯示 loading -->
            <div v-if="showLoading" class="preloader-wrapper active">
              <div class="preloader"></div>
              <div class="loading-message">
                <h4>{{ loadingMessage }}</h4>
                <p v-if="countdownSeconds > 0">{{ countdownSeconds }} 秒後轉至登入頁面...</p>
              </div>
            </div>

            <!-- 成功消息显示 -->
            <div v-if="success" class="alert alert-success">
              <span>{{ success }}</span>
            </div>

            <!-- 错误消息显示 -->
            <div v-if="error" class="alert alert-danger">
              <span>{{ error }}</span>
            </div>

            <form v-if="!showVerification" @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="email" class="form-label">電子郵件</label>
                <input type="email" class="form-control" id="email" v-model="email" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">密碼</label>
                <input type="password" class="form-control" id="password" v-model="password" required>
                <small class="text-muted">請輸入您想設置的密碼</small>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">確認密碼</label>
                <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block w-100 mb-3">註冊</button>
              </div>

              <div class="divider"><span>或</span></div>

              <a href="/oauth2/authorization/google" class="social-btn">
                <img src="/user_static/icon/Google_icon.png" alt="Google"> 使用 Google 註冊
              </a>

              <a href="/oauth2/authorization/facebook" class="social-btn">
                <img src="/user_static/icon/Facebook_icon.png" alt="Facebook"> 使用 Facebook 註冊
              </a>
            </form>
            <p v-if="!showVerification" class="text-center mt-3">已經有帳號？ <router-link to="/login">登入</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { onBeforeUnmount } from 'vue';
import { authApi } from '@/api/user/authApi';
import router from '@/router/router';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const verificationCode = ref('');
const showVerification = ref(false);
const countdown = ref(300);
const timer = ref(null);
const success = ref(null);
const error = ref(null);
const showLoading = ref(false);
const loadingMessage = ref('驗證成功！')
const countdownSeconds = ref(2);
const countdownTimer = ref(null);

const startCountdown = async () => {
  // 重新開始倒數前，先清除現有的計時器，避免重複計時
  if (timer.value) {
    clearInterval(timer.value);
  }

  countdown.value = 300;
  timer.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer.value);
    }
  }, 1000);
}

// 開始跳轉倒計時的方法
const startRedirectCountdown = async () => {
  countdownSeconds.value = 2;
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
  }

  countdownTimer.value = setInterval(() => {
    if (countdownSeconds.value > 0) {
      countdownSeconds.value--;
    } else {
      clearInterval(countdownTimer.value);
      // 驗證成功後跳轉到登入頁面
      router.push('/login?verified=true&message=' + encodeURIComponent('郵箱驗證成功，請登入'));
    }
  }, 1000);
}

const handleRegister = async () => {
  try {
    // 清除之前的錯誤和成功消息
    error.value = null;
    success.value = null;

    // 基本驗證
    if (!email.value || !password.value) {
      error.value = '請填寫所有必填欄位';
      return;
    }

    // 驗證密碼
    if (password.value !== confirmPassword.value) {
      error.value = '兩次輸入的密碼不一致';
      return;
    }

    await authApi.register(
      email.value.trim(),
      password.value,
      confirmPassword.value
    )

    success.value = '註冊成功！請查看您的電子郵件信箱進行驗證';
    showVerification.value = true;

    startCountdown();  // 開始倒數計時
  } catch (e) {
    console.error('註冊過程發生錯誤:', e);
    error.value = e.error || '系統錯誤，請稍後再試';
  }
}

const verifyEmail = async () => {
  try {
    // 加入token (原先無)
    const data = await authApi.verifyCode(
      email.value,
      verificationCode.value,
      null
    )

    if (data.verified) {
      loadingMessage.value = '郵箱驗證成功！';
      showLoading.value = true;
      startRedirectCountdown();
    } else {
      error.value = data.error || '驗證碼錯誤，請重新輸入';
    }
  } catch (e) {
    console.error('驗證過程發生錯誤:', e);
    error.value = '系統錯誤，請稍後再試';
  }
}
const resendVerification = async () => {
  try {
    await authApi.sendVerificationCode(email.value, null)
    success.value = '驗證郵件已重新發送，請查收';
    startCountdown();
  } catch (e) {
    console.error('重新發送驗證郵件時發生錯誤:', e);
    error.value = '系統錯誤，請稍後再試';
  }
}

onBeforeUnmount(() => {
  // 組件銷毀前清除計時器
  if (timer.value) {
    clearInterval(timer.value);
  }

  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
  }
})
</script>

<style>
.register-page {
  width: 100%;
  min-height: 100vh;
  background: url('/user_static/images/background-img.png') no-repeat center center/cover;
  display: flex;
  align-items: center;
  padding: 40px 0;
}

.register-container {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.register-form {
  max-width: 500px;
  margin: 0 auto;
}

.verify-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.verify-input {
  flex: 1;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider span {
  padding: 0 10px;
  background-color: white;
  position: relative;
  z-index: 5;
}

.divider:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #ddd;
  z-index: 1;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  padding: 10px 0;
  border-radius: 5px;
  text-decoration: none;
  color: #333;
  border: 1px solid #ccc;
  transition: all 0.3s;
}

.social-btn:hover {
  background-color: #f5f5f5;
}

.social-btn img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

/* Loading 動畫樣式 */
.preloader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.preloader-wrapper .preloader {
  margin: 0 auto;
  transform: translateZ(0);
  position: relative;
}

.preloader:before,
.preloader:after,
.preloader {
  border-radius: 50%;
  width: 2em;
  height: 2em;
  animation: animation 1.2s infinite ease-in-out;
}

.preloader {
  animation-delay: -0.16s;
}

.preloader:before {
  content: '';
  position: absolute;
  top: 0;
  left: -3.5em;
  animation-delay: -0.32s;
}

.preloader:after {
  content: '';
  position: absolute;
  top: 0;
  left: 3.5em;
}

@keyframes animation {

  0%,
  80%,
  100% {
    box-shadow: 0 2em 0 -1em var(--accent-color, #ff6b6b);
  }

  40% {
    box-shadow: 0 2em 0 0 var(--accent-color, #ff6b6b);
  }
}

.loading-message {
  margin-top: 2rem;
  text-align: center;
  color: #333;
}

.loading-message h4 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ff6b6b;
}
</style>