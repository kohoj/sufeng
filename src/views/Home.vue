<template>
  <div>
    <ProductList />
    <Swiper :list="swiperList" />
    <div class="icon-list">
      <div v-for="(item,index) in iconList" :key="index" @click="tips">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="`#icon-${item.icon}`" />
        </svg>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="good">
      <header class="good-header">最新推荐</header>
      <van-skeleton title :row="3" :loading="loading">
        <div class="good-box">
          <div
            class="good-item"
            v-for="item in recommends"
            :key="item.goodsId"
            @click="goToDetail(item)"
          >
            <img :src="$filters.prefix(item.goodsCoverImg)" alt />
            <div class="good-desc">
              <div class="title">{{ item.goodsName }}</div>
              <p>{{ item.goodsIntro }}</p>
              <div class="price">¥ {{ item.sellingPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
    <div class="good">
      <header class="good-header">新品上线</header>
      <van-skeleton title :row="3" :loading="loading">
        <div class="good-box">
          <div
            class="good-item"
            v-for="item in newGoodses"
            :key="item.goodsId"
            @click="goToDetail(item)"
          >
            <img :src="$filters.prefix(item.goodsCoverImg)" alt />
            <div class="good-desc">
              <div class="title">{{ item.goodsName }}</div>
              <div class="price">¥ {{ item.sellingPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
    <div class="good" :style="{ paddingBottom: '100px' }">
      <header class="good-header">热门商品</header>
      <van-skeleton title :row="3" :loading="loading">
        <div class="good-box">
          <div class="good-item" v-for="item in hots" :key="item.goodsId" @click="goToDetail(item)">
            <img :src="$filters.prefix(item.goodsCoverImg)" alt />
            <div class="good-desc">
              <div class="title">{{ item.goodsName }}</div>
              <div class="price">¥ {{ item.sellingPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { getHome } from '@/service/home'
import { getLocal } from '@/common/js/utils'
import { Toast } from 'vant';

import Swiper from '@/components/Swiper';
import ProductList from '@/views/ProductList';
export default {
  name: 'home',
  components: {
    Swiper,
    ProductList
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      swiperList: [], // 轮播图列表
      isLogin: false, // 是否已登录
      hots: [],
      newGoodses: [],
      recommends: [],
      iconList: [
        {
          name: '城限独家',
          icon: 'xunzhang'
        },
        {
          name: '获奖剧本',
          icon: 'guanjun'
        },
        {
          name: '小剧本',
          icon: 'zixun'
        },
        {
          name: '演绎装扮',
          icon: 'yingshi'
        },
        {
          name: '培训服务',
          icon: 'renzheng'
        },
        {
          name: 'BGM 下载',
          icon: 'yinle'
        },
        {
          name: '展会日期',
          icon: 'rili'
        },
        {
          name: '展会邀请',
          icon: 'yaoqing'
        },
        {
          name: '小视频',
          icon: 'luxiang'
        },
        {
          name: '剧本抽奖',
          icon: 'lipin'
        },
      ],
      loading: true
    })

    const tips = () => {
      Toast('敬请期待');
    }

    onMounted(async () => {
      const token = getLocal('token');
      if (token) {
        state.isLogin = true; //加个登录小提示
      }
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      // const { data } = await getHome(); // 来自后端
      const { data: { data } } = await getHome(); // 来自mock
      state.swiperList = data.carousels;
      state.recommends = data.recommendGoodses;
      state.newGoodses = data.newGoodses;
      state.hots = data.hotGoodses;
      state.loading = false;
      Toast.clear();
    })

    const goToDetail = (item) => {
      router.push({ path: `/product/${item.goodsId}` })
    }

    return {
      ...toRefs(state),
      goToDetail,
      tips,
    }
  },
}
</script>

<style lang="less" scoped >
@import "../common/style/mixin";
.icon-list {
  margin-top: 10px;
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: 13px;
  div {
    display: flex;
    flex-direction: column;
    width: 20%;
    text-align: center;
    margin-bottom: 10px;
    .icon {
      .wh(1rem, 1rem);
      margin: 5px auto 2px;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
    .icon:active {
      transform: scale(0.8, 0.8);
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }
}
.good {
  box-shadow: 1px 0px 5px rgba(48, 80, 143, 0.3);
  .good-header {
    background: #f7f8fa;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: @primary;
    font-size: 14px;
    font-weight: 1000;
  }
  .good-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    .good-item {
      box-sizing: border-box;
      width: 50%;
      border-bottom: 1px solid #e9e9e9;
      padding: 10px 10px;
      overflow: hidden;
      img {
        display: block;
        height: 180px;
        margin: 0 auto;
      }
      .good-desc {
        text-align: center;
        font-size: 14px;
        padding: 10px 0;
        .title {
          color: @gray1;
        }
        .price {
          color: @primary;
        }
      }
      &:nth-child(2n + 1) {
        border-right: 1px solid #e9e9e9;
      }
    }
  }
}
.floor-list {
  width: 100%;
  padding-bottom: 50px;
  .floor-head {
    width: 100%;
    height: 40px;
    background: #f6f6f6;
  }
  .floor-content {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    width: 100%;
    .boxSizing();
    .floor-category {
      width: 50%;
      padding: 10px;
      border-right: 1px solid #dcdcdc;
      border-bottom: 1px solid #dcdcdc;
      .boxSizing();
      &:nth-child(2n) {
        border-right: none;
      }
      p {
        font-size: 17px;
        color: @gray2;
        &:nth-child(2) {
          padding: 5px 0;
          font-size: 13px;
          color: @primary;
        }
      }
      .floor-products {
        .fj();
        width: 100%;
        img {
          .wh(65px, 65px);
        }
      }
    }
  }
}
</style>