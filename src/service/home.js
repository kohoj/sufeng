// import axios from '../utils/axios'

// export function getHome() {
//   return axios.get('/index-infos');
// }

import mockReq from '../utils/mockAjax'
export function getHome() {
  return mockReq.get('/homeData');
}