import axios from '../utils/axios';
import mockReq from '../utils/mockAjax';

export function getDetail(id) {
  return axios.get(`/goods/detail/${id}`);
}

export function search(params) {
  return axios.get('/search', { params });
}

// export function getCategory() {
//   return axios.get('/categories');
// }

export function getCategory() {
  return mockReq.get('/categories');
}