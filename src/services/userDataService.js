/**
 * 用户数据服务
 * 提供统一的用户数据获取逻辑，避免重复代码
 */

import userService from './userService';

/**
 * 获取用户数据的通用函数
 * @param {Object} params - 查询参数
 * @param {Object} params.pagination - 分页参数 {current, pageSize}
 * @param {Object} params.filters - 筛选参数
 * @param {Object} params.sorter - 排序参数
 * @returns {Promise<Object>} 标准化的用户数据响应
 */
export const fetchUsersData = async (params = {}) => {
  const defaultParams = {
    pagination: { current: 1, pageSize: 10 },
    filters: {},
    sorter: {},
  };

  const queryParams = {
    pagination: { ...defaultParams.pagination, ...params.pagination },
    filters: { ...defaultParams.filters, ...params.filters },
    sorter: { ...defaultParams.sorter, ...params.sorter },
  };

  console.log('🔄 fetchUsersData called with queryParams:', queryParams);

  try {
    const response = await userService.getUsers(queryParams);

    return {
      success: true,
      users: response.data,
      pagination: {
        current: response.pagination.page,
        pageSize: response.pagination.pageSize,
        total: response.pagination.total,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      users: [],
      pagination: {
        current: queryParams.pagination.current,
        pageSize: queryParams.pagination.pageSize,
        total: 0,
      },
      error: error.message || 'Failed to fetch users',
    };
  }
};

export default { fetchUsersData };
