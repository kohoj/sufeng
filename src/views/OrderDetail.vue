<template>
  <HeadBar :name="'订单详情'" @callback="close" />
  <div class="order-detail-box">
    <div class="order-status">
      <div class="status-item">
        <label>订单状态：</label>
        <span>{{ detail.orderStatusString }}</span>
      </div>
      <div class="status-item">
        <label>订单编号：</label>
        <span>{{ detail.orderNo }}</span>
      </div>
      <div class="status-item">
        <label>创建时间：</label>
        <span>{{ detail.createTime }}</span>
      </div>
      <van-button
        v-if="detail.orderStatus == 3"
        style="margin-bottom: 10px"
        color="#30508f"
        block
        @click="toFinish(detail.orderNo)"
      >确认收货</van-button>
      <van-button
        v-if="detail.orderStatus == 0"
        style="margin-bottom: 10px"
        color="#30508f"
        block
        @click="toPay"
      >去支付</van-button>
      <van-button
        v-if="detail.orderStatus >= 0 && detail.orderStatus < 4"
        block
        @click="toCancel(detail.orderNo)"
      >取消订单</van-button>
    </div>
    <div class="order-price">
      <div class="price-item">
        <label>商品金额：</label>
        <span>¥ {{ detail.totalPrice }}</span>
      </div>
      <div class="price-item">
        <label>配送方式：</label>
        <span>普通快递</span>
      </div>
    </div>
    <van-card
      v-for="item in detail.newBeeMallOrderItemVOS"
      :key="item.goodsId"
      style="background: #fff"
      :num="item.goodsCount"
      :price="item.sellingPrice"
      desc="包邮"
      :title="item.goodsName"
      :thumb="$filters.prefix(item.goodsCoverImg)"
    />
    <van-popup v-model:show="showPay" position="bottom" :style="{ height: '24%' }">
      <div :style="{ width: '90%', margin: '0 auto', padding: '20px 0' }">
        <van-button
          :style="{ marginBottom: '10px' }"
          color="#1989fa"
          block
          @click="handlePayOrder(detail.orderNo, 1)"
        >支付宝支付</van-button>
        <van-button color="#4fc08d" block @click="handlePayOrder(detail.orderNo, 2)">微信支付</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import { getOrderDetail, cancelOrder, confirmOrder, payOrder } from '@/service/order';
import { useRoute } from 'vue-router';
import { reactive, toRefs, onMounted } from 'vue';

import HeadBar from '@/components/HeadBar';
export default {
  name: 'OrderDetail',
  components: {
    HeadBar
  },
  setup() {
    const route = useRoute();
    const state = reactive({
      detail: {},
      showPay: false
    });

    onMounted(() => {
      init();
    });

    // 初始化页面
    const init = async () => {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      });
      const { id } = route.query;
      const { data } = await getOrderDetail(id);
      state.detail = data;
      Toast.clear();
    };

    // 取消订单
    const toCancel = (id) => {
      Dialog.confirm({ title: '确定取消？' })
        .then(() => cancelOrder(id))
        .then(res => {
          if (res.resultCode == 200) {
            setTimeout(() => (Toast('取消成功')), 1000);
            init();
          }
        }).catch(() => { Toast('再试一次') });
    };

    // 完成订单
    const toFinish = (id) => {
      Dialog.confirm({ title: '是否确认订单？' })
        .then(() => confirmOrder(id))
        .then(res => {
          if (res.resultCode == 200) {
            setTimeout(() => (Toast('确认成功')), 1000);
            init();
          }
        }).catch(() => { Toast('再试一次') });
    };

    const toPay = () => {
      state.showPay = true;
    };

    const handlePayOrder = async (id, type) => {
      Toast.loading;
      await payOrder({ orderNo: id, payType: type });
      Toast.success('支付成功');
      state.showPay = false;
      init();
    };

    const close = () => {
      Dialog.close();
    };

    return {
      ...toRefs(state),
      toCancel,
      toFinish,
      toPay,
      handlePayOrder,
      close
    }
  }
}
</script>

<style lang="less" scoped>
.order-detail-box {
  background: #f7f7f7;
  .order-status {
    background: #fff;
    padding: 20px;
    font-size: 15px;
    .status-item {
      margin-bottom: 10px;
      label {
        color: #999;
      }
    }
  }
  .order-price {
    background: #fff;
    margin: 20px 0;
    padding: 20px;
    font-size: 15px;
    .price-item {
      margin-bottom: 10px;
      label {
        color: #999;
      }
    }
  }
  .van-card {
    margin-top: 0;
  }
  .van-card__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
