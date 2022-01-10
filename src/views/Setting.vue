<template>
  <div class="seting-box">
    <HeadBar :name="'账号管理'" />
    <div>
      <van-field v-model="nickName" label="修改昵称" placeholder="nickname" />
      <van-field v-model="password" type="password" label="修改密码" placeholder="password" />
    </div>
    <div class="btns">
      <van-button
        round
        class="save-btn"
        color="linear-gradient(to right, #30508f, #2B32B2)"
        @click="save"
        block
      >保存</van-button>
      <van-button
        round
        class="save-btn"
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        @click="handleLogout"
        block
      >退出登录</van-button>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs } from 'vue';
import md5 from 'js-md5'; // 用于Toekn加密
import HeadBar from '@/components/HeadBar';
import { getUserInfo, EditUserInfo, logout } from '@/service/user';
import { setLocal } from '@/common/js/utils';
import { Toast } from 'vant';

export default {
  components: {
    HeadBar
  },
  setup() {
    const state = reactive({
      nickName: '',
      introduceSign: '',
      password: ''
    })

    onMounted(async () => {
      const { data } = await getUserInfo()
      state.nickName = data.nickName
      state.introduceSign = data.introduceSign
    })

    const save = async () => {
      const params = {
        introduceSign: state.introduceSign,
        nickName: state.nickName
      }
      if (state.password) {
        params.passwordMd5 = md5(state.password)
      }
      await EditUserInfo(params)
      Toast.success('保存成功')
    }

    const handleLogout = async () => {
      const { resultCode } = await logout()
      if (resultCode == 200) {
        setLocal('token', '')
        window.location.href = '/home'
      }
    }

    return {
      ...toRefs(state),
      save,
      handleLogout
    }
  }
}
</script>

<style lang="less" scoped>
.seting-box {
  .btns {
    display: flex;
    justify-content: space-around;
    .save-btn {
      width: 40%;
      margin-top: 20px;
    }
  }
}
</style>