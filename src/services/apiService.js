/**
 * 真实API服务
 * 处理与后端API的通信
 */

import { API_CONFIG, buildApiUrl } from '../config/api';

/**
 * 通用API请求函数
 * @param {string} url - 请求URL
 * @param {Object} options - 请求选项
 * @returns {Promise} API响应
 */
const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    timeout: API_CONFIG.TIMEOUT,
  };

  const requestOptions = { ...defaultOptions, ...options };

  try {
    console.log(`🌐 API Request: ${requestOptions.method || 'GET'} ${url}`);

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ API Response:`, data);

    return data;
  } catch (error) {
    console.error(`❌ API Error:`, error);
    throw error;
  }
};

/**
 * 获取用户列表（分页）
 * @param {Object} params - 查询参数
 * @param {Object} params.pagination - 分页参数 {current, pageSize}
 * @param {Object} params.filters - 筛选参数
 * @param {Object} params.sorter - 排序参数 {field, order}
 * @returns {Promise} 用户列表数据
 */
export const getUsersFromApi = async (params = {}) => {
  const { pagination = { current: 1, pageSize: 10 }, sorter = {} } = params;

  // 构建查询参数
  const queryParams = {
    page: pagination.current - 1, // 后端通常从0开始
    size: pagination.pageSize,
  };

  // 添加排序参数
  if (sorter.field) {
    queryParams.sort = `${sorter.field},${sorter.order === 'descend' ? 'desc' : 'asc'}`;
  }

  const url = buildApiUrl(API_CONFIG.ENDPOINTS.USERS_PAGINATION, queryParams);

  try {
    const response = await apiRequest(url);

    // 假设后端返回格式为: { content: [...], totalElements: number, number: number, size: number }
    return {
      data: response.content || [],
      pagination: {
        page: (response.number || 0) + 1, // 转换为从1开始
        pageSize: response.size || pagination.pageSize,
        total: response.totalElements || 0,
      },
    };
  } catch (error) {
    console.error('Failed to fetch users from API:', error);
    throw new Error('Failed to fetch users from server');
  }
};

/**
 * 根据ID获取单个用户
 * @param {string} userId - 用户ID
 * @returns {Promise} 用户数据
 */
export const getUserByIdFromApi = async (userId) => {
  const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.USER_BY_ID}/${userId}`);

  try {
    const user = await apiRequest(url);
    return user;
  } catch (error) {
    console.error(`Failed to fetch user ${userId} from API:`, error);
    throw new Error(`User with ID ${userId} not found`);
  }
};

/**
 * 创建新用户
 * @param {Object} userData - 用户数据
 * @returns {Promise} 创建的用户数据
 */
export const createUserFromApi = async (userData) => {
  const url = buildApiUrl(API_CONFIG.ENDPOINTS.CREATE_USER);

  try {
    const newUser = await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    return newUser;
  } catch (error) {
    console.error('Failed to create user via API:', error);

    // 处理验证错误
    if (error.message.includes('400')) {
      throw {
        type: 'ValidationError',
        errors: { general: 'Invalid user data' },
      };
    }

    throw new Error('Failed to create user');
  }
};

/**
 * 删除用户
 * @param {string} userId - 用户ID
 * @returns {Promise} 删除结果
 */
export const deleteUserFromApi = async (userId) => {
  const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.DELETE_USER}/${userId}`);

  try {
    await apiRequest(url, {
      method: 'DELETE',
    });

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    console.error(`Failed to delete user ${userId} via API:`, error);
    throw new Error(`Failed to delete user with ID ${userId}`);
  }
};

// 导出API服务
const apiService = {
  getUsersFromApi,
  getUserByIdFromApi,
  createUserFromApi,
  deleteUserFromApi,
};

export default apiService;
