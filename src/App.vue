<template>
  <div id="app">
    <router-view class="router-view" v-slot="{ Component }">
      <transition :name="transitionName">
        <keep-alive include="user,home,cart,category">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
    <NavBar v-show="$route.meta.index === 1" />
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar';

export default {
  components: { NavBar },
  setup() {
    const router = useRouter();
    const state = reactive({
      transitionName: ''
    });
    router.beforeEach((to, from) => { // 导航卫士，在任何导航前执行
      if (from.name == "product-list" && to.name == "category") {
        state.transitionName = 'do-opacity';
      } else if (to.meta.index > from.meta.index) {
        state.transitionName = 'slide-left'; // 向左滑动
      } else if (to.meta.index < from.meta.index) {
        // 由次级到主级
        state.transitionName = 'slide-right';
      } else {
        state.transitionName = 'do-opacity'; // 同级无过渡效果
      }
    })

    return {
      ...toRefs(state),
    }
  }
}
</script>

<style lang="less">
html,
body {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}
#app {
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  // 抗锯齿化
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.router-view {
  width: 100%;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: 0 auto;
  -webkit-overflow-scrolling: touch;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.do-opacity-enter-active,
.do-opacity-leave-active {
  height: 100%;
  will-change: transform, opacity; /* 告诉浏览器什么属性、什么元素将会发生变化，可以对这些操作进行可能性的优化，由此提高CSS动画的执行效率。 */
  transition: all 0.2s ease-in-out;
  position: absolute;
}
.do-opacity-enter-from,
.do-opacity-leave-to {
  opacity: 0;
}
.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
.slide-left-enter-to,
.slide-left-leave-from,
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0%);
}
.slide-left-leave-to,
.slide-right-enter-from {
  transform: translateX(-100%);
}
.slide-left-2step-enter-from {
  transform: translateX(200%);
}
.slide-left-2step-enter-to,
.slide-left-2step-leave-from {
  transform: translateX(0%);
}
.slide-left-2step-leave-to {
  transform: translateX(-200%);
}
.van-badge--fixed {
  z-index: 1000;
}
</style>
