<template>
  <div class="order-box">
    <HeadBar :name="'订单管理'" :back="'/user'" />
    <van-tabs
      @click="switchTab"
      :color="'#30508f'"
      :title-active-color="'#30508f'"
      class="order-tab"
      v-model="status"
    >
      <van-tab title="全部" name></van-tab>
      <van-tab title="待付款" name="0"></van-tab>
      <van-tab title="待确认" name="1"></van-tab>
      <van-tab title="待发货" name="2"></van-tab>
      <van-tab title="已发货" name="3"></van-tab>
      <van-tab title="交易完成" name="4"></van-tab>
    </van-tabs>
    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="order-list-refresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          @offset="10"
        >
          <div
            v-for="(item, index) in list"
            :key="index"
            class="order-item-box"
            @click="goTo(item.orderNo)"
          >
            <div class="order-item-header">
              <span>创建于 {{ item.createTime }}</span>
              <span>{{ item.orderStatusString }}</span>
            </div>
            <van-card
              v-for="one in item.newBeeMallOrderItemVOS"
              :key="one.orderId"
              :num="one.goodsCount"
              :price="one.sellingPrice"
              desc="包邮"
              :title="one.goodsName"
              :thumb="$filters.prefix(one.goodsCoverImg)"
            />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { getOrderList } from '@/service/order';
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';

import HeadBar from '@/components/HeadBar';
export default {
  components: {
    HeadBar
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      status: '',
      loading: false,
      finished: false,
      refreshing: false,
      list: [],
      page: 1,
      totalPage: 0
    })

    // 切换状态标签
    const switchTab = (name) => {
      state.status = name;
      onRefresh();
    }

    // 进入更新页面状态
    const onRefresh = () => {
      state.refreshing = true;
      state.finished = false;
      state.loading = true;
      state.page = 1;
      onLoad();
    }

    // 判断：拼接页面 or 重载页面
    const onLoad = () => {
      if (!state.refreshing && state.page < state.totalPage) state.page++;
      if (state.refreshing) {
        state.list = [];
        state.refreshing = false;
      }
      init();
    }

    // 初始化数据
    const init = async () => {
      const { data, data: { list } } = await getOrderList({ pageNumber: state.page, status: state.status });
      state.list = state.list.concat(list);
      state.totalPage = data.totalPage;
      state.loading = false;
      if (state.page >= data.totalPage) state.finished = true;
    }

    // 主动跳转：订单详情页
    const goTo = (id) => {
      router.push({ path: '/order-detail', query: { id } })
    }

    return {
      ...toRefs(state),
      switchTab,
      goTo,
      onLoad,
      onRefresh
    }
  }
}
</script>

<style lang="less" scoped>
@import "../common/style/mixin";
.order-box {
  .order-header {
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
    .order-name {
      font-size: 14px;
    }
  }
  .order-tab {
    position: fixed;
    left: 0;
    z-index: 1000;
    width: 100%;
    border-bottom: 1px solid #e9e9e9;
  }
  .skeleton {
    margin-top: 60px;
  }
  .content {
    height: calc(~"(100vh - 70px)");
    overflow: hidden;
    overflow-y: scroll;
    margin-top: 34px;
  }
  .order-list-refresh {
    .van-card__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .van-pull-refresh__head {
      background: #f9f9f9;
    }
    .order-item-box {
      margin: 20px 10px;
      background-color: #fff;
      .order-item-header {
        padding: 10px 20px 0 20px;
        display: flex;
        justify-content: space-between;
      }
      .van-card {
        background-color: #fff;
        margin-top: 0;
      }
    }
  }
}
</style>
