export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  } else {
    return null
  }
}

// localStorage
export const getLocal = (name) => {
  return localStorage.getItem(name)
}

export const setLocal = (name, value) => {
  localStorage.setItem(name, value)
}

// 图片前缀方法
export const prefix = (url) => {
  if (url && url.startsWith('http')) {
    return url
  } else {
    url = `http://backend-api-01.newbee.ltd${url}`
    return url
  }
}
