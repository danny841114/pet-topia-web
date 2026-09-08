<template>
  <section id="banner" style="background: #F9F3EC;">
    <div class="container">
      <div class="swiper main-swiper">
        <div class="swiper-wrapper">
          <div v-for="(slide, index) in slides" :key="index" class="swiper-slide py-5">
            <div class="row banner-content align-items-center">
              <div class="img-wrapper col-md-5">
                <img :src="slide.img" class="img-fluid" alt="banner-image">
              </div>
              <div class="content-wrapper col-md-7 p-5 mb-5">
                <div class="secondary-font display-6 text-uppercase mb-4 fw-bold" style="color: #7B3F00;">
                  {{ slide.subtitle }}
                </div>

                <h1 class="banner-title  display-3 fw-normal">{{ slide.title }}</h1>
                <h1>您的最佳選擇!</h1>

                <div class="d-flex">
                  <router-link :to="`/shop/productDetail?productDetailId=${slide.productDetailId}`"
                    class="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 me-4 mt-4">
                    查看詳情
                    <svg width="24" height="24" viewBox="0 0 24 24" class="mb-1">
                      <use xlink:href="#arrow-right"></use>
                    </svg>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分頁指示器 -->
        <div class="swiper-pagination mb-5"></div>
      </div>
    </div>
  </section>

  <section id="products" class="container my-5">

    <div v-if="searchProductKeyword">
      <h2 class="mb-3">
        <span>'</span>
        <span style="color: crimson;">{{ searchProductKeyword ? searchProductKeyword : "" }}</span>
        <span>' 搜尋結果</span>
      </h2>
    </div>

    <!-- 商店標題 -->
    <div class="section-header d-md-flex justify-content-between align-items-center">
      <h2 class="display-3 fw-normal">商品</h2>
    </div>

    <!-- 商品內容 -->
    <div class="container row">
      <!-- 商品Card -->
      <div class="col-md-4 col-lg-3 my-4" v-if="productDetailDtoList" v-for="productDetailDto in productDetailDtoList"
        :key="productDetailDto.productDetail.id">
        <!-- 商品左上字樣 -->
        <!-- <div class="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
                        New
                </div> -->
        <div class="card position-relative">
          <!-- 商品圖片 -->
          <div>
            <img :src="`${PATH}/shop/products/api/getPhoto?productDetailId=${productDetailDto.productDetail.id}`"
              alt="image" class="img-fluid rounded-4" style="height: 180px;">
          </div>
          <div class="card-body p-0">
            <!-- 商品名稱 -->
            <h3 class="card-title pt-4 m-0" style="font-size: 1.2em;">{{ productDetailDto.productDetail.name
              }}</h3>
            <div class="card-text">
              <!-- 商品評價 星星 -->

              <span class="rating secondary-font">
                <span class="star-rating">
                  <i v-for="star in 5" :key="star" :class="['fa', {
                    'fa-star fas text-primary': star <= (productDetailDto.avgRating || 0),
                    'fa-star far text-secondary': star > (productDetailDto.avgRating || 0)
                  }]">
                  </i>
                </span>
                ({{ (productDetailDto.avgRating || 0).toFixed(1) }})
              </span>


              <!-- 商品價錢 -->
              <h3 class="secondary-font text-primary" style="font-size: 1.2em;">$ {{
                productDetailDto.minPriceProduct.discountPrice
                  ? productDetailDto.minPriceProduct.discountPrice :
                  productDetailDto.minPriceProduct.unitPrice }}
                <span>&nbsp;</span>
                <span v-if="productDetailDto.minPriceProduct.discountPrice" class="discount-tag">
                  {{ (10 * productDetailDto.minPriceProduct.discountPrice /
                    productDetailDto.minPriceProduct.unitPrice).toFixed(1) }}折
                </span>
              </h3>

              <!-- 查看詳情 -->
              <div class="d-flex flex-wrap mt-3 detail-button-container">
                <!-- 詳情按鈕 -->
                <RouterLink
                  :to="{ path: '/shop/productDetail', query: { productDetailId: productDetailDto.productDetail.id } }">
                  <div class="detail-button btn btn-light btn-sm me-3 px-4 pt-3 pb-3">
                    看詳情
                  </div>
                </RouterLink>
                <!-- 愛心按鈕 -->
                <!-- <a href="#" class="btn-wishlist px-4 pt-3 ">
                                        <iconify-icon icon="fluent:heart-28-filled" class="fs-5"></iconify-icon>
                                </a> -->
              </div>


            </div>

          </div>
        </div>
      </div>
      <div v-else>
        <h2>查無內容</h2>
      </div>
    </div>

    <!-- 分頁 -->
    <div class="container" v-if="total > 0">
      <Paginate v-model="currentPage" :page-count="pages" :initial-page="currentPage" :page-range="3" :margin-pages="1"
        :click-handler="onChangePage" :first-last-button="true" prev-text="<i class= 'bi bi-chevron-left' > </i>"
        next-text="<i class= 'bi bi-chevron-right' > </i>" first-button-text="<i class= 'bi bi-chevron-bar-left' > </i>"
        last-button-text="<i class= 'bi bi-chevron-bar-right' > </i>">

      </Paginate>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute } from "vue-router";
