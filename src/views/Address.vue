<template>
  <div class="address-box">
    <HeadBar :name="'地址管理'" :back="from == 'create-order' ? '' : '/user'" />
    <div class="address-item">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="select"
      />
    </div>
  </div>
</template>

<script>
import { getAddressList } from '@/service/address';
import { reactive, toRefs, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import HeadBar from '@/components/HeadBar';
export default {
  components: {
    HeadBar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      chosenAddressId: '1',
      list: [],
      from: route.query.from
    })

    onMounted(async () => {
      const { data } = await getAddressList();
      if (!data) {
        state.list = [];
        return
      }
      state.list = data.map(item => {
        return {
          id: item.addressId,
          name: item.userName,
          tel: item.userPhone,
          address: `${item.provinceName} ${item.cityName} ${item.regionName} ${item.detailAddress}`,
          isDefault: !!item.defaultFlag //"!!"将表达式进行强制转化为bool值
        }
      })
    })

    const onAdd = () => {
      router.push({ path: '/address-edit', query: { type: 'add', from: state.from } })
    }

    const onEdit = (item) => {
      router.push({ path: 'address-edit', query: { type: 'edit', addressId: item.id, from: state.from } })
    }

    const select = (item) => {
      if (state.from == 'mine') return;
      router.push({ path: 'create-order', query: { addressId: item.id, from: state.from } });
    }

    return {
      ...toRefs(state),
      onAdd,
      onEdit,
      select
    }
  }
}
</script>

<style lang="less">
@import "../common/style/mixin";
.address-box {
  .van-radio__icon {
    display: none;
  }
  .address-item {
    .van-button {
      background: linear-gradient(to right, #30508f, #2b32b2);
      border-color: @primary;
    }
  }
}
</style>
