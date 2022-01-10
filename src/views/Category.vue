<template>
  <ProductList />
  <div class="search-wrap">
    <ListScroll v-if="categoryData.length" :scrollData="categoryData" class="nav-side-wrapper">
      <ul class="nav-side">
        <li
          v-for="item in categoryData"
          :key="item.categoryId"
          :class="{ 'active': currentIndex == item.categoryId }"
          @click="selectMenu(item.categoryId)"
        >{{ item.categoryName }}</li>
      </ul>
    </ListScroll>
    <div class="search-content">
      <ListScroll v-if="categoryData.length" :scrollData="categoryData">
        <div class="swiper-container">
          <!-- 3.x 版本，同个元素中， v-if 总是优先于 v-for 生效。 -->
          <template v-for="(category, index) in categoryData">
            <div class="swiper-slide" v-if="currentIndex == category.categoryId" :key="index">
              <div
                class="category-list"
                v-for="(products, index) in category.secondLevelCategoryVOS"
                :key="index"
              >
                <p class="catogory-title">- {{ products.categoryName }} -</p>
                <div
                  class="product-item"
                  v-for="(product, index) in products.thirdLevelCategoryVOS"
                  :key="index"
                  @click="selectProduct(product)"
                >
                  <img src="@/assets/sufeng-with-border.png" class="product-img" />
                  <p class="product-title">{{ product.categoryName }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </ListScroll>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';

import ListScroll from '@/components/ListScroll';
import ProductList from '@/views/ProductList';

import { useRouter } from 'vue-router';
import { getCategory } from "@/service/goods";
import { reactive, onMounted, toRefs } from 'vue';

export default {
  components: {
    ListScroll,
    ProductList
  },
  setup() {
    const router = useRouter()

    const state = reactive({
      categoryData: [],
      currentIndex: 543
    })

    onMounted(async () => {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      // const { data } = await getCategory(); //来自后端
      const { data: { data } } = await getCategory(); //来自mock
      console.log(data);
      state.categoryData = data;
      Toast.clear();
    })

    const selectMenu = (index) => {
      state.currentIndex = index;
    }

    const selectProduct = (item) => {
      router.push({ path: '/product-list', query: { categoryId: item.categoryId } })
    }
    return {
      ...toRefs(state),
      selectMenu,
      selectProduct,
    }
  }
}
</script>
<style lang="less" scoped>
@import "../common/style/mixin";
.search-wrap {
  .fj();
  .wh(100%, calc(100vh - 100px));
  background: #f8f8f8;
  .nav-side-wrapper {
    width: 28%;
    height: 100%;
    overflow: hidden;
    .nav-side {
      width: 100%;
      .boxSizing();
      background: #f8f8f8;
      li {
        width: 100%;
        height: 56px;
        text-align: center;
        line-height: 56px;
        font-size: 14px;
        &.active {
          color: @primary;
          background: #fff;
        }
      }
    }
  }
  .search-content {
    width: 72%;
    height: 100%;
    padding: 0 10px;
    background: #fff;
    overflow-y: scroll;
    touch-action: pan-y;
    * {
      touch-action: pan-y;
    }
    .boxSizing();
    .swiper-container {
      width: 100%;
      .swiper-slide {
        width: 100%;
        .category-list {
          margin: 18px auto;
          display: flex;
          flex-wrap: wrap;
          flex-shrink: 0;
          width: 95%;
          text-align: center;
          border-radius: 25px;
          box-shadow: 2px 2px 5px rgba(48, 80, 143, 0.2);
          .catogory-title {
            width: 100%;
            font-size: 15px;
            padding: 0;
            margin: 15px auto;
          }
          .product-item {
            width: 33.3333%;
            margin-bottom: 5px;
            font-size: 15px;
            .product-img {
              .wh(30px, 30px);
            }
          }
        }
      }
    }
  }
}
</style>