import Paginate from 'vuejs-paginate-next';
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { shopApi } from '@/api/shop/shopApi';

const slides = ref([
  {
    img: '/user_static/images/item13.jpg',
    subtitle: '🔔最新上架',
    title: '寵物智能餵食器',
    productDetailId: 19, // 最新上架
  },
  {
    img: '/user_static/images/banner-img4.png',
    subtitle: '🔥最熱銷',
    title: '寵物學院風針織背心',
    productDetailId: 1, // 最熱銷>>寵物針織衣
  },
  {
    img: '/user_static/images/banner-img.png',
    subtitle: '🌟最喜愛',
    title: '貓咪棉繩玩具球',
    productDetailId: 2, // 最喜愛>>寵物玩具球
  }
]);
onMounted(async () => {
  await nextTick();

  setTimeout(() => {
    const swiper = new Swiper('.main-swiper', {
      modules: [Autoplay, Pagination, Navigation],
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
    });

    swiper.update();
  }, 100);
});

const route = useRoute();

const PATH = `${import.meta.env.VITE_API_URL}`;

// 初始載入
const productDetailDtoList = ref([]);

// 商品分類
const selectedCategory = ref(route.query.category || "所有商品");   // 預設從 query 讀取
// 關鍵字搜尋
const searchProductKeyword = ref(route.query.keyword || "");

// 分頁
const currentPage = ref(1); // 目前在第幾頁
const pages = ref(0);   // 總共有幾頁
const total = ref(0);   // 總共有幾筆
const rows = ref(12);   // 每頁顯示幾筆
const start = ref(0);   // 從第幾筆資料開始
const lastPageRows = ref(0); // 最後一頁有幾筆

onMounted(async () => {
  onChangePage();
})

// #region Event function =================================================

// 分頁切換
function onChangePage(page) {
  if (page) {
    currentPage.value = page;
    start.value = (page - 1) * rows.value;
  } else {
    currentPage.value = 1;
    start.value = 0;
  }

  const data = {
    "start": start.value,
    "rows": rows.value,
    "category": selectedCategory.value,
    "keyword": searchProductKeyword.value ? searchProductKeyword.value : null
  }

  getProducts(data);

}

// #endregion =================================================


// 加載商品
async function getProducts(data) {
  try {
    const res = await shopApi.getProducts(
      data.start,
      data.rows,
      data.category,
      data.keyword
    )

    console.log(res);

    productDetailDtoList.value = res.productDetailDtoList;

    // 分頁
    total.value = response.data.count;
    pages.value = Math.ceil(total.value / rows.value);
    lastPageRows.value = total.value % rows.value;
  } catch (e) {
    console.log("獲取商品失敗", e)
  }
}

// 監聽query變化
watch(() => route.query, async () => {
  selectedCategory.value = route.query.category || "所有商品";
  searchProductKeyword.value = route.query.keyword || "";
  onChangePage();

}, { deep: true });


</script>

<style scoped>
/* card樣式 */
.card {
  width: 250px;
  min-height: 400px;
  background-color: #fffcf6;
  border-radius: 10px;
  position: relative;
  padding-bottom: 60px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

/* 圖片固定大小 */
.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

/* 讓 card-body 占滿可用空間，推動按鈕到底部 */
.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-bottom: 50px;
}

.card-title {
  font-size: 1.5em;
}

.card-text {
  flex-grow: 1;
  margin-bottom: 10px;
}

/* 確保 RouterLink 也佔滿 */
.detail-button-container {
  width: 100% !important;
  display: flex !important;
  justify-content: center !important;
}

/* 讓按鈕固定在 Card 底部並佔滿寬度 */
.detail-button {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  /* 確保完全佔滿 */
  text-align: center;
  padding: 15px 0;
  font-size: 1.2em;
  border-radius: 0 0 15px 15px;
  /* 讓按鈕與 Card 的圓角一致 */
  transition: 0.3s;
  background-color: #F4D8B1 !important;
  /* 按鈕背景色 */
}

.detail-button:hover {
  background-color: #e9ca94 !important;
  color: #000;
}

/* 打折字體樣式 */
.discount-tag {
  background-color: #ffecec;
  color: #d7000f;
  font-size: 0.6em;
  padding: 2px 4px;
  border-radius: 3px;
  display: inline-block;
  min-width: 30px;
  text-align: center;
}

.star-rating i.fas {
  padding-top: 5px;
  color: #f8c307 !important;
  font-size: 1rem;
}

.star-rating i.far {
  padding-top: 5px;
  color: #ddd;
  font-size: 1rem;
}

#banner .swiper {
  max-height: 500px;
  overflow: hidden;

}

#banner .swiper-slide img {
  max-width: 80%;
  max-height: 400px;
  object-fit: contain;
}

#banner .container {
  padding-left: 75px;
  padding-right: 75px;
}

:deep(.pagination .page-item.active .page-link) {
  background-color: #ecc795;
  border-color: #ecc795;
  color: #fff;
  cursor: pointer;
}

:deep(.pagination .page-link:hover) {
  cursor: pointer;
}
</style>