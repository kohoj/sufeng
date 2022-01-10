<template>
  <div class="cart-box">
    <HeadBar :name="'购物车'" />
    <div class="cart-body">
      <van-checkbox-group @change="groupChange" v-model="checkedId">
        <van-swipe-cell :right-width="50" v-for="(item, index) in list" :key="index">
          <div v-if="isKept(item.goodsCount, item.cartItemId)">
            <div class="goods-item">
              <van-checkbox :name="item.cartItemId" />
              <div class="goods-img" @click="goTo('toDetail', item)">
                <img :src="$filters.prefix(item.goodsCoverImg)" alt />
              </div>
              <div class="goods-desc">
                <div class="goods-title">
                  <span>{{ item.goodsName }}</span>
                </div>
                <div class="goods-btn">
                  <div class="price">¥{{ item.sellingPrice }}</div>
                  <van-stepper
                    integer
                    :min="0"
                    :max="5"
                    v-model="item.goodsCount"
                    :name="item.cartItemId"
                    @change="onChange"
                  />
                </div>
              </div>
            </div>
          </div>
          <template #right>
            <van-button
              square
              icon="delete"
              type="danger"
              class="delete-button"
              @click="deleteGoods(item.cartItemId)"
            />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <van-submit-bar
      v-if="list.length"
      class="submit-all van-hairline--top"
      :price="total * 100"
      button-text="结算"
      @submit="onSubmit"
    >
      <van-checkbox @click="allCheck" v-model:checked="checkAll">全选</van-checkbox>
    </van-submit-bar>
    <div class="empty" v-else>
      <Doggy class="doggy" />
      <div class="title">这还没有东西哦</div>
      <van-button round color="#1b67ae" type="primary" @click="goTo('goHome')" block>这就去逛</van-button>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { getCart, deleteCartItem, modifyCart } from '@/service/cart';

import HeadBar from '@/components/HeadBar';
import Doggy from '@/components/Doggy';
export default {
  components: {
    HeadBar,
    Doggy
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      checked: false,
      list: [],
      all: false,
      checkedId: [],
      checkAll: true,
    })

    onMounted(() => {
      init();
    })

    // 初始化页面
    const init = async () => {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      const { data } = await getCart({ pageNumber: 1 });
      state.list = data;
      state.checkedId = data.map(item => item.cartItemId);
      Toast.clear();
    }

    // 按下+-健，触发数据变更
    const onChange = async (value, detail) => {
      if (value >= 5) {
        Toast.fail('超出单个商品的最大购买数量');
        return
      }
      // if (state.list.filter(item => item.cartItemId == detail.name)[0].goodsCount == value) return

      Toast.loading({ message: '修改中...', forbidClick: true });
      await modifyCart({
        cartItemId: detail.name,
        goodsCount: value
      });
      state.list.forEach(item => {
        if (item.cartItemId == detail.name) item.goodsCount = value;
      })
      Toast.clear();
    }

    // 计算总价
    const total = computed(() => {
      let sum = 0;
      let _list = state.list.filter(item => state.checkedId.includes(item.cartItemId));
      _list.forEach(item => {
        sum += item.goodsCount * item.sellingPrice;
      })
      return sum;
    })

    // 提交商品id至结算组件
    const onSubmit = async () => {
      if (state.checkedId.length == 0) {
        Toast.fail('请选择需结算的商品');
        return
      }
      const params = JSON.stringify(state.checkedId);
      router.push({ path: '/create-order', query: { cartItemIds: params } })
    }

    // 计数器变为0后，清除此商品
    const isKept = (count, id) => {
      if (count) {
        return true
      } else {
        deleteGoods(id);
        return false;
      }
    }
    // 直接清除商品
    const deleteGoods = async (id) => {
      await deleteCartItem(id);
      store.dispatch('updateCart');
      init();
    }

    // 点亮所有选择框后，自动点亮全选框
    const groupChange = (checkedId) => {
      if (checkedId.length == state.list.length) {
        state.checkAll = true;
      } else {
        state.checkAll = false;
      }
      state.checkedId = checkedId;
    }
    // 点亮全选框后，点亮所有选择框；熄灭全选框后，熄灭所有选择框
    const allCheck = () => {
      if (!state.checkAll) {
        state.checkedId = state.list.map(item => item.cartItemId);
      } else {
        state.checkedId = [];
      }
    }

    // 主动跳转
    const goTo = (toWhere, item) => {
      if (toWhere == 'toDetail') {
        router.push({ path: `/product/${item.goodsId}`, from: 'create-order' })
      } else router.push({ path: '/home' });
    }

    return {
      ...toRefs(state),
      total,
      goTo,
      onChange,
      onSubmit,
      isKept,
      deleteGoods,
      groupChange,
      allCheck,
    }
  }
}
</script>

<style lang="less">
@import "../common/style/mixin";
.cart-box {
  .cart-header {
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
    .cart-name {
      font-size: 14px;
    }
  }
  .cart-body {
    margin: 16px 0 100px 0;
    padding-left: 10px;
    .goods-item {
      display: flex;
      .goods-img {
        img {
          .wh(100px, 100px);
        }
      }
      .goods-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 20px;
        .goods-title {
          display: flex;
          justify-content: space-between;
        }
        .goods-btn {
          display: flex;
          justify-content: space-between;
          .price {
            font-size: 16px;
            color: red;
            line-height: 28px;
          }
          .van-icon-delete {
            font-size: 20px;
            margin-top: 4px;
          }
        }
      }
    }
    .delete-button {
      width: 50px;
      height: 100%;
    }
  }
  .empty {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    margin-top: 200px;
    .doggy {
      position: fixed;
      top: 63%;
      left: 50%;
      transform: translateX(-50%);
    }
    .title {
      font-size: 16px;
      margin: 20px auto;
      padding-top: 50px;
    }
  }
  .submit-all {
    margin-bottom: 55px;
    .van-checkbox {
      margin: 5px 0 0 10px;
    }
    .van-submit-bar__text {
      margin: 0 10px 0 0;
    }
    .van-submit-bar__button {
      background: linear-gradient(to right, @primary, #2b32b2);
    }
  }
  .van-checkbox__icon--checked .van-icon {
    background-color: @primary;
    border-color: @primary;
  }
}
</style>
