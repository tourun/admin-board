/**
 * 用户服务
 * 提供用户数据的CRUD操作API
 * 支持切换mock数据和真实API
 */

import { mockUsers, mockDetailedUsers, simulateNetworkDelay } from './mockData';
import { API_CONFIG } from '../config/api';
import apiService from './apiService';

// 内存中的用户数据（深拷贝避免直接修改mockUsers）
let users = [...mockUsers];
let detailedUsers = [...mockDetailedUsers];

/**
 * 验证用户数据
 * @param {Object} userData - 用户数据对象
 * @returns {Object} - {isValid: boolean, errors: Object}
 */
const validateUser = (userData) => {
  const errors = {};

  // 检查必填字段
  if (!userData.staff_id || userData.staff_id.trim() === '') {
    errors.staff_id = 'Staff ID is required';
  } else if (!/^\d{8}$/.test(userData.staff_id)) {
    errors.staff_id = 'Staff ID must be 8 digits';
  }

  if (!userData.first_name || userData.first_name.trim() === '') {
    errors.first_name = 'First name is required';
  }

  if (!userData.last_name || userData.last_name.trim() === '') {
    errors.last_name = 'Last name is required';
  }

  if (!userData.location || userData.location.trim() === '') {
    errors.location = 'Location is required';
  }

  // 检查员工ID是否重复
  if (userData.staff_id && !errors.staff_id) {
    const existingUser = users.find(
      (user) => user.staff_id === userData.staff_id
    );
    if (existingUser) {
      errors.staff_id = 'Staff ID already exists';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {Object} params.pagination - 分页参数 {current, pageSize}
 * @param {Object} params.filters - 筛选参数（暂时移除 firstName 和 lastName 筛选）
 * @param {Object} params.sorter - 排序参数 {field, order}
 * @returns {Promise} - 返回用户数据和分页信息
 */
export const getUsers = async (params = {}) => {
  try {
    // 根据配置决定使用mock数据还是真实API
    if (API_CONFIG.USE_MOCK) {
      return await getUsersFromMock(params);
    } else {
      return await apiService.getUsersFromApi(params);
    }
  } catch (error) {
    console.error('Failed to get user data:', error);
    throw new Error('Failed to get user data, please try again');
  }
};

/**
 * 从mock数据获取用户列表（原有逻辑）
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回用户数据和分页信息
 */
const getUsersFromMock = async (params = {}) => {
  // 模拟网络延迟
  await simulateNetworkDelay();

  const { pagination = { current: 1, pageSize: 10 }, sorter = {} } = params;

  // 应用筛选
  let filteredUsers = [...users];

  // 应用排序
  if (sorter.field) {
    console.log('🔄 Mock sorting applied:', {
      field: sorter.field,
      order: sorter.order,
    });
    console.log(
      '📄 First few users before sorting:',
      filteredUsers
        .slice(0, 3)
        .map((u) => ({ staff_id: u.staff_id, [sorter.field]: u[sorter.field] }))
    );

    filteredUsers.sort((a, b) => {
      let compareA = a[sorter.field];
      let compareB = b[sorter.field];

      // 字符串类型需要不区分大小写比较
      if (typeof compareA === 'string') {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }

      if (compareA < compareB) {
        return sorter.order === 'ascend' ? -1 : 1;
      }
      if (compareA > compareB) {
        return sorter.order === 'ascend' ? 1 : -1;
      }
      return 0;
    });

    console.log(
      '📄 First few users after sorting:',
      filteredUsers
        .slice(0, 3)
        .map((u) => ({ staff_id: u.staff_id, [sorter.field]: u[sorter.field] }))
    );
  } else {
    console.log('⏭️ No sorting applied, sorter:', sorter);
  }

  // 应用分页
  const total = filteredUsers.length;
  const { current, pageSize } = pagination;
  const startIndex = (current - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return {
    data: paginatedUsers,
    pagination: {
      page: current,
      pageSize,
      total,
    },
  };
};

/**
 * 创建新用户
 * @param {Object} userData - 用户数据
 * @returns {Promise} - 返回创建的用户数据
 */
export const createUser = async (userData) => {
  try {
    // 根据配置决定使用mock数据还是真实API
    if (API_CONFIG.USE_MOCK) {
      return await createUserFromMock(userData);
    } else {
      return await apiService.createUserFromApi(userData);
    }
  } catch (error) {
    console.error('Failed to create user:', error);
    if (error.type === 'ValidationError') {
      throw error;
    }
    throw new Error('Failed to create user, please try again');
  }
};

/**
 * 从mock数据创建新用户（原有逻辑）
 * @param {Object} userData - 用户数据
 * @returns {Promise} - 返回创建的用户数据
 */
const createUserFromMock = async (userData) => {
  // 模拟网络延迟
  await simulateNetworkDelay();

  // 数据验证
  const validation = validateUser(userData);
  if (!validation.isValid) {
    throw {
      type: 'ValidationError',
      errors: validation.errors,
    };
  }

  // 创建新用户
  const now = new Date().toISOString();
  const newUser = {
    id: Math.random().toString(36).substring(2, 10), // 简单的随机ID
    staff_id: userData.staff_id,
    location: userData.location,
    first_name: userData.first_name,
    last_name: userData.last_name,
    created_at: now,
    updated_at: now,
    updated_by: 'system', // 可以根据实际需求修改为当前登录用户
    is_active: userData.is_active !== undefined ? userData.is_active : true,
  };

  // 添加到用户列表
  users = [newUser, ...users];

  return newUser;
};

/**
 * 根据ID获取单个用户详细信息
 * @param {string} userId - 用户ID (staff_id)
 * @returns {Promise} - 返回用户详细数据
 */
export const getUserById = async (userId) => {
  try {
    // 根据配置决定使用mock数据还是真实API
    if (API_CONFIG.USE_MOCK) {
      return await getUserByIdFromMock(userId);
    } else {
      return await apiService.getUserByIdFromApi(userId);
    }
  } catch (error) {
    console.error('Failed to get user:', error);
    throw error;
  }
};

/**
 * 从mock数据获取单个用户详细信息（原有逻辑）
 * @param {string} userId - 用户ID (staff_id)
 * @returns {Promise} - 返回用户详细数据
 */
const getUserByIdFromMock = async (userId) => {
  // 模拟网络延迟
  await simulateNetworkDelay();

  // 根据 staff_id 查找用户详细信息
  const user = detailedUsers.find((u) => u.staff_id === userId);

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  console.log(`user is ${JSON.stringify(user)}`);

  return user;
};

/**
 * 删除用户
 * @param {string} userId - 用户ID (staff_id)
 * @returns {Promise} - 返回删除结果
 */
export const deleteUser = async (userId) => {
  try {
    // 根据配置决定使用mock数据还是真实API
    if (API_CONFIG.USE_MOCK) {
      return await deleteUserFromMock(userId);
    } else {
      return await apiService.deleteUserFromApi(userId);
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};

/**
 * 从mock数据删除用户（原有逻辑）
 * @param {string} userId - 用户ID (staff_id)
 * @returns {Promise} - 返回删除结果
 */
const deleteUserFromMock = async (userId) => {
  // 模拟网络延迟
  await simulateNetworkDelay();

  // 查找用户索引
  const userIndex = users.findIndex((u) => u.staff_id === userId);

  if (userIndex === -1) {
    throw new Error(`User with ID ${userId} not found`);
  }

  // 删除用户
  const deletedUser = users.splice(userIndex, 1)[0];

  return {
    success: true,
    data: deletedUser,
    message: 'User deleted successfully',
  };
};

/**
 * 重置用户数据（用于测试）
 */
export const resetUsers = () => {
  users = [...mockUsers];
  detailedUsers = [...mockDetailedUsers];
};

// 导出用户服务
const userService = {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  resetUsers,
};

export default userService;
