<template>
  <div class="product-detail">
    <HeadBar :name="'商品详情'" />
    <div class="detail-content">
      <div class="detail-swipe-wrap">
        <van-swipe class="my-swipe" indicator-color="#1b67ae">
          <van-swipe-item v-for="(item, index) in detail.goodsCarouselList" :key="index">
            <img :src="item" alt />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="product-info">
        <div class="product-title">{{ detail.goodsName || '' }}</div>
        <div class="product-desc">免邮费 顺丰快递</div>
        <div class="product-price">
          <span>￥{{ detail.sellingPrice || '' }}</span>
        </div>
      </div>
      <div class="product-intro">
        <ul>
          <li>概述</li>
          <li>参数</li>
          <li>安装服务</li>
          <li>常见问题</li>
        </ul>
        <div class="product-content" v-html="detail.goodsDetailContent || ''"></div>
      </div>
    </div>
    <van-action-bar>
      <van-action-bar-icon icon="chat" text="客服" />
      <van-action-bar-icon icon="cart" :badge="!count ? '' : count" @click="toCart" text="购物车" />
      <van-action-bar-button type="warning" @click="buyNow(false)" text="加入购物车" />
      <van-action-bar-button type="danger" @click="buyNow(true)" text="立即下单" />
    </van-action-bar>
  </div>
</template>

<script>
import { prefix } from '@/common/js/utils';
import { Toast } from 'vant';

import { getDetail } from '@/service/goods';
import { addCart } from '@/service/cart';

import { reactive, onMounted, computed, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import HeadBar from '@/components/HeadBar';
export default {
  components: {
    HeadBar
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      detail: {}
    })

    // 获取并加载商品详情，获取cart最新数据
    onMounted(async () => {
      const { id } = route.params;
      const { data } = await getDetail(id);
      data.goodsCarouselList = data.goodsCarouselList.map(i => prefix(i));
      state.detail = data;
      store.dispatch('updateCart');
    })

    // 跳转至购物车
    const toCart = () => {
      router.push({ path: '/cart' });
    }

    // 仅添加到购物车 or 至购物车下单
    const buyNow = async (buy) => {
      const { resultCode } = await addCart({
        goodsCount: 1,
        goodsId: state.detail.goodsId
      });
      if (buy) {
        toCart();
      } else {
        if (resultCode == 200) Toast.success('添加成功');
      }
      store.dispatch('updateCart');
    }

    // badge
    const count = computed(() => store.state.cartCount);

    return {
      ...toRefs(state),
      toCart,
      buyNow,
      count
    }
  }
}
</script>

<style lang="less">
@import "../common/style/mixin";
.product-detail {
  .detail-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    .fj();
    .wh(100%, 44px);
    line-height: 44px;
    padding: 0 10px;
    .boxSizing();
    color: #252525;
    background: #fff;
    border-bottom: 1px solid #dcdcdc;
    .product-name {
      font-size: 14px;
    }
  }
  .detail-content {
    height: calc(100vh - 50px);
    overflow: hidden;
    overflow-y: auto;
    .detail-swipe-wrap {
      .my-swipe .van-swipe-item {
        img {
          width: 100%;
        }
      }
    }
    .product-info {
      padding: 0 10px;
      .product-title {
        font-size: 18px;
        text-align: left;
        color: #333;
      }
      .product-desc {
        font-size: 14px;
        text-align: left;
        color: #999;
        padding: 5px 0;
      }
      .product-price {
        .fj();
        span:nth-child(1) {
          color: #f63515;
          font-size: 22px;
        }
        span:nth-child(2) {
          color: #999;
          font-size: 16px;
        }
      }
    }
    .product-intro {
      width: 100%;
      padding-bottom: 50px;
      ul {
        .fj();
        width: 100%;
        margin: 10px 0;
        li {
          flex: 1;
          padding: 5px 0;
          text-align: center;
          font-size: 15px;
          border-right: 1px solid #999;
          box-sizing: border-box;
          &:last-child {
            border-right: none;
          }
        }
      }
      .product-content {
        padding: 0 20px;
        img {
          width: 100%;
        }
      }
    }
  }
  .van-action-bar-button--warning {
    background: linear-gradient(to right, #399cca, @primary);
  }
  .van-action-bar-button--danger {
    background: linear-gradient(to right, @primary, #2b32b2);
  }
}
</style>
