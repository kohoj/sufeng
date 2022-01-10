import axios from '../utils/axios'

export function addCart(params) {
  return axios.post('/shop-cart', params);
}

export function modifyCart(params) {
  return axios.put('/shop-cart', params);
}

export function getCart(params) {
  return axios.get('/shop-cart', { params });
}

export function deleteCartItem(id) {
  return axios.delete(`/shop-cart/${id}`);
}

// 根据购物项id数组查询购物项明细
export function getByCartItemIds(params) {
  return axios.get('/shop-cart/settle', { params });
}

