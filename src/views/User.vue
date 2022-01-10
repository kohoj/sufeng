<template>
  <div class="user-box">
    <HeadBar :noback="true" :name="'我的'" />
    <van-skeleton title :avatar="true" :row="3" :loading="loading">
      <div class="user-info">
        <div class="info">
          <!-- 随机头像 -->
          <img src="https://api.prodless.com/avatar.png" />
          <div class="user-desc">
            <span>昵称：{{ user.nickName }}</span>
            <span>ID：{{ user.loginName }}</span>
          </div>
        </div>
      </div>
    </van-skeleton>
    <ul class="user-list">
      <li class="van-hairline--bottom" @click="goTo('/order')">
        <span>订单管理</span>
        <van-icon name="arrow" />
      </li>
      <li class="van-hairline--bottom" @click="goTo('/setting')">
        <span>账号管理</span>
        <van-icon name="arrow" />
      </li>
      <li class="van-hairline--bottom" @click="goTo('/address', { from: 'mine' })">
        <span>地址管理</span>
        <van-icon name="arrow" />
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs } from 'vue';
import { getUserInfo } from '@/service/user';
import { useRouter } from 'vue-router';

import HeadBar from '@/components/HeadBar';

export default {
  components: {
    HeadBar
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      user: {},
      loading: true
    })

    onMounted(async () => {
      const { data } = await getUserInfo()
      state.user = data
      state.loading = false
    })

    const goTo = (route, query) => {
      router.push({ path: route, query: query || {} })
    }

    return {
      ...toRefs(state),
      goTo
    }
  }
}
</script>

<style lang="less" scoped>
@import "../common/style/mixin";
.user-box {
  .user-header {
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
    .user-name {
      font-size: 14px;
    }
  }
  .user-info {
    width: 90%;
    margin: 10px auto;
    height: 150px;
    background: linear-gradient(to right, #30508f, #2b32b2);
    box-shadow: 0 2px 5px @gray3;
    border-radius: 6px;
    .info {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      padding: 25px 20px;
      .boxSizing();
      img {
        position: absolute;
        .wh(60px, 60px);
        border-radius: 50%;
        top: 50%;
        transform: translateY(-50%);
        left: 10%;
        box-shadow: 0 2px 5px @gray3;
      }
      .user-desc {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 30%;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        line-height: 20px;
        font-size: 14px;
        span {
          color: #ddd;
          font-size: 15px;
          padding: 2px 0;
        }
      }
      .account-setting {
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 13px;
        color: #fff;
        .van-icon-setting-o {
          font-size: 16px;
          vertical-align: -3px;
          margin-right: 4px;
        }
      }
    }
  }
  .user-list {
    padding: 0 20px;
    margin-top: 20px;
    li {
      height: 40px;
      line-height: 40px;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      .van-icon-arrow {
        margin-top: 13px;
      }
    }
  }
}
</style>
