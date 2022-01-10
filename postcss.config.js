// 具体配置可以去 postcss-pxtorem 仓库看看文档
module.exports = {
  "plugins": {
    //将px转为rem，大写PX不会被转换
    "postcss-pxtorem": {
      rootValue: 37.5, // Vant 官方根字体大小
      propList: ['*'],
      selectorBlackList: ['.norem'] // 屏蔽掉.norem开头的class
    }
  }
}