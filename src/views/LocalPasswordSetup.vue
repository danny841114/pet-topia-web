<template>
  <div class="password-setup-page">
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-center mb-4">設置本地密碼</h3>

              <!-- 初始畫面：提供信息並提示發送驗證郵件 -->
              <div v-if="step === 'initial'">
                <div class="alert alert-info">
                  <p>您的帳號是使用 <strong>{{ provider || 'Google' }}</strong> 註冊的。</p>
                  <p>設置本地密碼後，您可以選擇使用：</p>
                  <ul>
                    <li>原有的 <strong>{{ provider || 'Google' }}</strong> 登入</li>
                    <li>使用電子郵件和密碼登入</li>
                  </ul>
                </div>

                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>

                <div v-if="message" class="alert alert-success">
                  {{ message }}
                </div>

                <form @submit.prevent="sendVerification" class="mt-4">
                  <div class="text-center">
                    <button type="submit" class="btn btn-primary" :disabled="isLoading">
                      {{ isLoading ? '發送中...' : '發送驗證碼' }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- 第二步：驗證碼驗證 -->
              <div v-if="step === 'verification'">
                <div class="alert alert-info">
                  <p>我們已發送驗證碼至您的信箱：<strong>{{ email }}</strong></p>
                  <p>請在 {{ countdown }} 秒內完成驗證</p>
                </div>

                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>

                <div v-if="message" class="alert alert-success">
                  {{ message }}
                </div>

                <form @submit.prevent="verifyCode" class="mt-4">
                  <div class="form-group mb-3">
                    <label for="verificationCode">請輸入驗證碼</label>
                    <input type="text" class="form-control" id="verificationCode" v-model="verificationCode"
                      placeholder="請輸入6位數驗證碼" maxlength="6" required>
                  </div>

                  <div class="text-center mb-3">
                    <button type="submit" class="btn btn-primary w-100" :disabled="isLoading || !verificationCode">
                      {{ isLoading ? '驗證中...' : '驗證' }}
                    </button>
                  </div>
                </form>

                <div class="text-center">
                  <p class="mb-0">
                    沒收到驗證碼？
                    <button class="btn btn-link p-0" @click="sendVerification" :disabled="countdown > 0 || isLoading">
                      重新發送
                    </button>
                  </p>
                </div>
              </div>

              <!-- 第三步：密碼設置表單 -->
              <div v-if="step === 'password'">
                <div class="alert alert-info">
                  <p>請為您的帳號 <strong>{{ email }}</strong> 設置本地密碼</p>
                </div>

                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>

                <div v-if="message" class="alert alert-success">
                  {{ message }}
                </div>

                <form @submit.prevent="setPassword" class="mt-4">
                  <div class="form-group mb-3">
                    <label for="password">新密碼</label>
                    <input type="password" class="form-control" id="password" v-model="password" required minlength="8"
                      maxlength="20">
                    <small class="form-text text-muted">
                      密碼長度必須在8-20個字元之間
                    </small>
                  </div>

                  <div class="form-group mb-3">
                    <label for="confirmPassword">確認密碼</label>
                    <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
                  </div>

                  <div class="text-center">
                    <button type="submit" class="btn btn-primary" :disabled="isLoading">
                      {{ isLoading ? '設置中...' : '設置密碼' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authApi } from '@/api/user/authApi';

const router = useRouter();
const route = useRoute();
const email = ref('');
const provider = ref('');
const step = ref('initial'); // 'initial', 'verification', 'password', 'error'
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const message = ref('');
const isLoading = ref(false);
const verificationCode = ref('');
const countdown = ref(0);

let countdownTimer = null;

// 檢查電子郵件的登入方式
const checkEmailStatus = async () => {
  try {
    isLoading.value = true;

    const encodedEmail = encodeURIComponent(email.value)
    const data = await authApi.checkEmailStatus(encodedEmail);

    if (data.canSetupLocalPassword) {
      provider.value = data.provider;
    } else {
      error.value = '此帳號無法設置本地密碼';
      step.value = 'error';
    }
  } catch (e) {
    console.error('檢查電子郵件狀態錯誤:', e);
    error.value = '無法檢查帳號狀態，請稍後再試';
  } finally {
    isLoading.value = false;
  }
}

// 發送驗證郵件
const sendVerification = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    message.value = '';

    await authApi.localSendVerificationCode(email.value)

    message.value = '驗證碼已發送，請查收您的電子郵件'
    step.value = 'verification';
    startCountdown();
  } catch (e) {
    console.error('發送驗證碼錯誤:', e);
    error.value = '發送驗證碼時發生錯誤，請稍後再試'
  } finally {
    isLoading.value = false;
  }
}

// 啟動倒數計時
const startCountdown = () => {
  // 清除之前的計時器
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  countdown.value = 60; // 60秒倒數

  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }, 1000);
}

// 驗證驗證碼
const verifyCode = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    message.value = '';

    if (!verificationCode.value || verificationCode.value.length !== 6) {
      error.value = '請輸入6位數驗證碼';
      isLoading.value = false;
      return;
    }

    const res = await authApi.localVerifyCode(email.value, verificationCode.value)

    if (res.verified) {
      message.value = '驗證成功';

      // 清除計時器
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }

      // 進入密碼設置階段
      setTimeout(() => {
        step.value = 'password';
        message.value = '';
      }, 1000);
    }
  } catch (e) {
    console.error('驗證驗證碼錯誤:', e);
    error.value = '驗證過程中發生錯誤，請稍後再試';
  } finally {
    isLoading.value = false;
  }
}

// 設置密碼
const setPassword = async () => {
  // 驗證密碼
  if (password.value !== confirmPassword.value) {
    error.value = '兩次輸入的密碼不一致';
    return;
  }

  if (password.value.length < 8 || password.value.length > 20) {
    error.value = '密碼長度必須在8-20個字元之間';
    return;
  }

  try {
    isLoading.value = true;
    error.value = '';
    message.value = '';

    await authApi.loclaChangePassword(email.value, password.value)

    message.value = '密碼設置成功，3秒後將跳轉到登入頁面';

    // 清除輸入內容
    password.value = '';
    confirmPassword.value = '';

    // 3秒後跳轉到登入頁面
    setTimeout(() => {
      router.push({
        path: '/login',
        query: {
          message: '本地密碼設置成功，請使用新密碼登入'
        }
      });
    }, 3000);

  } catch (e) {
    console.error('設置密碼錯誤:', e);
    error.value = '設置密碼時發生錯誤，請稍後再試';
  } finally {
    isLoading.value = false;
  }
}

// 生命週期：取代原本的 created()
onMounted(() => {
  // 優先使用 Vue Router 的 route.query 讀取 URL 參數，
  // 若沒有則倒退使用原生 URLSearchParams
  email.value = (route.query.email)
    || new URLSearchParams(window.location.search).get('email')
    || '';

  if (!email.value) {
    error.value = '缺少電子郵件地址參數，請從登入頁面重新操作';
    return;
  }

  checkEmailStatus();
});

// 生命週期：取代原本的 beforeUnmount()
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
.password-setup-page {
  min-height: calc(100vh - 60px);
  /* 減去header的高度 */
  background: url('/user_static/images/background-img.png') no-repeat center center/cover;
  padding: 2rem 0;
}

.card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.btn-primary {
  background-color: #ff6b6b;
  border-color: #ff6b6b;
}

.btn-primary:hover {
  background-color: #ff5252;
  border-color: #ff5252;
}

.btn-link {
  color: #ff6b6b;
  text-decoration: none;
}

.btn-link:hover {
  color: #ff5252;
  text-decoration: underline;
}
</style>
