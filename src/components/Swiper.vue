<template>
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#30508f" lazy-render>
    <van-swipe-item v-for="(item, index) in list" :key="index">
      <img :src="item.carouselUrl" alt @click="goTo(item.redirectUrl)" />
    </van-swipe-item>
  </van-swipe>
</template>

<script>
export default {
  props: {
    list: []
  },
  methods: {
    goTo(url) {
      window.open(url);
    }
  }
}
</script>

<style lang='less' scoped>
.my-swipe {
  box-shadow: 1px 0px 5px rgba(48, 80, 143, 0.3);
  height: 35%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
