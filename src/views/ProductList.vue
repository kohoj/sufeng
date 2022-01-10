<template>
  <div class="back-bar"></div>
  <van-row type="flex" justify="center" class="home-header">
    <van-col class="logo-area" span="4">
      <img class="logo" v-if="!show" src="@/assets/sufeng-single.png" alt="logo" srcset />
      <van-icon
        class="closeIcon"
        v-else
        name="clear"
        size="1rem"
        color="#fff"
        @click="closeAndBack"
      />
    </van-col>

    <van-col span="20">
      <van-search
        background="rgba(120, 120, 120, 0)"
        v-model="keyword"
        shape="round"
        clearable
        placeholder="请输入搜索关键词"
        @click="show = true"
        @search="getSearch"
      />
    </van-col>
  </van-row>
  <!-- ----top-search bar ----------------down-product-list----------------- -->
  <van-overlay :show="show" />
  <van-popup
    v-model:show="show"
    position="bottom"
    :style="{ height: 'calc(100vh - 58px)' }"
    :overlay="false"
  >
    <div class="product-list">
      <van-tabs class="tabs" type="line" color="#30508f" animated @click="switchTab">
        <van-tab title="推荐" name></van-tab>
        <van-tab title="新品" name="new"></van-tab>
        <van-tab title="价格" name="price"></van-tab>
      </van-tabs>
      <div class="content">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="productList.length ? '没有咯，可以再搜点别的' : '搜索想要的商品'"
          @load="onLoad"
        >
          <template v-if="productList.length">
            <div
              class="product-item"
              v-for="(item, index) in productList"
              :key="index"
              @click="productDetail(item)"
            >
              <img :src="$filters.prefix(item.goodsCoverImg)" />
              <div class="product-info">
                <p class="name">{{ item.goodsName }}</p>
                <p class="subtitle">{{ item.goodsIntro }}</p>
                <span class="price">￥ {{ item.sellingPrice }}</span>
              </div>
            </div>
          </template>
          <Doggy v-else class="empty" />
        </van-list>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { reactive, toRefs, ref, onMounted } from 'vue';
import { search } from '@/service/goods';

import Doggy from '@/components/Doggy';
export default {
  components: { Doggy },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      orderBy: '',
      keyword: '',
      finished: true,
      loading: false,
      page: 0,
      totalPage: 0,
      productList: [],
    })
    const { categoryId } = route.query;

    // 展示上拉窗
    const show = ref(false);
    onMounted(() => {
      if (categoryId) {
        show.value = true;
        getSearch();
      }
    })

    // 关闭上拉窗，并/或返回上一级
    const closeAndBack = () => {
      show.value = false;
      if (categoryId) {
        router.go(-1);
      }
    }

    // 切换标签
    const switchTab = (name) => {
      state.orderBy = name;
      getSearch();
    }

    // 置空列表，切换为搜索状态
    const getSearch = () => {
      state.productList = [];
      state.finished = false;
      state.loading = true;
      state.page = 1;
      onLoad();
    }

    // 页面加载后，加载下一页
    const onLoad = () => {
      if (state.page < state.totalPage) state.page++;
      if (!categoryId && !state.keyword) {
        state.finished = true;
        state.loading = false;
      } else init();
    }
    // 获取data，以此改变state状态
    const init = async () => {
      const { data: { list, totalPage, totalCount } } = await search({
        pageNumber: state.page,
        goodsCategoryId: categoryId,
        keyword: state.keyword,
        orderBy: state.orderBy
      })
      state.productList = state.productList.concat(list);
      console.log('此列有' + totalCount + '款商品 ');
      state.totalPage = totalPage;
      state.loading = false;
      if (state.page >= state.totalPage) state.finished = true;
    }

    // 点击跳转到商品详情
    const productDetail = (item) => {
      router.push({ path: `/product/${item.goodsId}` });
    }

    return {
      show,
      closeAndBack,
      ...toRefs(state),
      productDetail,
      getSearch,
      switchTab,
      onLoad,
    }
  }
}
</script>
<style lang="less" scoped>
@import "../common/style/mixin";
.home-header {
  position: fixed;
  top: 0;
  .boxSizing();
  .wh(100%, 55px);
  line-height: 50px;
  font-size: 15px;
  color: #fff;
  background-color: rgba(48, 80, 143, 0.08);
  z-index: 99;
  box-shadow: 3px 0px 5px rgba(48, 80, 143, 0.5);
  .logo-area {
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      margin: 0 0 2px 10px;
      width: 50%;
      padding: 5%;
      border-radius: 30%;
      background-color: #f7f8fa;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    }
    .closeIcon {
      color: black;
      margin: 0 0 0 10px;
      padding: 0;
    }
  }
}
.back-bar {
  .wh(100%, 55px);
  background-color: rgb(240, 240, 240);
}
.product-list {
  position: relative;
  .tabs {
    margin: 0px auto;
    background-color: #fff;
    position: sticky;
    top: 0px;
    z-index: 99;
    box-shadow: 2px 0px 5px rgba(48, 80, 143, 0.5);
  }
  .content {
    overflow: hidden;
    overflow-y: scroll;
    .product-item {
      .fj();
      width: 100%;
      height: 120px;
      padding: 10px 0;
      border-bottom: 1px solid #dcdcdc;
      img {
        width: 140px;
        height: 120px;
        padding: 0 10px;
        .boxSizing();
      }
      .product-info {
        width: 56%;
        height: 120px;
        padding: 5px;
        text-align: left;
        .boxSizing();
        p {
          margin: 0;
        }
        .name {
          width: 100%;
          max-height: 40px;
          line-height: 20px;
          font-size: 15px;
          color: @gray2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .subtitle {
          width: 100%;
          max-height: 20px;
          padding: 10px 0;
          line-height: 25px;
          font-size: 13px;
          color: #999;
          overflow: hidden;
        }
        .price {
          color: @primary;
          font-size: 16px;
        }
      }
    }
    .empty {
      position: fixed;
      top: 73%;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>