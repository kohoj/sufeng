<template>
  <div class="login">
    <HeadBar :name="isLogin ? '登录' : '注册'" :back="'/home'" />
    <Doggy class="doggy" />
    <van-form @submit="onSubmit" class="login-body">
      <van-field
        v-model="username"
        name="username"
        label="账号"
        placeholder="请输入手机号"
        @blur="blurred($event)"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="输入密码"
        @blur="blurred($event)"
        :rules="[{ required: true }]"
      />
      <van-field
        v-if="!isLogin"
        v-model="password1"
        type="password"
        name="password1"
        label="确认密码"
        placeholder="请再输入一次"
        @blur="blurred($event)"
        :rules="[{ required: true }]"
      />
      <van-field
        center
        clearable
        label="验证码"
        placeholder="输入验证码"
        v-model="verify"
        @blur="blurred($event)"
        :rules="[{ required: true }]"
      >
        <template #button>
          <!-- 每次切换都更新验证码组件 -->
          <ImageVerify v-if="isLogin" ref="verifyRef" />
          <ImageVerify v-else ref="verifyRef" />
        </template>
      </van-field>
      <div style="margin: 16px;">
        <div class="link-login" @click="toggle(isLogin ? false : true)">
          <span v-if="isLogin" style="color:#555">还没有账号？</span>
          {{ isLogin ? '注册' : '已有账号' }}
        </div>
        <van-button class="btn" round block native-type="submit">{{ isLogin ? '登录' : '注册' }}</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import { login, register } from '@/service/user';
import { setLocal } from '@/common/js/utils';
import md5 from 'js-md5'; // 用于Toekn加密
import { Toast } from 'vant';

import HeadBar from '@/components/HeadBar';
import ImageVerify from '@/components/ImageVerify';
import Doggy from '../components/Doggy.vue';

export default {
  setup() {
    const verifyRef = ref(null);
    const state = reactive({
      isLogin: true,
      username: '',
      password: '',
      password1: '',
      imgCode: '',
      verify: ''
    })

    // 输入框失焦震动
    const blurred = (event) => {
      if (!event.target.value) {
        event.target.classList.toggle('toShake');
      }
    };

    // 切换登录/注册状态
    const toggle = (x) => {
      state.isLogin = x;
      state.verify = '';
    }

    // 提交登录/注册表单
    const onSubmit = async (values) => {
      // 再次输入密码
      if (!state.isLogin) {
        if (state.password != state.password1) {
          Toast.fail('请再次核对密码')
          return
        }
      }
      // 校验验证码
      state.imgCode = verifyRef.value.imgCode || '';
      if (state.verify.toLowerCase() != state.imgCode.toLowerCase()) {
        Toast.fail('验证码有误')
        return
      }
      // 将Token存至localStorage
      if (state.isLogin) {
        const { data } = await login({
          "loginName": values.username,
          "passwordMd5": md5(values.password)
        })
        setLocal('token', data);
        // 需要刷新页面，否则 axios.js文件里的 token 不会被重置
        window.location.href = '/';
      } else {
        await register({
          "loginName": values.username,
          "password": values.password
        })
        Toast.success('注册成功');
        state.isLogin = true;
        state.verify = '';
      }
    }

    return {
      ...toRefs(state),
      toggle,
      onSubmit,
      verifyRef,
      blurred
    }
  },
  components: {
    HeadBar,
    ImageVerify,
    Doggy,
  }
}
</script>

<style lang="less">
.toShake {
  animation: shaking 0.3s ease-in-out;
}
@keyframes shaking {
  0% {
    transform: translateX(3px);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-6px);
  }
  80% {
    transform: translateX(6px);
  }
  100% {
    transform: translateX(-3px);
  }
}
.login {
  .btn {
    background-color: #30508f;
    color: #eee;
  }
  .btn:active {
    transform: scale(0.95);
    transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  .doggy {
    position: fixed;
    top: 7%;
    left: 50%;
    transform: translateX(-50%);
  }
  .login-body {
    margin: 65% 20px;
    .link-login {
      font-size: 14px;
      margin-bottom: 20px;
      color: #1989fa;
      display: inline-block;
    }
  }
  .verify-bar-area {
    margin-top: 24px;
    .verify-left-bar {
      border-color: #1b67ae;
    }
    .verify-move-block {
      background-color: #1b67ae;
      color: #fff;
    }
  }
  .verify {
    > div {
      width: 100%;
    }
    display: flex;
    justify-content: center;
    .cerify-code-panel {
      margin-top: 16px;
    }
    .verify-code {
      width: 40% !important;
      float: left !important;
    }
    .verify-code-area {
      float: left !important;
      width: 54% !important;
      margin-left: 14px !important;
      .varify-input-code {
        width: 90px;
        height: 38px !important;
        border: 1px solid #e9e9e9;
        padding-left: 10px;
        font-size: 16px;
      }
      .verify-change-area {
        line-height: 44px;
      }
    }
  }
}
</style>
