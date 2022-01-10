<template>
  <div class="nav-bar van-hairline--top">
    <ul class="nav-list">
      <router-link class="nav-list-item active" to="/home">
        <van-icon name="wap-home" size="0.7rem" />
        <span>首页</span>
      </router-link>
      <router-link class="nav-list-item" to="/category">
        <van-icon name="wap-nav" size="0.7rem" />
        <span>分类</span>
      </router-link>
      <router-link class="nav-list-item" to="/cart">
        <van-icon name="cart" size="0.7rem" :badge="!count ? '' : count" />
        <span>购物车</span>
      </router-link>
      <router-link class="nav-list-item" to="/user">
        <van-icon name="manager" size="0.7rem" />
        <span>我的</span>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { getLocal } from '@/common/js/utils'
export default {
  setup() {
    const route = useRoute()
    const store = useStore()
    onMounted(() => {
      const token = getLocal('token')
      const path = route.path
      if (token && !['/home', '/category'].includes(path)) {
        store.dispatch('updateCart')
      }
    })
    const count = computed(() => {
      return store.state.cartCount
    })

    return {
      count
    }
  }
}
</script>

<style lang="less" scoped >
@import "../common/style/mixin";
.nav-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 5px 0;
  z-index: 1000;
  box-shadow: 1px 0px 5px rgba(48, 80, 143, 0.5);
  background: rgba(255, 255, 255, 0.95);
  transform: translateZ(0);
  .nav-list {
    width: 100%;
    .fj();
    flex-direction: row;
    padding: 0;
    .nav-list-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      text-align: center;
      color: @gray4;
      &.router-link-active {
        color: @primary;
      }
      i {
        text-align: center;
        font-size: 22px;
      }
      span {
        font-size: 12px;
      }
      .van-icon-cart {
        margin: 0 auto;
        margin-bottom: 2px;
      }
    }
  }
}
</style>
