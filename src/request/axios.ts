/**
 * axios 请求封装
 *  @author Wang Boxin
 *  @timer 2023-05-04
 */

import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { useRouter } from 'vue-router';

import { ElMessage } from 'element-plus/lib/components/index.js';

import { parseQuery } from "@/utils/index";

interface customOptionsConfig {
  repeat_request_cancel?: boolean;
};



// 存储正在padding中得请求
const pendingMap = new Map();

const LoadingInstance = {
  _target: null, // 保存Loading实例
  _count: 0,
};

const reAxios = (axiosConfig: AxiosRequestConfig, customOptions?: customOptionsConfig) => {
  const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASEURL,
    timeout: 10000,
    withCredentials: true,
  });

  // 自定义配置
  const customOption = Object.assign(
    {
      repeatRequestCancel: true, // 是否开启取消重复请求, 默认为 true
      loading: false, // 是否开启loading层效果, 默认为false
      errorMessageShow: true, // 是否开启接口错误信息展示，默认为true
      codeMessageShow: true, // 是否开启code不为0时的信息提示, 默认为false
      reductDataFormat: true, // 是否开启简洁的数据结构响应, 默认为true
      loadingStatus: false // loading是否未打开状态
    },
    customOptions
  );

  const router = useRouter();

  service.interceptors.request.use(
    (config) => {
      removePending(config);
      customOption.repeatRequestCancel && addPending(config);
      (config.headers as AxiosRequestHeaders)['Content-Type'] =
        'application/x-www-form-urlencoded;charset=UTF-8';

      // 自动携带token
      if (typeof window !== 'undefined') {
        // (config.headers as AxiosRequestHeaders).Authorization = getTokenAUTH();
      }

      if (customOption.loading) {
        LoadingInstance._count++;
        if (LoadingInstance._count === 1) {
          //   LoadingInstance._target = ElLoading.service();
        }
      }
      return config;
    },
    (error) => {
      customOption.errorMessageShow && httpErrorStatusHandle(error); // 处理错误状态码
      return Promise.reject(error); // 错误继续返回给到具体页面
    }
  );

  service.interceptors.response.use(
    (response) => {
      removePending(response.config);
      customOption.loading && closeLoading(customOption); // 关闭loading

      if (
        customOption.codeMessageShow &&
        response.status === 200 &&
        response.data &&
        response.data.status !== 0
      ) {
        if (response.data.status === 401) {
          router.push({ name: 'LoginForm'});
        };

        if(response.data.status === 403 && !customOption.loadingStatus) {
          ElMessage({
            message: response.data.msg,
            onClose: () => customOption.loadingStatus = false
          })
        };
        return response.data; // code不等于0, 页面具体逻辑就不执行了
      }
      return customOption.reductDataFormat ? response.data : response;
    },
    (error) => {
      error.config && removePending(error.config);
      customOption.loading && closeLoading(customOption); // 关闭loading
      customOption.errorMessageShow && httpErrorStatusHandle(error); // 处理错误状态码
      return Promise.reject(error);
    }
  );

  return service(axiosConfig);
};

/**
 * 生成每个请求唯一的键
 * @param config 请求得配置
 * @returns Array
 */
const getPendingKey = (config: AxiosRequestConfig) => {
  let { url, method, data } = config;
  try {
    if (typeof data === 'string') {
      data = parseQuery(data);
    }
    return [url, method, JSON.stringify(data)].join('&');
  } catch (error) {
    throw 'getPendingKey func error' + error;
  }
};

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param config
 */
const addPending = (config: AxiosRequestConfig) => {
  const pendingKey = getPendingKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel);
      }
    });
};

/**
 * 删除重复的请求
 * @param config
 */
const removePending = (config: AxiosRequestConfig) => {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey);
    cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
  }
};

const closeLoading = (_options: { loading: boolean }) => {
  if (_options.loading && LoadingInstance._count > 0) {
    LoadingInstance._count--;
  }
  if (LoadingInstance._count === 0) {
    //   LoadingInstance._target.close();
    //   LoadingInstance._target = null;
  }
};

const httpErrorStatusHandle = (error: any) => {
  if (axios.isCancel(error)) {
    throw '请求的重复请求：' + error.message;
  };

  let message = '';

  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = '接口重定向了！';
        break;
      case 400:
        message = '参数不正确！';
        break;
      case 401:
        message = '您未登录，或者登录已经超时，请先登录！';
        break;
      case 403:
        message = '您没有权限操作！';
        break;
      case 404:
        message = `请求地址出错: ${error.response.config.url}`;
        break; // 在正确域名下
      case 408:
        message = '请求超时！';
        break;
      case 409:
        message = '系统已存在相同数据！';
        break;
      case 500:
        message = '服务器内部错误！';
        break;
      case 501:
        message = '服务未实现！';
        break;
      case 502:
        message = '网关错误！';
        break;
      case 503:
        message = '服务不可用！';
        break;
      case 504:
        message = '服务暂时无法访问，请稍后再试！';
        break;
      case 505:
        message = 'HTTP版本不受支持！';
        break;
      default:
        message = '异常问题，请联系管理员！';
        break;
    }
  }
  if (error.message.includes('timeout')) {
    message = '网络请求超时！';
  }
  if (error.message.includes('Network')) {
    message = window.navigator.onLine ? '服务端异常！' : '您断网了！';
  };

  console.log(message)
};

export default reAxios;
