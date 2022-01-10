<template>
  <div ref="wrapper" class="scroll-wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
export default {
  props: {
    //  * 1 滚动时，派发scroll事件，会截流；
    //  * 2 滚动时，实时派发scroll事件，不会截流；
    //  * 3 除实时派发scroll事件，在swipe的情况下仍能实时派发scroll事件。
    probeType: {
      type: Number,
      default: 1
    },
    // 点击列表是否派发click事件
    click: {
      type: Boolean,
      default: true
    },
    // 是否开启横向滚动
    scrollX: {
      type: Boolean,
      default: false
    },
    // 是否派发滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 列表的数据
    scrollData: {
      type: Array,
      default: null
    },
    // 是否派发滚动到底部的事件，用于上拉加载
    pullup: {
      type: Boolean,
      default: false
    },
    // 是否派发顶部下拉的事件，用于下拉刷新
    pulldown: {
      type: Boolean,
      default: false
    },
    // 是否派发列表滚动开始的事件
    beforeScroll: {
      type: Boolean,
      default: false
    },
    // 当数据更新后，刷新scroll的延时
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    // 初始化 better-scroll
    this.$nextTick(() => {
      this.initScroll()
    })
  },
  methods: {
    initScroll() {
      // better-scroll 初始化
      this.bs = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // this.bs.on('scroll', () => {
      //   console.log('scrolling');
      // })
    }
  },
  updated() {
    this.bs.refresh();
  },
}
</script>

<style lang="less" scoped>
.scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  touch-action: pan-y;
}
</style>