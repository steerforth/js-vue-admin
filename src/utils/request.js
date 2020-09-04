import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers['zhile-cod-token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const token = response.headers['zhile-cod-token']
    if(token) {
        //将续期的TOKEN存起来
       store.dispatch('user/storeToken',token)
    }
    const res = response.data

    //大文件直接返回数据
    if(response.config.responseType === 'blob'){
      return res
    }

    if (!res.success) {
      Message({
        message: res.errMsg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.errMsg || 'Error'))
    } else {
      return res.body
    }
  },
  error => {
    console.log('err:' + error.message) // for debug

    let tip = null;
    if(error.response){
      switch (error.response.status) {
      	case 500:
      		tip = "服务器系统内部错误"
      		break;
      	case 401:
      		tip = "未授权,请重新登录"
      		break;
      	case 403:
          tip = "无权限执行此操作"
      		break;
      	case 404:
          tip = "请求的路径不存在"
      		break;
      	case 504:
          tip = "网络超时"
      		break;
      	default:
      		tip = "未知错误:status=" + error.response.status
      }
    }

    Message({
      message: tip || error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
