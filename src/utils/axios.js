import axios from 'axios';
import { Toast } from 'vant';
import router from '../router';

// 请求地址
axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? '//backend-api-02.newbee.ltd/api/v1' : '//backend-api-02.newbee.ltd/api/v1';
// 跨域请求带cookie
axios.defaults.withCredentials = true;
// 请求超时
axios.defaults.timeout = 5000;
// 规定请求为异步的，为null则为同步
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
// 通过Token实现用户登录
axios.defaults.headers['token'] = localStorage.getItem('token') || '';
// post请求时，发送json类型的数据
axios.defaults.headers.post['Content-Type'] = 'application/json';
// 响应拦截器设置，返回的数据需通过拦截处理后返回
axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.fail('服务端故障 ~');
    return Promise.reject(res);
  }

  if (res.data.resultCode != 200) {
    if (res.data.message) Toast.fail(res.data.message);
    if (res.data.resultCode == 416) { // 未登录
      router.push({ path: '/login' });
    }
    return Promise.reject(res.data);
  }
  return res.data;
})

export default axios;