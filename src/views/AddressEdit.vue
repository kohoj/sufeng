<template>
  <div class="address-edit-box">
    <HeadBar :name="`${type == 'add' ? '新增地址' : '编辑地址'}`" />
    <van-address-edit
      class="edit"
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="type == 'edit'"
      show-set-default
      :search-result="searchResult"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import { Toast } from 'vant';
import { areaList } from '@vant/area-data';
import { useRoute, useRouter } from 'vue-router';
import { reactive, onMounted, toRefs } from 'vue';
import { addAddress, EditAddress, DeleteAddress, getAddressDetail } from '@/service/address';

import HeadBar from '@/components/HeadBar';
export default {
  components: {
    HeadBar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      searchResult: [],
      type: 'add',
      addressId: '',
      addressInfo: {},
      from: route.query.from
    })

    // 编辑模式下，初始化地址信息
    onMounted(async () => {
      const { addressId, type, from } = route.query
      state.addressId = addressId;
      state.type = type;
      state.from = from || '';

      if (type == 'edit') {
        const { data: addressDetail } = await getAddressDetail(addressId);
        let _areaCode = '';
        // eslint-disable-next-line no-unused-vars
        let okCountyList = Object.entries(areaList.county_list).filter(([id, text]) => text == addressDetail.regionName);
        // eslint-disable-next-line no-unused-vars
        let okCityList = Object.entries(areaList.city_list).filter(([id, text]) => text == addressDetail.cityName);
        for (let i = 0; i < okCountyList.length; i++) {
          for (let j = 0; j < okCityList.length; j++) {
            okCountyList[i][0].substr(0, 4) == okCityList[j][0].substr(0, 4) ? _areaCode = okCountyList[i][0] : '';
          }
        }

        state.addressInfo = {
          id: addressDetail.addressId,
          name: addressDetail.userName,
          tel: addressDetail.userPhone,
          province: addressDetail.provinceName,
          city: addressDetail.cityName,
          county: addressDetail.regionName,
          addressDetail: addressDetail.detailAddress,
          areaCode: _areaCode,
          isDefault: !!addressDetail.defaultFlag
        }
      }
    })

    // 保存信息
    const onSave = async (content) => {
      const params = {
        userName: content.name,
        userPhone: content.tel,
        provinceName: content.province,
        cityName: content.city,
        regionName: content.county,
        detailAddress: content.addressDetail,
        defaultFlag: content.isDefault ? 1 : 0,
      }
      if (state.type == 'edit') {
        params.addressId = state.addressId;
        EditAddress(params);
      } else addAddress(params);

      Toast('保存成功')
      setTimeout(() => {
        router.back()
      }, 1000)
    }

    // 删除地址
    const onDelete = async () => {
      await DeleteAddress(state.addressId)
      Toast('删除成功')
      setTimeout(() => {
        router.back()
      }, 1000)
    }

    return {
      ...toRefs(state),
      onSave,
      onDelete,
      areaList
    }
  }
}
</script>

<style lang="less">
@import "../common/style/mixin";
.edit {
  .van-field__body {
    textarea {
      height: 26px !important;
    }
  }
}
.address-edit-box {
  .van-address-edit {
    .van-button--danger {
      background: linear-gradient(to right, #30508f, #2b32b2);
      border-color: @primary;
    }
    .van-switch--on {
      background: linear-gradient(to right, #30508f, #2b32b2);
    }
  }
}
</style>
