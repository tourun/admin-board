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
 * 字段映射：将API返回的字段名映射到前端使用的字段名
 * @param {Object} apiUser - API返回的用户对象
 * @returns {Object} 前端使用的用户对象
 */
const mapApiUserToFrontend = (apiUser) => {
  return {
    id: apiUser.userId,
    staff_id: apiUser.staffId,
    first_name: apiUser.firstName,
    last_name: apiUser.lastName,
    location: apiUser.locationCode,
    is_active: apiUser.active,
    // 保留原始API字段以备后用
    userId: apiUser.userId,
    staffId: apiUser.staffId,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    locationCode: apiUser.locationCode,
    active: apiUser.active,
  };
};

/**
 * 字段映射：将前端字段名映射到API字段名
 * @param {string} frontendField - 前端字段名
 * @returns {string} API字段名
 */
const mapFrontendFieldToApi = (frontendField) => {
  const fieldMap = {
    id: 'userId',
    staff_id: 'staffId',
    first_name: 'firstName',
    last_name: 'lastName',
    location: 'locationCode',
    is_active: 'active',
  };
  return fieldMap[frontendField] || frontendField;
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
    page: pagination.current - 1, // API从0开始计数
    size: pagination.pageSize,
  };

  // 添加排序参数
  if (sorter.field) {
    // 将前端字段名映射到API字段名
    const apiField = mapFrontendFieldToApi(sorter.field);
    const order = sorter.order === 'descend' ? 'DESC' : 'ASC';
    queryParams.sort = `${apiField},${order}`;
  }

  const url = buildApiUrl(API_CONFIG.ENDPOINTS.USERS, queryParams);

  try {
    const response = await apiRequest(url);

    // 映射API返回的用户数据到前端格式
    const mappedUsers = (response.content || []).map(mapApiUserToFrontend);

    return {
      data: mappedUsers,
      pagination: {
        page: (response.pageable?.pageNumber || 0) + 1, // 转换为从1开始
        pageSize: response.pageable?.pageSize || pagination.pageSize,
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
 * @param {string} userId - 用户ID (staffId)
 * @returns {Promise} 用户数据
 */
export const getUserByIdFromApi = async (userId) => {
  const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.USER_BY_ID}/${userId}`);

  try {
    const apiUser = await apiRequest(url);
    // 映射API返回的用户数据到前端格式
    return mapApiUserToFrontend(apiUser);
  } catch (error) {
    console.error(`Failed to fetch user ${userId} from API:`, error);
    throw new Error(`User with ID ${userId} not found`);
  }
};

/**
 * 将前端用户数据映射到API格式
 * @param {Object} frontendUser - 前端用户对象
 * @returns {Object} API格式的用户对象
 */
const mapFrontendUserToApi = (frontendUser) => {
  return {
    staffId: frontendUser.staff_id,
    firstName: frontendUser.first_name,
    lastName: frontendUser.last_name,
    locationCode: frontendUser.location,
    active:
      frontendUser.is_active !== undefined ? frontendUser.is_active : true,
  };
};

/**
 * 创建新用户
 * @param {Object} userData - 用户数据
 * @returns {Promise} 创建的用户数据
 */
export const createUserFromApi = async (userData) => {
  const url = buildApiUrl(API_CONFIG.ENDPOINTS.CREATE_USER);

  // 将前端数据格式映射到API格式
  const apiUserData = mapFrontendUserToApi(userData);

  try {
    const apiUser = await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(apiUserData),
    });

    // 映射API返回的用户数据到前端格式
    return mapApiUserToFrontend(apiUser);
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
 * @param {string} userId - 用户ID (staffId)
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
  mapApiUserToFrontend,
  mapFrontendUserToApi,
};

export default apiService;
