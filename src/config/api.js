/**
 * API配置
 */

// API配置
export const API_CONFIG = {
  // 是否使用mock数据 (true: 使用mock, false: 使用真实API)
  USE_MOCK: true,

  // 真实API基础URL
  BASE_URL: 'http://localhost:8080/v1',

  // API端点
  ENDPOINTS: {
    USERS: '/user',
    USER_BY_ID: '/user',
    CREATE_USER: '/user',
    DELETE_USER: '/user',
  },

  // 请求超时时间 (毫秒)
  TIMEOUT: 10000,
};

// 构建完整的API URL
export const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(API_CONFIG.BASE_URL + endpoint);

  // 添加查询参数
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });

  return url.toString();
};
