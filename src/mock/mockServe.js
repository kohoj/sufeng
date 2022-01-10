import Mock from 'mockjs';
//引入JSON数据
//webpack默认对外暴露的格式：图片、JSON
import homeData from './homeData.json';
import categories from './categories.json';

//mock数据：参数1：请求地址；参数2：请求数据
Mock.mock("/mock/homeData", { data: homeData });
Mock.mock("/mock/categories", { data: categories });